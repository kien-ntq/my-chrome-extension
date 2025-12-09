// content.js: content script
import { ScrollTracker } from './ScrollTracker.js';
import { MessageTypes } from '../constants.js';

/**
 * Main function for the content script.
 * This script is injected into the main page, not the popup.
 */
function main() {
    console.log("Content script loaded!");
    const scrollTracker = new ScrollTracker();
    scrollTracker.start();
    setupMessageListener();
}

/**
 * Sets up a listener for messages from other parts of the extension.
 */
function setupMessageListener() {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
        if (message.type === MessageTypes.PING) {
            // Respond to the ping to confirm the script is active.
            console.log("Received ping, sending pong.");
            sendResponse({ type: MessageTypes.PONG });
        }
        // Return true to indicate you wish to send a response asynchronously
        return true;
    });
}

main();