import { runMain } from './utils/app-utils';
import { createCommand } from 'commander';
import { decryptDir, encryptDir } from './utils/encrypt-utils';

async function main(): Promise<void> {
  const program = createCommand();
  console.log('encrypted-fs utility');
  program
    .command('encrypt <from> <into>')
    .description('encrypt folder')
    .action(async (from, to) => {
      console.log('Encryption of folder: ', from, to);
      await encryptDir(from, to);
    });
  program
    .command('decrypt <from> <into>')
    .description('decrypt folder')
    .action(async (from, to) => {
      await decryptDir(from, to);
    });
  await program.parseAsync(process.argv);
}

runMain(main);
