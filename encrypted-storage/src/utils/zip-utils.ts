import { ensureDir, pathExists } from 'fs-extra';
import { execSync } from './exec-utils';

export async function extractFile(from: string, to: string): Promise<void> {
  const exists = await pathExists(from);
  if (!exists) {
    throw new Error(`Cannot extract ${from} do not exists`);
  }
  await ensureDir(to);
  execSync(`unzip -o "${from}" -d "${to}" > /dev/null`);
}

export async function createArchive(from: string, to: string): Promise<void> {
  const exists = await pathExists(from);
  if (!exists) {
    throw new Error(`Cannot extract ${from} do not exists`);
  }
  execSync(`zip -r "${to}" * > /dev/null`, {
    cwd: from,
  });
}
