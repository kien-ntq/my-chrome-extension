import { launch } from 'puppeteer';
import puppeteer from 'puppeteer';
import path from 'path';

const EXTENSION_PATH = './dist';
const pathToExtension = path.join(process.cwd(), '/dist');
const EXTENSION_ID = 'kfnlegigggchfakaefjomdlbhinmeiih';

let browser;
let workerTarget;
let worker;

beforeEach(async () => {
  // Launch the browser.
  browser = await launch({
    headless: false,
    pipe: true,
    enableExtensions: [pathToExtension],
    userDataDir: './tmp/user-data-dir',
    //devtools: true,
  });
  workerTarget = await browser.waitForTarget(
    // Assumes that there is only one service worker created by the extension and its URL ends with background.js.
    target =>
      target.type() === 'service_worker' &&
      target.url().endsWith('background.js'),
  );
  
  worker = await workerTarget.worker();

});

afterEach(async () => {
  // Close the browser.
  await browser.close();
  browser = undefined;
  workerTarget = undefined;
  worker = undefined;
});

test('popup renders correctly', async () => {
  //const page = await browser.newPage();
  //await page.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);
  await worker.evaluate('chrome.action.openPopup();');
  const popupTarget = await browser.waitForTarget(
    // Assumes that there is only one page with the URL ending with popup.html
    // and that is the popup created by the extension.
    target => target.type() === 'page' && target.url().endsWith('popup.html'),
  );
  const popupPage = await popupTarget.asPage();


  /* await page.evaluate(() => {
    debugger;
  }); */

  const list = await popupPage.$('ul');
  const children = await list.$$('li');

  expect(children.length).toBe(1);
});
