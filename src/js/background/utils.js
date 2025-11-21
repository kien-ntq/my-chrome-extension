export class State {
    constructor(tab, prevState = 'OFF') {
        this.tab = tab;
        this.prev = prevState;
        this.next = prevState === 'ON' ? 'OFF' : 'ON';
    }
    async load() {
        // Retrieve the action badge to check if the extension is 'ON' or 'OFF'
        this.prev = await chrome.action.getBadgeText({ tabId: this.tab.id });
        // Next state will always be the opposite
        this.next = this.prev === 'ON' ? 'OFF' : 'ON';
        return this
    }

    async toggle() {
        // Set the action badge to the next state
        await chrome.action.setBadgeText({
            tabId: this.tab.id,
            text: this.next,
        });
    }
    get isOn() { return this.next === "ON" }
    get isOff() { return this.next === "OFF" }
}