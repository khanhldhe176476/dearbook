const { spawnSync } = require('child_process');
const path = require('path');
const fs = require('fs');

const rootDir = path.resolve(__dirname, '..');
const args = process.argv.slice(2);
const command = args[0] || 'dev';
const extraArgs = args.slice(1);
const majorVersion = Number(process.versions.node.split('.')[0]);

if (majorVersion < 18 && process.platform === 'win32' && !process.env.DEARBOOK_NODE22_ACTIVE) {
  const portableNode = path.join(rootDir, '.tools', 'node-v22.23.1-win-x64', 'node.exe');
  if (fs.existsSync(portableNode)) {
    const result = spawnSync(portableNode, [__filename, ...args], {
      cwd: rootDir,
      stdio: 'inherit',
      env: {
        ...process.env,
        DEARBOOK_NODE22_ACTIVE: '1',
      },
    });
    process.exit(result.status ?? 1);
  }
}

if (majorVersion < 18) {
  console.error(`Node ${process.version} is not supported by Vite 6. Please use Node 18 or newer.`);
  process.exit(1);
}

const viteBin = path.join(rootDir, 'node_modules', 'vite', 'bin', 'vite.js');
const viteArgs = command === 'build' ? ['build', ...extraArgs] : extraArgs;

const result = spawnSync(process.execPath, [viteBin, ...viteArgs], {
  cwd: rootDir,
  stdio: 'inherit',
  env: process.env,
});

process.exit(result.status ?? 1);
