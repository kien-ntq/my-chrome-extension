// content.js: content script
import { ScrollTracker } from './ScrollTracker.js';

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
        if (message.type === "ping") {
            // Respond to the ping to confirm the script is active.
            console.log("Received ping, sending pong.");
            sendResponse({ type: "pong" });
        }
        // Return true to indicate you wish to send a response asynchronously
        return true;
    });
}

main();