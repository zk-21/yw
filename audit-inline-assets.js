#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const ROOT = __dirname;

function hashText(text) {
  return crypto.createHash('sha1').update(text).digest('hex').slice(0, 10);
}

function readHtmlFiles() {
  return fs.readdirSync(ROOT).filter((file) => file.endsWith('.html'));
}

function analyzeFile(file) {
  const fullPath = path.join(ROOT, file);
  const text = fs.readFileSync(fullPath, 'utf8');
  const styleBlocks = text.match(/<style[\s>][\s\S]*?<\/style>/gi) || [];
  const scriptBlocks = text.match(/<script(?![^>]*src=)[^>]*>[\s\S]*?<\/script>/gi) || [];
  const styleAttrs = text.match(/\sstyle="/g) || [];

  return {
    file,
    bytes: Buffer.byteLength(text),
    styleBlocks,
    scriptBlocks,
    styleAttrs: styleAttrs.length
  };
}

function collectDuplicates(entries, key) {
  const buckets = new Map();

  entries.forEach((entry) => {
    entry[key].forEach((block, index) => {
      const normalized = String(block)
        .replace(/\s+/g, ' ')
        .trim();
      if (!normalized) return;
      const hash = hashText(normalized);
      if (!buckets.has(hash)) buckets.set(hash, []);
      buckets.get(hash).push(`${entry.file}#${index + 1}`);
    });
  });

  return Array.from(buckets.entries())
    .filter((entry) => entry[1].length > 1)
    .sort((a, b) => b[1].length - a[1].length);
}

const entries = readHtmlFiles()
  .map(analyzeFile)
  .sort((a, b) => {
    const scoreA = a.styleBlocks.length * 6 + a.scriptBlocks.length * 6 + a.styleAttrs;
    const scoreB = b.styleBlocks.length * 6 + b.scriptBlocks.length * 6 + b.styleAttrs;
    return scoreB - scoreA || b.bytes - a.bytes;
  });

console.log('File\tBytes\t<style>\tinline<script>\tstyle=');
entries.forEach((entry) => {
  console.log([
    entry.file,
    entry.bytes,
    entry.styleBlocks.length,
    entry.scriptBlocks.length,
    entry.styleAttrs
  ].join('\t'));
});

const duplicateStyleBlocks = collectDuplicates(entries, 'styleBlocks');
const duplicateScriptBlocks = collectDuplicates(entries, 'scriptBlocks');

if (duplicateStyleBlocks.length) {
  console.log('\nDuplicate <style> blocks:');
  duplicateStyleBlocks.slice(0, 10).forEach(([hash, refs]) => {
    console.log(`${hash}\t${refs.join(', ')}`);
  });
}

if (duplicateScriptBlocks.length) {
  console.log('\nDuplicate inline <script> blocks:');
  duplicateScriptBlocks.slice(0, 10).forEach(([hash, refs]) => {
    console.log(`${hash}\t${refs.join(', ')}`);
  });
}
