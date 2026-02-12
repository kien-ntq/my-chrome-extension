import { promises as fs } from 'fs';
import { tmpdir } from 'os';
import { join } from 'path';

const DIR = join('./tmp', 'jest_puppeteer_global_setup');
export default async function () {
};