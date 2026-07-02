const fs = require('fs');
const path = require('path');
const { createClient } = require('@supabase/supabase-js');

function loadDotEnv(filePath) {
  if (!fs.existsSync(filePath)) return;

  const content = fs.readFileSync(filePath, 'utf8');
  for (const line of content.split(/\r?\n/)) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#') || !trimmed.includes('=')) continue;

    const index = trimmed.indexOf('=');
    const key = trimmed.slice(0, index).trim();
    let value = trimmed.slice(index + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }

    if (!process.env[key]) {
      process.env[key] = value;
    }
  }
}

function parseArgs(argv) {
  const args = {
    bucket: 'template-pdfs',
    file: null,
    folder: null,
    object: null,
    prefix: 'templates',
    private: false,
    recursive: false,
    dryRun: false,
    fileSizeLimitMb: 500,
    skipOverLimit: false,
  };

  for (let i = 2; i < argv.length; i += 1) {
    const arg = argv[i];
    const next = argv[i + 1];

    if (arg === '--bucket' && next) {
      args.bucket = next;
      i += 1;
    } else if (arg === '--file' && next) {
      args.file = next;
      i += 1;
    } else if (arg === '--folder' && next) {
      args.folder = next;
      i += 1;
    } else if (arg === '--object' && next) {
      args.object = next.replace(/\\/g, '/');
      i += 1;
    } else if (arg === '--prefix' && next) {
      args.prefix = next.replace(/\\/g, '/').replace(/^\/+|\/+$/g, '');
      i += 1;
    } else if (arg === '--file-size-limit-mb' && next) {
      args.fileSizeLimitMb = Number(next);
      i += 1;
    } else if (arg === '--private') {
      args.private = true;
    } else if (arg === '--recursive') {
      args.recursive = true;
    } else if (arg === '--dry-run') {
      args.dryRun = true;
    } else if (arg === '--skip-over-limit') {
      args.skipOverLimit = true;
    } else if (!args.file) {
      args.file = arg;
    }
  }

  return args;
}

async function ensureBucket(supabase, bucket, isPublic, fileSizeLimitBytes) {
  const { data: buckets, error: listError } = await supabase.storage.listBuckets();
  if (listError) {
    throw new Error(`Cannot list buckets: ${listError.message}`);
  }

  const existing = buckets.find((item) => item.name === bucket);
  if (existing) {
    const { error: updateError } = await supabase.storage.updateBucket(bucket, {
      public: isPublic,
      allowedMimeTypes: ['application/pdf'],
      fileSizeLimit: fileSizeLimitBytes,
    });

    if (updateError) {
      console.log(`Could not update existing bucket settings: ${updateError.message}`);
    }
    return;
  }

  const { error: createError } = await supabase.storage.createBucket(bucket, {
    public: isPublic,
    allowedMimeTypes: ['application/pdf'],
    fileSizeLimit: fileSizeLimitBytes,
  });

  if (createError) {
    throw new Error(`Cannot create bucket "${bucket}": ${createError.message}`);
  }
}

function getPdfFilesFromFolder(folderPath, recursive) {
  const files = [];
  const entries = fs.readdirSync(folderPath, { withFileTypes: true });

  for (const entry of entries) {
    const entryPath = path.join(folderPath, entry.name);
    if (entry.isDirectory() && recursive) {
      files.push(...getPdfFilesFromFolder(entryPath, recursive));
    } else if (entry.isFile() && entry.name.toLowerCase().endsWith('.pdf')) {
      files.push(entryPath);
    }
  }

  return files;
}

function makeSafeObjectPath(value) {
  const normalized = value
    .replace(/\\/g, '/')
    .replace(/^\/+/, '')
    .split('/')
    .map((segment) => segment
      .replace(/đ/g, 'd')
      .replace(/Đ/g, 'D')
      .normalize('NFD')
      .replace(/[\u0300-\u036f]/g, '')
      .replace(/[^a-zA-Z0-9._-]+/g, '-')
      .replace(/-+/g, '-')
      .replace(/^-+|-+$/g, '')
      .trim())
    .filter(Boolean)
    .join('/');

  return normalized || 'file.pdf';
}

function buildUploadItems(args) {
  if (args.file && args.folder) {
    throw new Error('Use either --file or --folder, not both.');
  }

  if (args.file) {
    const filePath = path.resolve(args.file);
    if (!fs.existsSync(filePath)) {
      throw new Error(`PDF not found: ${filePath}`);
    }

    const stat = fs.statSync(filePath);
    if (!stat.isFile()) {
      throw new Error(`Not a file: ${filePath}`);
    }

    return [{
      filePath,
      objectPath: makeSafeObjectPath(args.object || `${args.prefix}/${path.basename(filePath)}`),
      size: stat.size,
    }];
  }

  if (args.folder) {
    const folderPath = path.resolve(args.folder);
    if (!fs.existsSync(folderPath)) {
      throw new Error(`Folder not found: ${folderPath}`);
    }

    const stat = fs.statSync(folderPath);
    if (!stat.isDirectory()) {
      throw new Error(`Not a folder: ${folderPath}`);
    }

    const files = getPdfFilesFromFolder(folderPath, args.recursive);
    return files.map((filePath) => {
      const relativePath = path.relative(folderPath, filePath);
      return {
        filePath,
        objectPath: makeSafeObjectPath(`${args.prefix}/${relativePath}`),
        size: fs.statSync(filePath).size,
      };
    });
  }

  throw new Error('Missing PDF path. Use --file "C:\\path\\file.pdf" or --folder "C:\\path\\folder".');
}

