import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { lib } from './popup-lib.js';
import { DxSuite } from './DxSuite.js';
import { MessageTypes } from '../constants.js';

// const clipboard_orig = document.getElementById("clipboard_orig")
// const clipboard_proc = document.getElementById("clipboard_proc")
// const dxSuite = new DxSuite(clipboard_orig, clipboard_proc)

async function main(params) {
    console.log("Popup loaded!")
    const root = createRoot(document.getElementById('root'));

    root.render(<App />);

    injectContentScriptIntoCurrentTab()
    setupKeydownListener()
    // getSynchronizeGroup() // Request the group state when the popup opens
}

async function setupKeydownListener() {
    document.addEventListener('keydown', async (ev) => {
        switch (ev.key) {
        case "s": {
            await toggleScrollSyncForCurrentTab(ev)
            ev.preventDefault() // Prevent the default action of 's' key
            break
        }
    }}) 
}

function handleKeydownClipboardTransformationCommands(ev) {
    const evHdl = function (event) {
        console.log(`Key pressed: ${event.key}`);
        const key = event.key
        const processed = dxSuite.process(key)
        if (processed) {
            document.removeEventListener('keydown', evHdl)
            navigator.clipboard.writeText(processed)
                .then(() => console.log(`Copied processed content: ${processed}`))
            clipboard_proc.value = processed
        }
    }
}

async function toggleScrollSyncForCurrentTab(ev) {
    const tab = await lib.getCurrentTab()
    chrome.runtime.sendMessage({
        type: MessageTypes.TOGGLE_SCROLL_THIS,
        payload: { tabId: tab.id }
    });
}

async function breakTab(ev) {
    const tab = await lib.getCurrentTab()
    const newwindow = await chrome.windows.create({ tabId: tab.id })
    console.log(tab, newwindow);
    //chrome.tabs.move(tab.id, { windowId: newwindow.id })
}

async function getSynchronizeGroup() {
    console.log("Requesting synchronize group from background script.");
    const response = await chrome.runtime.sendMessage({
        type: MessageTypes.GET_SYNCHRONIZE_GROUP
    });
    console.log("Received synchronize group:", response.payload.tabIds);
}

async function injectContentScriptIntoCurrentTab() {
    const tab = await lib.getCurrentTab()
    console.log(`Injecting script into tab ${tab.id}`)
    
    // Send a ping to see if the content script is already active
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: MessageTypes.PING });
        if (response && response.type === MessageTypes.PONG) {
            console.info("Content script already injected and active.");
            return;
        }
    } catch (e) {
        // An error means the content script is not there, so we can inject it.
        console.info("Content script not found, injecting now.", e);
    }
    
    await chrome.scripting.executeScript({
        target: { tabId: tab.id },
        files: ["js/content/content.js"],
    });
}

main()
