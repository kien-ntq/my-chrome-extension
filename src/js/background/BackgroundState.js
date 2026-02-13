export class BackgroundState {
    constructor() {
        this.recentTabIds = [];
    }

    tabActivated(tab) {
        this.recentTabIds = this.recentTabIds.filter(id => id !== tab.id);
        this.recentTabIds.unshift(tab.id);
    }

    getRecentTabIds() {
        return this.recentTabIds;
    }

    onMessage(message, sendResponse) {
        if (message.type === 'GET_RECENT_TABS') {
            sendResponse({ tabIds: this.getRecentTabIds() });
        }
    }

};