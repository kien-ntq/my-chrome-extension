describe('Messenger', () => {
    const { Messenger } = require('../src/js/Messenger.js');
    const { BackgroundState } = require('../src/js/background/BackgroundState.js');
    const { ChromeAPI } = require('../src/js/ChromeAPI.js');
    let messenger;
    let backgroundState;

    beforeEach(() => {
        backgroundState = new BackgroundState();
    });

    const mockMessages = {
        GET_RECENT_TABS: { tabIds: [1, 2, 3] },
        GET_SYNCHRONIZE_GROUP: { tabIds: [1, 3] }
    };

    const chromeAPI = {
        sendMessageWithCallback: (message, callback) => {
            callback(mockMessages[message.type]);
        }
    }

    it('Should be able to getRecentTabs', async () => {
        messenger = new Messenger(chromeAPI);
        const recentTabs = await messenger.getRecentTabsFromBackground();
        expect(recentTabs).toEqual([1, 2, 3]);
    });

    it('Should be able to getSynchronizeGroup', async () => {
        messenger = new Messenger(chromeAPI);
        const synchronizeGroup = await messenger.getSynchronizeGroupFromBackground();
        expect(synchronizeGroup).toEqual([1, 3]);
    });
});