#!/usr/bin/env node
const { existsSync } = require('fs');
const { join } = require('path');
const { execSync } = require('child_process');

if (!existsSync(join(__dirname, 'node_modules'))) {
  console.log('No node_modules installing');
  execSync('npm ci', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: process.env.SHELL,
  });
}

if (!existsSync(join(__dirname, 'build'))) {
  console.log('Creating build');
  execSync('npm run build', {
    cwd: __dirname,
    stdio: 'inherit',
    shell: process.env.SHELL,
  });
}

const command = `node build/dist/main.js ${process.argv.slice(2).join(' ')}`;
console.log('Executing: ', command);
try {
  execSync(command, {
    cwd: __dirname,
    stdio: 'inherit',
    shell: process.env.SHELL,
  });
} catch (e) {
  if (e.status) {
    process.exit(e.status);
    return;
  }
  throw e;
}
