import { ChromeAPI } from "./ChromeAPI.js";

export class Messenger {
    constructor(chromeAPI = ChromeAPI) {
        this.chromeAPI = chromeAPI;
    }

    /** Assuming only background.js is responding to GET_RECENT_TABS. */
    async getRecentTabsFromBackground() {
        return await new Promise((resolve, reject) => {
            this.chromeAPI.sendMessageWithCallback({ type: "GET_RECENT_TABS" }, (response) => {
                if (response && response.tabIds) {
                    console.log('Recent tabs from background:', response.tabIds);
                    resolve(response.tabIds);
                } else {
                    return reject("No response or tabIds");
                }
            });
        });
    }

    async getSynchronizeGroupFromBackground() {
        return await new Promise((resolve, reject) => {
            this.chromeAPI.sendMessageWithCallback({ type: "GET_SYNCHRONIZE_GROUP" }, (response) => {
                if (response && response.tabIds) {
                    console.log('Synchronize group from background:', response.tabIds);
                    resolve(response.tabIds);
                } else {
                    return reject("No response or tabIds");
                }
            });
        });
    }

}