
import { createClient } from "@supabase/supabase-js";

import fs from "fs";

import path from "path";



const SUPABASE_URL = "https://zncvhhibbnpcihsualen.supabase.co";

const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InpuY3ZoaGliYm5wY2loc3VhbGVuIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc3ODY0Mzc4NCwiZXhwIjoyMDk0MjE5Nzg0fQ.EGriew7C-_KTut8t9bagPwkaq89NF9Gerdv5etCu_1E";

const BUCKET = "templates";



const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

const rootDir = path.resolve("public");

const allowedExt = [".png", ".jpg", ".jpeg", ".webp"];



function removeVietnamese(str) {

  return str

    .normalize("NFD")

    .replace(/[\u0300-\u036f]/g, "")

    .replace(/đ/g, "d")

    .replace(/Đ/g, "D");

}



function safeName(str) {

  return removeVietnamese(str)

    .toLowerCase()

    .replace(/[^a-z0-9._/-]+/g, "-")

    .replace(/-+/g, "-")

    .replace(/\/-/g, "/")

    .replace(/-\//g, "/")

    .replace(/^-|-$/g, "");

}



function walk(dir) {

  let files = [];

  for (const item of fs.readdirSync(dir, { withFileTypes: true })) {

    const fullPath = path.join(dir, item.name);

    if (item.isDirectory()) {

      files = files.concat(walk(fullPath));

    } else {

      files.push(fullPath);

    }

  }

  return files;

}



function getContentType(file) {

  const ext = path.extname(file).toLowerCase();

  if (ext === ".png") return "image/png";

  if (ext === ".jpg" || ext === ".jpeg") return "image/jpeg";

  if (ext === ".webp") return "image/webp";

  return "application/octet-stream";

}



async function main() {

  const files = walk(rootDir).filter(file =>

    allowedExt.includes(path.extname(file).toLowerCase())

  );



  console.log("Tim thay", files.length, "file anh trong public");



  let okCount = 0;

  let failCount = 0;



  for (const file of files) {

    const relativePath = path.relative(rootDir, file).replaceAll("\\", "/");

    const uploadPath = safeName(relativePath);



    console.log("Uploading:", relativePath, "=>", uploadPath);



    const fileBuffer = fs.readFileSync(file);



    const { error } = await supabase.storage

      .from(BUCKET)

      .upload(uploadPath, fileBuffer, {

        upsert: true,

        contentType: getContentType(file),

      });



    if (error) {

      failCount++;

      console.error("LOI:", uploadPath, error.message);

    } else {

      okCount++;

      console.log("OK:", uploadPath);

    }

  }



  console.log("XONG. Thanh cong:", okCount, "| Loi:", failCount);

}



main();

