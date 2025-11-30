// adityabuild.js
import fs from "fs";
import path from "path";
import { marked } from "marked";
import hljs from "highlight.js";
import matter from "gray-matter";

const POSTS_DIR = "./posts";
const OUT_DIR = "./build";

const LAYOUT_PATH = "./src/templates/layout.html";

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// Syntax highlighting setup
marked.setOptions({
  highlight: (code, lang) => {
    try {
      return hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code).value;
    } catch {
      return hljs.highlightAuto(code).value;
    }
  }
});

function loadLayout() {
  return fs.readFileSync(LAYOUT_PATH, "utf8");
}

function wrapWithLayout(layout, { title, content }) {
  return layout
    .replace(/{{title}}/g, title)
    .replace(/{{content}}/g, content);
}

function buildIndex(posts, layout) {
  const list = posts
    .map(p => `<li><a href="${p.slug}.html">${p.title}</a><small> — ${p.date || ""}</small></li>`)
    .join("");

  const html = `<h1>AdityaBlog</h1><ul>${list}</ul>`;

  const final = wrapWithLayout(layout, {
    title: "Home",
    content: html
  });

  fs.writeFileSync(`${OUT_DIR}/index.html`, final, "utf8");
}

async function build() {
  ensureDir(OUT_DIR);

  // Copy public/ folder (if exists)
  if (fs.existsSync("public")) {
    fs.cpSync("public", OUT_DIR, { recursive: true });
  }

  const layout = loadLayout();

  const files = fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md"));
  const postsMeta = [];

  for (const file of files) {
    const raw = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const parsed = matter(raw);

    const title = parsed.data.title || file.replace(".md", "");
    const date = parsed.data.date || "";
    const slug = parsed.data.slug || file.replace(".md", "");

    const htmlBody = marked(parsed.content);

    const final = wrapWithLayout(layout, {
      title,
      content: htmlBody
    });

    fs.writeFileSync(`${OUT_DIR}/${slug}.html`, final, "utf8");

    postsMeta.push({ title, date, slug });
    console.log("built:", slug + ".html");
  }

  // Sort newest posts first
  postsMeta.sort((a, b) => (b.date || "").localeCompare(a.date || ""));

  // Build home page
  buildIndex(postsMeta, layout);

  console.log("Build complete —", postsMeta.length, "posts");
}

build();
