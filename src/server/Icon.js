// src/server/Icon.js — AdityaBlog version
import { readFile } from "./utils.js";

/**
 * Return raw SVG string from src/svgs/<id>.svg
 * @param {string} id
 * @returns {string}
 */
export const Icon = (id) => {
  const svg = readFile(`./svgs/${id}.svg`);
  return svg;
};
