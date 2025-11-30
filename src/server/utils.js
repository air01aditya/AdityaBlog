// utils.js — AdityaBlog version
// Adapted from a public template for learning purposes.

import fs from "fs";

export function html(strings, ...values) {
  let output = "";
  strings.forEach((string, i) => {
    output += string + (values[i] || "");
  });
  return output;
}

export function readFile(path) {
  return fs.readFileSync(path, "utf8");
}

export function dateFromTimestamp(timestamp) {
  const date = new Date(timestamp);
  const yyyy = date.getFullYear();
  const mm = String(date.getMonth() + 1).padStart(2, "0");
  const dd = String(date.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
}
