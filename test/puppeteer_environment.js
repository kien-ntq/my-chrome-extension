import { promises } from 'fs';
const { readFile } = promises;
import { tmpdir } from 'os';
import { join } from 'path';
import path from 'path';
import { connect } from 'puppeteer';
import { launch } from 'puppeteer';
import { TestEnvironment as NodeEnvironment } from 'jest-environment-node';

const DIR = join('./tmp', 'jest_puppeteer_global_setup');
// const pathToExtension = path.join(process.cwd(), '/dist');
const pathToExtension = join(process.cwd(), '/dist');

class PuppeteerEnvironment extends NodeEnvironment {
  constructor(config) {
    super(config);
  }

  async setup() {
    await super.setup();
    // get the wsEndpoint
    /* const wsEndpoint = await readFile(join(DIR, 'wsEndpoint'), 'utf8');
    if (!wsEndpoint) {
      throw new Error('wsEndpoint not found');
    } */

    // connect to puppeteer
    /* this.global.__BROWSER_GLOBAL__ = await connect({
      browserWSEndpoint: wsEndpoint,
    }); */
    /* this.global.__BROWSER_GLOBAL__ = await launch(); */

  }

  async teardown() {
    if (this.global.__BROWSER_GLOBAL__) {
      // this.global.__BROWSER_GLOBAL__.disconnect();
      // close the browser instance
      // await globalThis.__BROWSER_GLOBAL__.close();
    }
    await super.teardown();
  }

  getVmContext() {
    return super.getVmContext();
  }
}

export default PuppeteerEnvironment;