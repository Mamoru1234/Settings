import { pipeline } from 'stream';

export function runMain(task: () => Promise<void>) {
  task().catch((e) => {
    console.log('Error in main');
    console.log(e);
  });
}

export const pipelineAsync = (...streams: any[]): Promise<void> => {
  return new Promise((res, rej) => {
    pipeline(streams[0], ...streams.slice(1), (err: any) => {
      if (err) {
        rej(err);
        return;
      }
      res();
    });
  });
};
