import { createInterface } from 'readline';

export async function readLine(prompt: string): Promise<string> {
  return new Promise((res) => {
    const rl = createInterface({
      input: process.stdin,
      output: process.stdout,
    });
    rl.question(prompt, (answer)  => {
      rl.close();
      res(answer);
    });
  });
}
