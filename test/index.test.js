import { launch } from 'puppeteer';
import puppeteer from 'puppeteer';

const EXTENSION_PATH = './dist';
const EXTENSION_ID = 'kfnlegigggchfakaefjomdlbhinmeiih';

describe('popup', () => {
  it('should renders correctly', async () => {
    //const page = await browser.newPage();
    //await page.goto(`chrome-extension://${EXTENSION_ID}/popup.html`);
    await globalThis.__WORKER_GLOBAL__.evaluate('chrome.action.openPopup();');
    const popupTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
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
});
