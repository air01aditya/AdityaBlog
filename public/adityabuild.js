// adityabuild.js
import fs from "fs";
import path from "path";
import { marked } from "marked";
import hljs from "highlight.js";

const POSTS_DIR = "./posts";
const OUT_DIR = "./build";
const TEMPLATE_PATH = "./src/templates/post.html"; // optional: if you add a template file

function ensureDir(dir){ if(!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true }); }

marked.setOptions({
  highlight: (code, lang) => {
    try {
      return hljs.getLanguage(lang)
        ? hljs.highlight(code, { language: lang }).value
        : hljs.highlightAuto(code).value;
    } catch (e) { return hljs.highlightAuto(code).value; }
  }
});

function loadTemplate(){
  if(fs.existsSync(TEMPLATE_PATH)) return fs.readFileSync(TEMPLATE_PATH, "utf8");
  return (title, body) => `<!doctype html>
<html>
<head><meta charset="utf-8"><title>${title}</title></head>
<body>${body}</body>
</html>`;
}

function renderMarkdown(md){ return marked(md); }

async function build(){
  ensureDir(OUT_DIR);
  const files = fs.existsSync(POSTS_DIR) ? fs.readdirSync(POSTS_DIR).filter(f => f.endsWith(".md")) : [];
  if(files.length === 0) console.log("No posts found in", POSTS_DIR);

  const templateFn = loadTemplate();
  for(const file of files){
    const md = fs.readFileSync(path.join(POSTS_DIR, file), "utf8");
    const htmlBody = renderMarkdown(md);
    const title = file.replace(/\.md$/, "");
    const outName = title === "index" ? "index.html" : `${title}.html`;
    const outPath = path.join(OUT_DIR, outName);

    const final = typeof templateFn === "function" ? templateFn(title, htmlBody) : templateFn.replace("{{title}}", title).replace("{{content}}", htmlBody);
    fs.writeFileSync(outPath, final, "utf8");
    console.log("built", outPath);
  }
  console.log("Build complete —", files.length, "posts");
}

build().catch(err => { console.error(err); process.exit(1); });
