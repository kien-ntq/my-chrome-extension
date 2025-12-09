import React from 'react';
import { createRoot } from 'react-dom/client';
import App from './App.jsx';
import { lib } from './popup-lib.js';
import { DxSuite } from './DxSuite.js';
import { MessageTypes } from '../constants.js';

// const clipboard_orig = document.getElementById("clipboard_orig")
// const clipboard_proc = document.getElementById("clipboard_proc")
// const dxSuite = new DxSuite(clipboard_orig, clipboard_proc)

const Keys = {
    's': {
        description: "Toggle Scroll Sync",
        func: toggleScrollSyncForCurrentTab,
    },
};

function getKeyDescriptions(keys) {
    return Object.fromEntries(
        Object.entries(keys).map(([key, value]) => [key, value.description])
    );
}

async function main(params) {
    console.log("Popup loaded!")
    const root = createRoot(document.getElementById('root'));

    root.render(<App keys={getKeyDescriptions(Keys)} />);

    injectContentScriptIntoCurrentTab()
    setupKeydownListener()
    // getSynchronizeGroup() // Request the group state when the popup opens
}

async function setupKeydownListener() {
    document.addEventListener('keydown', async (ev) => {
        if (ev.key in Keys) {
            Keys[ev.key].func()
            ev.preventDefault() // Prevent the default action of the key
        }
    });
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
