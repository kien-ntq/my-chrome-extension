describe('last tabs', () => {
  let popupPage;
  async function openPopup() {
    await globalThis.__WORKER_GLOBAL__.evaluate('chrome.action.openPopup();');
    const popupTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
      target => target.type() === 'page' && target.url().endsWith('popup.html'),
    );
    return await popupTarget.asPage();
  }

  async function typeT() {
    await popupPage.keyboard.type('t');
  }

  async function recentTabsModeIsActive() {
    const activeMode = await popupPage.$eval('#mode-indicator', el => el.textContent);
    expect(activeMode).toBe('Recent Tabs Mode');
  }

  beforeAll(async () => {
    popupPage = await openPopup();
  });

  it('should switch to recent tabs mode when I press [T]', async () => {
    await typeT();
    await recentTabsModeIsActive();
  });

  it('should renders correctly', async () => {
    const list = await popupPage.$('ul');
    const children = await list.$$('li');

    expect(children.length).toBe(1);
  });

  afterAll(async () => {
    //await popupPage.close();
  });
});

