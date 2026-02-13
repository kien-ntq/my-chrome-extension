describe('Messenger', () => {
    const { Messenger } = require('../src/js/Messenger.js');
    const { BackgroundState } = require('../src/js/background/BackgroundState.js');
    const { ChromeAPI } = require('../src/js/ChromeAPI.js');
    let messenger;
    let backgroundState;

    beforeEach(() => {
        backgroundState = new BackgroundState();
    });

    const chromeAPI = {
        sendMessageWithCallback: (message, callback) => {
            if (message.type === "GET_RECENT_TABS") {
                callback({ tabIds: [1, 2, 3] });
            }
        }
    }

    it('Should be able to getRecentTabs', async () => {
        messenger = new Messenger(chromeAPI);
        const recentTabs = await messenger.getRecentTabsFromBackground();
        expect(recentTabs).toEqual([1, 2, 3]);
    });
});