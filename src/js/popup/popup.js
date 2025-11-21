import { lib } from './popup-lib.js';
import { DxSuite } from './DxSuite.js';

const clipboard_orig = document.getElementById("clipboard_orig")
const clipboard_proc = document.getElementById("clipboard_proc")
const dxSuite = new DxSuite(clipboard_orig, clipboard_proc)

async function main(params) {
    console.log("Popup loaded!")
    dxSuite.populateTextBoxWithClipboardContent()
    forEachKeydownEvent(async ev => {
        let processed = ""
        processed = dxSuite.handleKeydownEvent(ev)
        if (!processed)
            processed = await handleKeydownBreakTabCommands(ev.key)
        await lib.writeClipboard(processed)
    })
}

function forEachKeydownEvent(fn) {
    const evHdlr = function (ev) { fn(ev) }
    document.addEventListener(
        'keydown',
        evHdlr
    );
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
        case "w":
            const tab = await lib.getCurrentTab()
            const newwindow = await chrome.windows.create({ tabId: tab.id })
            console.log(tab, newwindow);
            //chrome.tabs.move(tab.id, { windowId: newwindow.id })
            break
    }
}

main()
