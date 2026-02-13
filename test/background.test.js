describe('Background State', () => {
    const { BackgroundState } = require('../src/js/background/BackgroundState.js');

    it('Should record activated tab', async () => {
        const backgroundState = new BackgroundState();
        backgroundState.tabActivated({ id: 1 });
        expect(backgroundState.getRecentTabIds()).toEqual([1]);
    });

    it('Should record most recent tab first', async () => {
        const backgroundState = new BackgroundState();
        backgroundState.tabActivated({ id: 1 });
        backgroundState.tabActivated({ id: 2 });
        expect(backgroundState.getRecentTabIds()).toEqual([2, 1]);
    });

    it('Should move re-activated tab to front', async () => {
        const background = new BackgroundState();
        background.tabActivated({ id: 1 });
        background.tabActivated({ id: 2 });
        background.tabActivated({ id: 1 });
        expect(background.getRecentTabIds()).toEqual([1, 2]);
    });
});