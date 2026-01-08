#!/usr/bin/env node

import Config from '../src/data/config.js';

import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import process from 'process';
import revision from 'child_process';
import fs from 'node:fs';
import child_process from 'node:child_process';
import chalk from 'chalk';
import { chalkError, chalkSuccess } from './helpers.js';
import * as cheerio from 'cheerio';

// Get the directory of the current script
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Change to the project root (parent of scripts directory)
process.chdir(join(__dirname, '..'));

const DATE = new Date().toString().split('(')[0].trim();
const COMMIT = revision.execSync('git rev-parse --short HEAD')
  .toString().trim();

/** 
 * LittleJS Build System
 */

'use strict';

const PROGRAM_NAME = 'bugandbee';
const BUILD_FOLDER = 'tmp';
const sourceFiles = [
  // 'node_modules/littlejsengine/dist/littlejs.release.js',
  'src/lib/littlejs.release.js',
  'dist/game.js',
];

if (!fs.existsSync('dist')) {
  console.error('Error: "dist" directory does not exist. Please run `npm run build`.');
  process.exit(1);
};

const dataFiles = Config.images.map(tile => `public/${tile}`);
Config.trackPaths.forEach((track) => {
  dataFiles.push(`public/${track}`);
})

dataFiles.push(`public/04b19.woff`);
dataFiles.push(`public/04b19.woff2`);

console.log(``);
chalkSuccess(` Building ${Config.title}... `, '🛠️');
console.log(``);
const startTime = Date.now();


// remove old files and setup build folder
fs.rmSync(BUILD_FOLDER, { recursive: true, force: true });
try {
  fs.rmSync(`${PROGRAM_NAME}.zip`, { force: true });
} catch (e) {
  console.log(e);
}
fs.mkdirSync(BUILD_FOLDER);

// copy data files
for (const file of dataFiles)
  fs.copyFileSync(file, `${BUILD_FOLDER}/${file.split('/').pop()}`);

Build
  (
    `${BUILD_FOLDER}/index.js`,
    sourceFiles,
    // [closureCompilerStep, uglifyBuildStep, htmlBuildStep, zipBuildStep]
    // [closureCompilerStep, uglifyBuildStep, roadrollerBuildStep, htmlBuildStep, zipBuildStep]
    [closureCompilerSimpleStep, htmlBuildStep, zipBuildStep] // for build debugging
    // [closureCompilerStep, htmlBuildStep, zipBuildStep] // for build debugging
  );

const size = fs.statSync(`${PROGRAM_NAME}.zip`).size;
// const MAX = 13312;
const MAX = false;
const remaining = MAX - size;

console.log(``);
console.log(chalk.blue(`- Build Completed in ${((Date.now() - startTime) / 1e3).toFixed(2)} seconds!`));
console.log(chalk.blue(`- Size of ${PROGRAM_NAME}.zip: ${size} bytes`));

if (MAX === false) {
  chalkSuccess(`Complete! Zip size: ${Math.ceil(size / 1024)} kb`);
} else {
  if (size < MAX) {
    chalkSuccess(`Remaining space: ${remaining} bytes`);
  } else {
    chalkError(`Error: Build size exceeds maximum of ${MAX} bytes!`);
  }
}
console.log('');

///////////////////////////////////////////////////////////////////////////////

// A single build with its own source files, build steps, and output file
// - each build step is a callback that accepts a single filename
function Build(outputFile, files = [], buildSteps = []) {
  // copy files into a buffer
  let buffer = '';
  for (const file of files)
    buffer += fs.readFileSync(file) + '\n';

  // output file
  fs.writeFileSync(outputFile, buffer, { flag: 'w+' });

  // execute build steps in order
  for (const buildStep of buildSteps)
    buildStep(outputFile);
}

function closureCompilerStep(filename) {
  console.log(`Running closure compiler...`);

  const filenameTemp = filename + '.tmp';
  fs.copyFileSync(filename, filenameTemp);
  child_process.execSync(`npx google-closure-compiler --js=${filenameTemp} --js_output_file=${filename} --compilation_level=ADVANCED --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`, { stdio: 'inherit' });
  fs.rmSync(filenameTemp);
};

function closureCompilerSimpleStep(filename) {
  console.log(`Running closure compiler in simple mode...`);

  const filenameTemp = filename + '.tmp';
  fs.copyFileSync(filename, filenameTemp);
  child_process.execSync(`npx google-closure-compiler --js=${filenameTemp} --js_output_file=${filename} --compilation_level=SIMPLE --warning_level=VERBOSE --jscomp_off=* --assume_function_wrapper`, { stdio: 'inherit' });
  fs.rmSync(filenameTemp);
};

function uglifyBuildStep(filename) {
  console.log(`Running uglify...`);
  child_process.execSync(`npx terser ${filename} -c -m -o ${filename}`, { stdio: 'inherit' });
  // child_process.execSync(`npx uglifyjs ${filename} -c -m reserved=[SHADOW,PAL,importLevel,toggleMute,mute,uiRoot,uiMenu] -o ${filename}`, { stdio: 'inherit' });
  // child_process.execSync(`npx uglifyjs ${filename} -c -o ${filename}`, { stdio: 'inherit' });
};

function roadrollerBuildStep(filename) {
  console.log(`Running roadroller...`);
  child_process.execSync(`npx roadroller ${filename} -o ${filename}`, { stdio: 'inherit' });
};

function roadrollerExtremeBuildStep(filename) {
  // this takes over a minute to run but might be a little smaller
  console.log(`Running roadroller extreme...`);
  child_process.execSync(`npx roadroller ${filename} -o ${filename} --optimize 2`, { stdio: 'inherit' });
};

function htmlBuildStep(filename) {
  console.log(`Building html...`);

  const source = fs.readFileSync('index.html', 'UTF8');
  const $ = cheerio.load(source);
  $('script').remove();
  $('body').contents().filter(function () {
    return this.type === 'comment';
  }).remove();
  let html = $.html();
  html = html.replace('%VITE_DEV%', '')
  html = html.replace('</body>', '')
  html = html.replace('</html>', '')

  let inject = '<script>';
  inject += `window.COMMIT='${COMMIT}';`;
  inject += `window.BUILD='${DATE}';`;
  inject += fs.readFileSync(filename);
  inject += '</script>';

  html += inject;
  html += '\n</body></html>';

  fs.writeFileSync(`${BUILD_FOLDER}/index.html`, html, { flag: 'w+' });
};

function zipBuildStep() {
  console.log(`Zipping...`);
  const { execSync, spawnSync } = child_process;
  const fileNames = dataFiles.map(f => f.replace('public/', ''));


  if (process.platform === 'win32') {
    // Windows version using ect
    const ect = '../node_modules/ect-bin/vendor/win32/ect.exe';
    const args = ['-9', '-strip', '-zip', `../${PROGRAM_NAME}.zip`, 'index.html', ...fileNames];
    spawnSync(ect, args, { stdio: 'inherit', cwd: BUILD_FOLDER });
  } else {
    // Linux/macOS version using zip
    const zipCommand = `cd ${BUILD_FOLDER} && zip -9 -r ../${PROGRAM_NAME}.zip index.html ${fileNames.join(' ')}`;
    execSync(zipCommand, { stdio: 'inherit' });
  }

  // cleanup - remove tmp and rename to dist for gh-pages
  fs.rmSync('dist', { recursive: true, force: true });
  fs.renameSync('tmp', 'dist')
  fs.rmSync('dist/index.js');
}
