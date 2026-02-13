export const ChromeAPI = {
    sendMessage(message) {
        console.log("Sending message:", message);
        chrome.runtime.sendMessage(message);
    },

    sendMessageWithCallback(message, callback) {
        console.log("Sending message with callback:", message);
        chrome.runtime.sendMessage(message, callback);
    }
};