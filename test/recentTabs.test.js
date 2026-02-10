import { expect } from "@playwright/test";

describe('Recent Tabs Mode', () => {
  let extensionGlobal = globalThis.__EXTENSION_GLOBAL__;
  let popupPage;
  let browser = globalThis.__BROWSER_GLOBAL__;

  async function typeT() {
    await popupPage.keyboard.type('t');
  }

  async function currentMode() {
    const activeMode = await popupPage.$eval('#mode-indicator', el => el.textContent);
    return activeMode;
  }

  beforeAll(async () => {
  });

  it('should switch to recent tabs mode when I press [T]', async () => {
    popupPage = await extensionGlobal.openPopup();
    // await popupPage.reload();
    expect(await currentMode()).not.toBe('Recent Tabs Mode');
    await typeT();
    expect(await currentMode()).toBe('Recent Tabs Mode');
  });

  it('should show recent tabs', async () => {
    function examplePageContent(pageName) {
      return `<html><head><title>${pageName}</title></head><body><h1>${pageName}</h1></body></html>`
    }
    async function newPageWithContent(content) {
      let newPage = await browser.newPage();
      await newPage.setContent(content);
      return newPage;
    }
    await newPageWithContent(examplePageContent('Page 1'));
    await newPageWithContent(examplePageContent('Page 2'));
    popupPage = await extensionGlobal.openPopup();
    await typeT();
    async function recentTabsContains(content) {
      return await popupPage.$eval('#recent-tabs-list', el =>
        Array.from(el.querySelectorAll('li')).some(li => li.textContent.includes(content))
      );
    }
    expect(await recentTabsContains('Page 1')).toBe(true);
    expect(await recentTabsContains('Page 2')).toBe(true);
  });

  afterAll(async () => {
    //await popupPage.close();
  });
});

