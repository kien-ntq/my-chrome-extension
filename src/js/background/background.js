import { State } from './utils.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Get the current tab's state
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const state = await new State(tab).load();
  console.log(`Tab ${tab.id} activated. State: ${state.prev}`);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === 'scroll') {
    const { scrollY, distance } = message.payload;
    const direction = distance > 0 ? '↓' : '↑';
    console.log(`Tab ${sender.tab.id} ${direction}${Math.abs(Math.round(distance))}px@scrollY:${Math.round(scrollY)}px:`);
  }
  // Return true to indicate you might send a response asynchronously.
  // This is good practice for onMessage listeners.
  return true;
});
