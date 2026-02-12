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
};