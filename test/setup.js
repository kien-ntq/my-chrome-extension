import { promises } from 'fs';
const { mkdir, writeFile } = promises;
import { tmpdir } from 'os';
import { join } from 'path';
import { launch } from 'puppeteer';

//const DIR = join(tmpdir(), 'jest_puppeteer_global_setup');
const DIR = join('./tmp', 'jest_puppeteer_global_setup');
const pathToExtension = join(process.cwd(), '/dist');

export default async function () {
  // Launch the browser.
  const browser = await launch({
    headless: false,
    pipe: true,
    enableExtensions: [pathToExtension],
    userDataDir: join('./tmp', 'user-data-dir'),
    //devtools: true,
  });
  // store the browser instance so we can teardown it later
  // this global is only available in the teardown but not in TestEnvironments
  globalThis.__BROWSER_GLOBAL__ = browser;
  const workerTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
    // Assumes that there is only one service worker created by the extension and its URL ends with background.js.
    target =>
      target.type() === 'service_worker' &&
      target.url().endsWith('background.js'),
  );
  let worker = await workerTarget.worker();
  globalThis.__WORKER_GLOBAL__ = worker;
  async function openPopup() {
    await globalThis.__WORKER_GLOBAL__.evaluate('chrome.action.openPopup();');
    const popupTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
      target => target.type() === 'page' && target.url().endsWith('popup.html'),
    );
    return await popupTarget.asPage();
  }
  let popupPage = await openPopup();
  globalThis.__PPAGE_GLOBAL__ = popupPage;
  // use the file system to expose the wsEndpoint for TestEnvironments
  await mkdir(DIR, {recursive: true});
  //await writeFile(join(DIR, 'wsEndpoint'), browser.wsEndpoint());
};