function csvEscape(value) {
  const text = String(value ?? '');
  if (/[",\r\n]/.test(text)) {
    return `"${text.replace(/"/g, '""')}"`;
  }
  return text;
}

function writeManifest(records) {
  const outputDir = path.resolve(process.cwd(), 'scratch');
  fs.mkdirSync(outputDir, { recursive: true });

  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const jsonPath = path.join(outputDir, `supabase-storage-upload-${timestamp}.json`);
  const csvPath = path.join(outputDir, `supabase-storage-upload-${timestamp}.csv`);

  fs.writeFileSync(jsonPath, JSON.stringify(records, null, 2), 'utf8');

  const headers = ['localPath', 'bucket', 'objectPath', 'sizeBytes', 'publicUrl'];
  const rows = [
    headers.join(','),
    ...records.map((record) => headers.map((header) => csvEscape(record[header])).join(',')),
  ];
  fs.writeFileSync(csvPath, rows.join('\n'), 'utf8');

  return { jsonPath, csvPath };
}

async function main() {
  loadDotEnv(path.resolve(process.cwd(), '.env'));

  const args = parseArgs(process.argv);
  if (!Number.isFinite(args.fileSizeLimitMb) || args.fileSizeLimitMb <= 0) {
    throw new Error('--file-size-limit-mb must be a positive number.');
  }

  const uploadItems = buildUploadItems(args);
  if (uploadItems.length === 0) {
    throw new Error('No PDF files found.');
  }

  const fileSizeLimitBytes = args.fileSizeLimitMb * 1024 * 1024;
  const oversizedItems = uploadItems.filter((item) => item.size > fileSizeLimitBytes);
  if (oversizedItems.length > 0 && !args.skipOverLimit) {
    console.log(`These file(s) are larger than --file-size-limit-mb ${args.fileSizeLimitMb}:`);
    for (const item of oversizedItems) {
      console.log(`- ${item.filePath} (${Math.round(item.size / 1024 / 1024)} MB)`);
    }
    throw new Error('Increase --file-size-limit-mb, compress these PDFs, or add --skip-over-limit to upload only the smaller files.');
  }

  const filteredUploadItems = args.skipOverLimit
    ? uploadItems.filter((item) => item.size <= fileSizeLimitBytes)
    : uploadItems;

  if (filteredUploadItems.length === 0) {
    throw new Error('No PDF files are within the configured size limit.');
  }

  console.log(`Found ${uploadItems.length} PDF file(s):`);
  for (const item of filteredUploadItems) {
    console.log(`- ${item.filePath} -> ${args.bucket}/${item.objectPath} (${Math.round(item.size / 1024 / 1024)} MB)`);
  }
  if (args.skipOverLimit && oversizedItems.length > 0) {
    console.log(`Skipping ${oversizedItems.length} oversized file(s).`);
  }

  if (args.dryRun) {
    console.log('Dry run only. Nothing was uploaded.');
    return;
  }

  const supabaseUrl = process.env.SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error('Missing SUPABASE_URL or VITE_SUPABASE_URL.');
  }

  if (!serviceRoleKey) {
    throw new Error('Missing SUPABASE_SERVICE_ROLE_KEY. Get it from Supabase Dashboard > Project Settings > API.');
  }

  const isPublic = !args.private;
  const supabase = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  console.log(`Creating bucket if needed: ${args.bucket}`);
  await ensureBucket(supabase, args.bucket, isPublic, fileSizeLimitBytes);

  const records = [];
  for (let index = 0; index < filteredUploadItems.length; index += 1) {
    const item = filteredUploadItems[index];
    console.log(`Uploading ${index + 1}/${filteredUploadItems.length}: ${item.objectPath}`);

    const fileBuffer = fs.readFileSync(item.filePath);
    const { error: uploadError } = await supabase.storage
      .from(args.bucket)
      .upload(item.objectPath, fileBuffer, {
        contentType: 'application/pdf',
        upsert: true,
      });

    if (uploadError) {
      throw new Error(`Upload failed for ${item.filePath}: ${uploadError.message}`);
    }

    let publicUrl = '';
    if (isPublic) {
      const { data } = supabase.storage.from(args.bucket).getPublicUrl(item.objectPath);
      publicUrl = data.publicUrl;
    } else {
      const { data, error } = await supabase.storage.from(args.bucket).createSignedUrl(item.objectPath, 60 * 60 * 24 * 7);
      if (!error) {
        publicUrl = data.signedUrl;
      }
    }

    records.push({
      localPath: item.filePath,
      bucket: args.bucket,
      objectPath: item.objectPath,
      sizeBytes: item.size,
      publicUrl,
    });

    console.log(`Done: ${publicUrl || `${args.bucket}/${item.objectPath}`}`);
  }

  const manifest = writeManifest(records);
  console.log('Upload complete.');
  console.log(`Manifest JSON: ${manifest.jsonPath}`);
  console.log(`Manifest CSV: ${manifest.csvPath}`);
}

main().catch((error) => {
  console.error(error.message);
  process.exit(1);
});
