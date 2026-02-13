describe('Background State', () => {
    const { BackgroundImpl } = require('../../src/js/background/BackgroundImpl.js');

    describe('Recent Tabs Tracking', () => {
        it('Should record activated tab', async () => {
            const background = new BackgroundImpl();
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 1 } });
            expect(background._getRecentTabIds()).toEqual([1]);
        });

        it('Should record most recent tab first', async () => {
            const background = new BackgroundImpl();
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 1 } });
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 2 } });
            expect(background._getRecentTabIds()).toEqual([2, 1]);
        });

        it('Should move re-activated tab to front', async () => {
            const background = new BackgroundImpl();
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 1 } });
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 2 } });
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 1 } });
            expect(background._getRecentTabIds()).toEqual([1, 2]);
        });

        it('Should response to GET_RECENT_TABS message', async () => {
            const background = new BackgroundImpl();
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 1 } });
            background.onMessage({ type: 'TAB_ACTIVATED', payload: { id: 2 } });
            const cb = jest.fn((response) => {
            });
            background.onMessageWithCallback({ type: 'GET_RECENT_TABS' }, cb);
            expect(cb).toHaveBeenCalledWith({ tabIds: [2, 1] });
        });
    });

    describe('Synchronize Group Tracking', () => {
        it('Should track synchronize group', async () => {
            const background = new BackgroundImpl();
            background.addToSynchronizeGroup({ id: 1 });
            background.addToSynchronizeGroup({ id: 2 });
            const cb = jest.fn();
            background.onMessageWithCallback({ type: 'GET_SYNCHRONIZE_GROUP' }, cb);
            expect(cb).toHaveBeenCalledWith({ tabIds: [1, 2] });
        });
    });
});