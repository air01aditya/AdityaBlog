// src/server/PostsList.js — AdityaBlog version
import { html } from "./utils.js";

/**
 * Render a list of posts (array of {title, date, url})
 */
export function PostsList({ posts = [] } = {}) {
  return html`<ul class="posts-list">
    ${posts
      .map(
        (p) => html`<li>
          <a href="${p.url}">${p.title}</a>
          <time datetime="${p.date}">${p.date || ""}</time>
        </li>`
      )
      .join("")}
  </ul>`;
}
