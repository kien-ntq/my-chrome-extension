/**
 * Manages a group of tabs for synchronized actions, like scrolling.
 */
export class SynchronizeGroup {
    constructor() {
        /** @type {Set<number>} */
        this.tabs = new Set();
    }

    /**
     * @param {number} tabId
     */
    add(tabId) {
        console.log(`Adding tab ${tabId} to synchronization group.`);
        this.tabs.add(tabId);
    }

    /**
     * @param {number} tabId
     */
    remove(tabId) {
        console.log(`Removing tab ${tabId} from synchronization group.`);
        this.tabs.delete(tabId);
    }

    /**
     * Adds a tab to the group if it's not present, or removes it if it is.
     * @param {number} tabId
     */
    toggle(tabId) {
        if (this.tabs.has(tabId)) {
            this.remove(tabId);
        } else {
            this.add(tabId);
        }
    }

    getTabIds() {
        return Array.from(this.tabs);
    }
}