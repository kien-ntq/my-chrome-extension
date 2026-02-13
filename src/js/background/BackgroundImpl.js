export class BackgroundImpl {
    constructor() {
        this.recentTabIds = [];
        this.synchronizeGroupTabIds = [];
    }

    onMessage(message) {
        console.log("BackgroundImpl received message:", message);
        if (message.type === 'TAB_ACTIVATED') {
            this._tabActivated(message.payload);
        }
    }

    onMessageWithCallback(message, sendResponse) {
        if (message.type === 'GET_RECENT_TABS') {
            sendResponse({ tabIds: this._getRecentTabIds() });
        } else if (message.type === 'GET_SYNCHRONIZE_GROUP') {
            sendResponse({ tabIds: this._getSynchronizeGroupTabIds() });
        }
    }

    _tabActivated(tab) {
        this.recentTabIds = this.recentTabIds.filter(id => id !== tab.id);
        this.recentTabIds.unshift(tab.id);
    }

    _getRecentTabIds() {
        return this.recentTabIds;
    }

    addToSynchronizeGroup(tab) {
        if (!this.synchronizeGroupTabIds.includes(tab.id)) {
            this.synchronizeGroupTabIds.push(tab.id);
        }
    }

    _getSynchronizeGroupTabIds() {
        return this.synchronizeGroupTabIds;
    }
};