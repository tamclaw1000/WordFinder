#!/usr/bin/env node

import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");
const sourcePath = resolve(root, "index.html");
const outputDir = resolve(root, "dist");
const outputPath = resolve(outputDir, "index.js");

const html = await readFile(sourcePath, "utf8");

const workerSource = `const HTML = ${JSON.stringify(html)};

export default {
  async fetch(request) {
    const url = new URL(request.url);

    if (url.pathname === "/favicon.ico") {
      return new Response(null, { status: 204 });
    }

    return new Response(HTML, {
      headers: {
        "content-type": "text/html; charset=utf-8",
        "cache-control": "no-store"
      }
    });
  }
};
`;

await mkdir(outputDir, { recursive: true });
await writeFile(outputPath, workerSource, "utf8");

process.stdout.write(`Built ${outputPath}\n`);
