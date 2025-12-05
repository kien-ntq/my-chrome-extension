// ScrollTracker.js: A class to receive scroll events and calculate scroll distance.

export class ScrollTracker {
    constructor() {
        this.lastScrollY = window.scrollY;
        // Bind the method to the instance to ensure `this` is correct in the event handler
        this.scrollEventHandler = this.scrollEventHandler.bind(this);
    }

    /**
     * Handles scroll events, calculates scroll distance, and logs the information.
     */
    scrollEventHandler() {
        const currentScrollY = window.scrollY;
        const distance = currentScrollY - this.lastScrollY;

        if (distance !== 0) {
            chrome.runtime.sendMessage({
                type: "scroll",
                payload: {
                    scrollY: currentScrollY,
                    distance: distance
                }
            });
        }

        this.lastScrollY = currentScrollY;
    }

    /**
     * Sets up a scroll event listener on the document.
     */
    start() {
        console.log("Setting up scroll listener.");
        // Use capture to listen for scroll events on any element.
        document.addEventListener('scroll', this.scrollEventHandler, { capture: true, passive: true });
    }

    /**
     * Removes the scroll event listener.
     */
    stop() {
        console.log("Removing scroll listener.");
        document.removeEventListener('scroll', this.scrollEventHandler, { capture: true, passive: true });
    }
}