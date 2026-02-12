import { State } from './State.js';
import { SynchronizeGroup } from './SynchronizeGroup.js';
import { MessageTypes } from '../constants.js';

chrome.runtime.onInstalled.addListener(() => {
  chrome.action.setBadgeText({
    text: "OFF",
  });
});

const synchronizeGroup = new SynchronizeGroup();
const recentTabIds = [];

/* chrome.tabs.onCreated.addListener((tab) => {
  console.log(`Tab ${tab.id} created.`);
  recentTabIds.unshift(tab.id);
}); */

chrome.tabs.onActivated.addListener(async (activeInfo) => {
  // Get the current tab's state
  const tab = await chrome.tabs.get(activeInfo.tabId);
  const state = await new State(tab).load();
  console.log(`Tab ${tab.id} activated. State: ${state.prev}`);
  recentTabIds.unshift(tab.id);
});

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === MessageTypes.SCROLL) {
    const { scrollY, distance } = message.payload;
    const direction = distance > 0 ? '↓' : '↑';
    console.log(`Tab ${sender.tab.id} ${direction}${Math.abs(Math.round(distance))}px@scrollY:${Math.round(scrollY)}px:`);
  } else if (message.type === MessageTypes.TOGGLE_SCROLL_THIS) {
    synchronizeGroup.toggle(message.payload.tabId);
    console.log(`Received "${message.type}" command for tab ${message.payload.tabId}, synchronizationGroup=${synchronizeGroup.getTabIds().join(', ')}`);
    chrome.runtime.sendMessage({
      type: MessageTypes.SYNCHRONIZE_GROUP_UPDATED,
      payload: { tabIds: synchronizeGroup.getTabIds() }
    });
    const count = synchronizeGroup.countTabs(); chrome.action.setBadgeText({ text: count > 0 ? `${count}` : '' });
  } else if (message.type === MessageTypes.GET_SYNCHRONIZE_GROUP) {
    console.log(`Received "${message.type}" command, responding with group.`);
    sendResponse({
      type: MessageTypes.SYNCHRONIZE_GROUP_UPDATED,
      payload: { tabIds: synchronizeGroup.getTabIds() }
    });
  } else if (message.type === MessageTypes.GET_RECENT_TABS) {
    console.log(`Received "${message.type}" command, responding with recent tabs.`);
    sendResponse({
      type: MessageTypes.RECENT_TABS_UPDATED,
      payload: { tabIds: recentTabIds }
    });
  }
  // Return true to indicate you might send a response asynchronously.
  // This is good practice for onMessage listeners.
  return true;
});
