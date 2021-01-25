import { pathExists, stat, mkdtemp, remove, ensureDir } from 'fs-extra';
import { join, basename } from 'path';
import { tmpdir } from 'os';
import { createArchive, extractFile } from './zip-utils';
import { createCipheriv, createDecipheriv, scrypt } from 'crypto';
import { pipelineAsync } from './app-utils';
import { createReadStream, createWriteStream } from 'fs';

const PASSWORD = '123';
const SALT = 'SALT';
const ALGORITHM = 'AES-256-CBC';
const KEY_SIZE = 32;
const IV_SIZE = 16;

function scryptAsync(password: string | Buffer, salt: Buffer, keyLength: number): Promise<Buffer> {
  return new Promise((res, rej) => {
    scrypt(password, salt, keyLength, (err, result) => {
      if (err) {
        rej(err);
        return;
      }
      res(result);
    });
  });
}

//node build/dist/main.js encrypt ~/Dropbox/patches/pet ~/temp

export async function encryptDir(from: string, to: string): Promise<void> {
  if (! await pathExists(from)) {
    throw new Error(`Path do not exists: ${from}`);
  }
  const pathStat = await stat(from);
  if (!pathStat.isDirectory()) {
    throw new Error(`Path should be directory: ${from}`);
  }
  const taskDir = await mkdtemp(join(tmpdir(), 'encrypted-fs-'));
  await createArchive(from, join(taskDir, 'data.zip'));
  const iv = Buffer.alloc(IV_SIZE);
  const key = await scryptAsync(PASSWORD, Buffer.from(SALT), KEY_SIZE);
  const cipher = createCipheriv(ALGORITHM, key, iv);
  const base = basename(from);
  const resultName = `${base}.zip`;
  await ensureDir(to);
  await pipelineAsync(createReadStream(join(taskDir, 'data.zip')), cipher, createWriteStream(join(to, resultName)));
  await remove(taskDir);
}

//node build/dist/main.js decrypt ~/temp/pet.zip ~/temp/pet

export async function decryptDir(from: string, to: string): Promise<void> {
  if (! await pathExists(from)) {
    throw new Error(`Path do not exists: ${from}`);
  }
  const pathStat = await stat(from);
  if (!pathStat.isFile()) {
    throw new Error(`Path should be file: ${from}`);
  }
  const taskDir = await mkdtemp(join(tmpdir(), 'encrypted-fs-'));
  const iv = Buffer.alloc(IV_SIZE);
  const key = await scryptAsync(PASSWORD, Buffer.from(SALT), KEY_SIZE);
  const decipher = createDecipheriv(ALGORITHM, key, iv);
  await pipelineAsync(createReadStream(from), decipher, createWriteStream(join(taskDir, 'data.zip')));
  await extractFile(join(taskDir, 'data.zip'), to);
  await remove(taskDir);
}
