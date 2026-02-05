import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join('./tmp', 'jest_puppeteer_global_setup');
export default async function () {
  globalThis.__BROWSER_GLOBAL__.disconnect();
  // close the browser instance
  await globalThis.__BROWSER_GLOBAL__.close();
  globalThis.__WORKER_GLOBAL__ = undefined;

  // clean-up the wsEndpoint file
  await fs.rm(DIR, {recursive: true, force: true});
};