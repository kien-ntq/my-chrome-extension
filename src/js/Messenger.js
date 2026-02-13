import { ChromeAPI } from "./ChromeAPI.js";

export class Messenger {
    constructor(chromeAPI = ChromeAPI) {
        this.chromeAPI = chromeAPI;
    }


    /**
     * Helper to send a message and resolve with tabIds or reject on error.
     * @param {string} type - The message type to send.
     * @param {string} logPrefix - Prefix for console log.
     * @returns {Promise<Array>} Resolves with tabIds array.
     */
    async _getTabIdsFromBackground(type, logPrefix) {
        return await new Promise((resolve, reject) => {
            this.chromeAPI.sendMessageWithCallback({ type }, (response) => {
                if (response && response.tabIds) {
                    console.log(`${logPrefix} from background:`, response.tabIds);
                    resolve(response.tabIds);
                } else {
                    reject("No response or tabIds");
                }
            });
        });
    }

    /** Assuming only background.js is responding to GET_RECENT_TABS. */
    async getRecentTabsFromBackground() {
        return this._getTabIdsFromBackground("GET_RECENT_TABS", "Recent tabs");
    }

    async getSynchronizeGroupFromBackground() {
        return this._getTabIdsFromBackground("GET_SYNCHRONIZE_GROUP", "Synchronize group");
    }

}