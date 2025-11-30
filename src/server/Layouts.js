// src/server/Layouts.js  (Aditya version)
import fs from "fs";
import { html, readFile } from "./utils.js";
import { Icon } from "./Icon.js";

// public-facing comment removed author links to avoid traces
const comment = `
<!--
  Built from a local AdityaBlog skeleton.
  This file is adapted from a public example for learning purposes.
-->
`;

export function Layouts({ title = "", children, head = "" } = {}) {
  return html(
    `<html lang="en">
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width,initial-scale=1">
        <meta name="theme-color" content="#fff">
        <title>${title ? title + " — " : ""}AdityaBlog</title>
        ${head}
        <link rel="stylesheet" href="/styles.css">
        <link rel="alternate" type="application/rss+xml" title="RSS" href="/feed.xml" />
      </head>
      <body>
        ${comment}
        <nav class="site-nav">
          <a class="brand" href="/"><strong>AdityaBlog</strong></a>
          <div class="nav-right">
            <a href="/about/">About</a>
            <a href="/search/" aria-label="Search" title="Search">${Icon("heroicon-search")}</a>
            <a href="/menu/" aria-label="Menu" title="Menu">${Icon("heroicon-menu")}</a>
          </div>
        </nav>
        ${children}
      </body>
    </html>`
  );
}
