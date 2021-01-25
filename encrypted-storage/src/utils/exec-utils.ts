import { execSync as execS, ExecSyncOptions } from 'child_process';

const DEFAULT_OPTIONS: ExecSyncOptions = {
  stdio: 'inherit',
  shell: process.env.SHELL,
};

export function execSync(command: string, options?: ExecSyncOptions): void {
  console.log(`Executing: ${command}`);
  if (options && options.cwd) {
    console.log(`From: ${options.cwd}`);
  }
  const _options: ExecSyncOptions = options
    ? { ...options, ...DEFAULT_OPTIONS}
    : DEFAULT_OPTIONS;
  execS(command, _options);
}
