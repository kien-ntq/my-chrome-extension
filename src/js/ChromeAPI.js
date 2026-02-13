export const ChromeAPI = {
    sendMessage(message) {
        // Placeholder implementation
        console.log("Message sent:", message);
    },
    sendMessageWithCallback(message, callback) {
        // Placeholder implementation
        console.log("Message sent with callback:", message);
        chrome.message.send(message, callback);
    }
};