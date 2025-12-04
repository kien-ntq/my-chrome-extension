import { lib } from './popup-lib.js';
import { DxSuite } from './DxSuite.js';

const clipboard_orig = document.getElementById("clipboard_orig")
const clipboard_proc = document.getElementById("clipboard_proc")
const dxSuite = new DxSuite(clipboard_orig, clipboard_proc)

async function main(params) {
    console.log("Popup loaded!")
    dxSuite.populateTextBoxWithClipboardContent()
    forEachKeydownEvent(async ev => {
        let processed = dxSuite.handleKeydownEvent(ev)
        if (!processed)
            processed = await handleKeydownBreakTabCommands(ev.key)
        
        if (processed) {
            await lib.writeClipboard(processed)
        }
    })
    injectContentScriptIntoCurrentTab()
    listAllBrowserTabs()
}

function forEachKeydownEvent(fn) {
    document.addEventListener('keydown', fn);
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

async function handleKeydownBreakTabCommands(key) {
    switch (key) {
        case "w": {
            const tab = await lib.getCurrentTab()
            const newwindow = await chrome.windows.create({ tabId: tab.id })
            console.log(tab, newwindow);
            //chrome.tabs.move(tab.id, { windowId: newwindow.id })
            break
        }
        case "i": { break; }
    }
}

async function injectContentScriptIntoCurrentTab() {
    const tab = await lib.getCurrentTab()
    console.log(`Injecting script into tab ${tab.id}`)
    
    // Send a ping to see if the content script is already active
    try {
        const response = await chrome.tabs.sendMessage(tab.id, { type: "ping" });
        if (response && response.type === "pong") {
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

async function listAllBrowserTabs() {
    const tabs = await chrome.tabs.query({});
    console.log("All browser tabs:", tabs);
}

main()
