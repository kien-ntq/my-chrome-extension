import { lib } from './popup-lib.js';

export class DxSuite {
    constructor(clipboard_orig, clipboard_proc) {
        this.clipboard = ""
        this.clipboard_orig = clipboard_orig
        this.clipboard_proc = clipboard_proc
    }

    async populateTextBoxWithClipboardContent() {
        this.clipboard = await lib.readClipboard(500)
        this.clipboard_orig.value = this.clipboard
    }

    unquote (content) {
        return content.match(/"([^"]+)"/)[1]
    }
    _replace (content, before = "Yes", after = "Y") {
        return content.replace(before, after)
    }
    replaceAll(content, before = "Yes", after = "Y") {
        return content.replaceAll(before, after)
    }
    
    extractTaskName(data) {
        const res = data.replace(/^.*[\>＞] */, "")
        return res // Delete until the last [>]
        //console.log(`matched: ${matched}`);
    }

    extractInsideBracket(data = "") {
        const re = /[「]([\w\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}\p{Script=Common}]+)[」]/u
        //const re = new RegExp("「([\\p{Script=Han}\\p{Script=Hiragana}\\p{Script=Katakana}]+)」", "u")
        const m = data.match(re)
        console.log(m);
        //return data.match(/「([\p{Script=Han}\p{Script=Hiragana}\p{Script=Katakana}]+)」/u)[1]
        return m[1]
    }

    handleKeydownEvent (ev, data = this.clipboard) {
        let processed = ""
        switch (ev.key) {
            case "1":
                processed = this.unquote(data)
                break
            case "2":
                processed = this.replaceAll(data)
                break
            case "3":
                processed = this.extractTaskName(data)
                break
            case "]":
                processed = this.extractInsideBracket(data)
                break
        }
        this.clipboard_proc.value = processed
        return processed
    }

}
