const { join } = require('path');
const fs = require('fs').promises;
const { mkdir, writeFile } = fs;
const { launch } = require('puppeteer');

const pathToExtension = join(process.cwd(), '/dist');

const testHelper = {
    setupPuppeteer: async function () {
        // Launch the browser.
        const browser = await launch({
            headless: false,
            pipe: true,
            enableExtensions: [pathToExtension],
            userDataDir: join('./tmp', 'user-data-dir'),
            //devtools: true,
        });
        // store the browser instance so we can teardown it later
        // this global is only available in the teardown but not in TestEnvironments
        globalThis.__BROWSER_GLOBAL__ = browser;
        const workerTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
            // Assumes that there is only one service worker created by the extension and its URL ends with background.js.
            target =>
                target.type() === 'service_worker' &&
                target.url().endsWith('background.js'),
        );
        let worker = await workerTarget.worker();
        globalThis.__EXTENSION_GLOBAL__ = {};
        globalThis.__EXTENSION_GLOBAL__.worker = worker;
        async function openPopup() {
            await globalThis.__EXTENSION_GLOBAL__.worker.evaluate('chrome.action.openPopup();');
            const popupTarget = await globalThis.__BROWSER_GLOBAL__.waitForTarget(
                target => target.type() === 'page' && target.url().endsWith('popup.html'),
            );
            let popupPage = await popupTarget.asPage();
            popupPage.on('console', msg => console.log('PAGE LOG:', msg.text()));
            popupPage.on('pageerror', function (err) {
                console.log(err);
            });
            return popupPage;
        }
        globalThis.__EXTENSION_GLOBAL__.openPopup = openPopup;
        // use the file system to expose the wsEndpoint for TestEnvironments
        //await mkdir(DIR, { recursive: true });
        //await writeFile(join(DIR, 'wsEndpoint'), browser.wsEndpoint());
    },

    teardownPuppeteer: async function () {
        globalThis.__BROWSER_GLOBAL__.disconnect();
        // close the browser instance
        await globalThis.__BROWSER_GLOBAL__.close();
        globalThis.__WORKER_GLOBAL__ = undefined;

        // clean-up the wsEndpoint file
        //await fs.rm(DIR, { recursive: true, force: true });
    }
};

module.exports = testHelper;