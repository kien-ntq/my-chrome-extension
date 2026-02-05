describe('last tabs', () => {
  let popupPage;

  async function typeT() {
    await popupPage.keyboard.type('t');
  }

  async function recentTabsModeIsActive() {
    const activeMode = await popupPage.$eval('#mode-indicator', el => el.textContent);
    expect(activeMode).toBe('Recent Tabs Mode');
  }

  beforeAll(async () => {
    popupPage = globalThis.__PPAGE_GLOBAL__;
    await popupPage.reload();
  });

  it('should switch to recent tabs mode when I press [T]', async () => {
    await typeT();
    await recentTabsModeIsActive();
  });

  afterAll(async () => {
    //await popupPage.close();
  });
});

