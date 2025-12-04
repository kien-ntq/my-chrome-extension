// content.js: content script

/**
 * Main function for the content script.
 * This script is injected into the main page, not the popup.
 */
function main() {
    console.log("Content script loaded!");
    setupScrollListener();
    setupMessageListener();
}

/**
 * Handles scroll events and logs the current scroll position.
 */
const scrollEventHandler = () => {
    // The maximum scrollable height of the document can change, so we calculate it on each event.
    const maxScrollY = document.documentElement.scrollHeight - window.innerHeight;
    // window.scrollY gives the number of pixels the document is currently scrolled vertically.
    console.log(`Page scrolled to: Y=${Math.round(window.scrollY)}px (out of ${Math.round(maxScrollY)}px)`);
};

/**
 * Sets up a scroll event listener on the document.
 */
function setupScrollListener() {
    console.log("Setting up scroll listener.");
    // Use capture to listen for scroll events on any element.
    document.addEventListener('scroll', scrollEventHandler, { capture: true, passive: true });
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