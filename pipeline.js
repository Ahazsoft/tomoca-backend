/**
 * ============================================================
 * Tomoca Data Extraction & Seeding Pipeline
 * ============================================================
 * Reads:
 *   1. All files under /public/assets/img (public asset manifest)
 *   2. Hardcoded JS data files in /src/data/ (statically parsed)
 * Combines into a structured JSON output
 * Saves to: tomoca-backend/extracted-data.json
 * Optionally seeds into MongoDB via --seed flag
 *
 * Usage:
 *   node pipeline.js          # Extract & save JSON only
 *   node pipeline.js --seed   # Extract, save JSON, and seed MongoDB
 * ============================================================
 */

'use strict';

const fs = require('fs');
const path = require('path');
const mongoose = require('mongoose');
require('dotenv').config();

// ─── Paths ────────────────────────────────────────────────────────────────────

const FRONTEND_ROOT = path.resolve(__dirname, '../tomoca');
const BACKEND_ROOT  = __dirname;
const PUBLIC_ASSETS = path.join(FRONTEND_ROOT, 'public', 'assets');
const DATA_DIR      = path.join(FRONTEND_ROOT, 'src', 'data');
const OUTPUT_FILE   = path.join(BACKEND_ROOT, 'extracted-data.json');

const SHOULD_SEED = process.argv.includes('--seed');

// ─── Helpers ──────────────────────────────────────────────────────────────────

/**
 * Recursively walk a directory and return all file paths.
 * @param {string} dir  - Directory to walk
 * @param {string} base - Base path to strip for relative output (optional)
 * @returns {string[]}  - Array of absolute file paths
 */
function walkDir(dir, results = []) {
  if (!fs.existsSync(dir)) {
    console.warn(`  [warn] Directory does not exist: ${dir}`);
    return results;
  }
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkDir(fullPath, results);
    } else {
      results.push(fullPath);
    }
  }
  return results;
}

/**
 * Convert an absolute fs path under /public to a web-accessible /assets/... path.
 * e.g. /home/nemo/Work/tomoca/public/assets/img/blog/blog1.png
 *   -> /assets/img/blog/blog1.png
 */
function toWebPath(absolutePath) {
  const publicRoot = path.join(FRONTEND_ROOT, 'public');
  return '/' + path.relative(publicRoot, absolutePath).replace(/\\/g, '/');
}

/**
 * Statically parse a CommonJS-style or ESM data file by:
 *   1. Stripping import/require statements
 *   2. Resolving @assets/img/... references to /assets/img/...
 *   3. Evaluating the cleaned source with a minimal module context
 *
 * This avoids needing a bundler or Babel by doing regex-based transforms.
 * Works reliably as long as the data arrays don't have complex computed expressions.
 *
 * @param {string} filePath - Absolute path to the .js data file
 * @returns {object} - { default: any, [namedExports]: any }
 */
function parseDataFile(filePath) {
  const src = fs.readFileSync(filePath, 'utf-8');
  let cleaned = src;

  // 1. Replace all import statements, capturing the variable name and source path
  //    e.g. import blog_1 from '@assets/img/blog/blog-1.jpg';
  //      -> const blog_1 = '/assets/img/blog/blog-1.jpg';
  cleaned = cleaned.replace(
    /import\s+([\w\d_$]+)\s+from\s+['"](@assets\/img\/[^'"]+)['"]\s*;?/g,
    (_, varName, assetPath) => {
      const webPath = assetPath.replace('@assets', '/assets');
      return `const ${varName} = '${webPath}';`;
    }
  );

  // 2. Replace named image imports like:
  //    import { X, Y } from '@assets/...'  --> strip them, they're unlikely in data files
  cleaned = cleaned.replace(
    /import\s+\{[^}]+\}\s+from\s+['"][^'"]+['"]\s*;?/g,
    ''
  );

  // 3. Strip any remaining import statements (e.g. svg, component imports)
  cleaned = cleaned.replace(/import\s+[^\n]+\n/g, '');

  // 4. Convert ESM exports to CommonJS
  //    export default X  -->  module.exports.default = X
  cleaned = cleaned.replace(/export\s+default\s+/g, 'module.exports.default = ');

  //    export const X = ...  -->  const X = ...\nmodule.exports.X = X
  //    (We handle this differently by capturing the name and re-exporting)
  cleaned = cleaned.replace(/export\s+const\s+([\w\d_$]+)/g, (_, name) => {
    // We'll collect these manually below; for now just strip 'export'
    return `const ${name}`;
  });

  // 5. Evaluate in a sandboxed module context
  try {
    const mod = { exports: {} };
    const fn  = new Function('module', 'exports', cleaned);
    fn(mod, mod.exports);

    // Re-scan for named const exports that weren't caught by the replacer
    // (they become local vars; we need to extract them from the source names)
    const namedExportMatches = [...src.matchAll(/export\s+const\s+([\w\d_$]+)/g)];
    for (const match of namedExportMatches) {
      const name = match[1];
      // They are now local vars — run another eval to get them
      try {
        const getter = new Function('module', 'exports', cleaned + `\nmodule.exports['${name}'] = ${name};`);
        getter(mod, mod.exports);
      } catch (_) {
        // silently skip if individual export fails
      }
    }

    return mod.exports;
  } catch (err) {
    console.error(`  [error] Failed to parse ${path.basename(filePath)}: ${err.message}`);
    return {};
  }
}

// ─── Step 1: Asset Manifest ───────────────────────────────────────────────────

function extractAssetManifest() {
  console.log('\n📂 Step 1: Scanning public assets...');
  const allFiles = walkDir(PUBLIC_ASSETS);

  const manifest = allFiles.map((absPath) => {
    const stat = fs.statSync(absPath);
    const webPath = toWebPath(absPath);
    const ext = path.extname(absPath).toLowerCase().replace('.', '');
    const relativePath = path.relative(PUBLIC_ASSETS, absPath);
    const segments = relativePath.split(path.sep);
    const category = segments[1] || segments[0]; // e.g. "img/blog/..." -> "blog"

    return {
      webPath,
      absolutePath: absPath,
      filename: path.basename(absPath),
      extension: ext,
      sizeBytes: stat.size,
      category: segments.length > 2 ? segments[1] : 'root',
      subcategory: segments.length > 3 ? segments[2] : null,
      type: ['jpg','jpeg','png','gif','webp','svg','ico'].includes(ext) ? 'image'
          : ['ttf','woff','woff2','eot','otf'].includes(ext) ? 'font'
          : ['css','scss'].includes(ext) ? 'style'
          : 'other',
    };
  });

  console.log(`  ✓ Found ${manifest.length} files across ${[...new Set(manifest.map(f => f.category))].length} categories`);
  return manifest;
}

// ─── Step 2: Frontend Hardcoded Data Extraction ───────────────────────────────

function extractFrontendData() {
  console.log('\n📦 Step 2: Parsing frontend data files...');
  const result = {};

  const dataFiles = fs.readdirSync(DATA_DIR).filter(f => f.endsWith('.js'));
  for (const filename of dataFiles) {
    const filePath = path.join(DATA_DIR, filename);
    const name = filename.replace('.js', '');
    console.log(`  → Parsing ${filename}...`);
    const parsed = parseDataFile(filePath);

    // Normalize: collapse default + named exports
    const exports = {};
    if (parsed.default) {
      exports['default'] = parsed.default;
    }
    for (const [key, value] of Object.entries(parsed)) {
      if (key !== 'default') {
        exports[key] = value;
      }
    }
    result[name] = exports;
  }

  // Summary
  for (const [name, exports] of Object.entries(result)) {
    for (const [key, val] of Object.entries(exports)) {
      const label = key === 'default' ? name : `${name}.${key}`;
      const count = Array.isArray(val) ? val.length : (typeof val === 'object' ? Object.keys(val).length : 1);
      console.log(`  ✓ ${label}: ${count} item(s)`);
    }
  }

  return result;
}

// ─── Step 3: Combine & Structure ──────────────────────────────────────────────

function combineData(assetManifest, frontendData) {
  console.log('\n🔀 Step 3: Combining data sources...');

  // Build a lookup map: webPath -> asset info (for resolving img paths fast)
  const assetByPath = {};
  for (const asset of assetManifest) {
    assetByPath[asset.webPath] = asset;
  }

  // Utility: resolve an img field (string or object with src) to an asset entry
  function resolveImg(img) {
    if (!img) return null;
    const p = typeof img === 'string' ? img : (img.src || null);
    return p ? (assetByPath[p] || { webPath: p }) : null;
  }

  // Extract blog data (blog-postbox type only for seeding, all for export)
  const blogData = frontendData['blog-data']?.default || [];
  const blogs = blogData.map(b => ({
    id: b.id,
    img: typeof b.img === 'string' ? b.img : (b.img?.src || null),
    title: b.title,
    date: b.date,
    author: b.author,
    comments: b.comments,
    tags: b.tags,
    category: b.category,
    desc: b.desc || b.sm_desc || null,
    blog: b.blog,
    featured: b.featured || false,
    blockquote: b.blockquote || false,
  }));

  // Extract testimonials
  const testiData = frontendData['testimonial-data'] || {};
  const beautyTestis = testiData.beauty_testi_data || [];
  const fashionTestis = testiData.fashion_testi_data || [];
  const testimonials = [
    ...fashionTestis.map(t => ({ ...t, user: typeof t.user === 'string' ? t.user : (t.user?.src || null), type: 'fashion' })),
    ...beautyTestis.map(t => ({ ...t, user: typeof t.user === 'string' ? t.user : (t.user?.src || null), type: 'coffee' })),
  ];

  // Extract comments
  const comments = frontendData['blog-comment-data']?.default || [];
  const commentsFlat = comments.map(c => ({
    id: c.id,
    name: c.name,
    date: c.date,
    comment: c.desc,
    user: typeof c.user === 'string' ? c.user : (c.user?.src || null),
    blogId: c.blogId || null,
    children: c.children ? {
      name: c.children.name,
      date: c.children.date,
      comment: c.children.desc,
      user: typeof c.children.user === 'string' ? c.children.user : (c.children.user?.src || null),
    } : null,
  }));

  // Asset summary by category
  const assetSummary = {};
  for (const asset of assetManifest) {
    const cat = asset.category;
    if (!assetSummary[cat]) assetSummary[cat] = { count: 0, totalSizeBytes: 0, files: [] };
    assetSummary[cat].count++;
    assetSummary[cat].totalSizeBytes += asset.sizeBytes;
    assetSummary[cat].files.push(asset.webPath);
  }

  const combined = {
    meta: {
      extractedAt: new Date().toISOString(),
      frontendRoot: FRONTEND_ROOT,
      backendRoot: BACKEND_ROOT,
      totalAssets: assetManifest.length,
      totalBlogs: blogs.length,
      totalTestimonials: testimonials.length,
      totalComments: commentsFlat.length,
    },
    assetManifest,
    assetSummaryByCategory: assetSummary,
    seedData: {
      blogs,
      testimonials,
      comments: commentsFlat,
    },
  };

  console.log(`  ✓ Combined: ${assetManifest.length} assets, ${blogs.length} blogs, ${testimonials.length} testimonials, ${commentsFlat.length} comments`);
  return combined;
}

// ─── Step 4: Save JSON ────────────────────────────────────────────────────────

function saveJSON(data) {
  console.log(`\n💾 Step 4: Saving to ${path.basename(OUTPUT_FILE)}...`);
  fs.writeFileSync(OUTPUT_FILE, JSON.stringify(data, null, 2), 'utf-8');
  const sizeKB = (fs.statSync(OUTPUT_FILE).size / 1024).toFixed(1);
  console.log(`  ✓ Saved ${path.basename(OUTPUT_FILE)} (${sizeKB} KB)`);
}

// ─── Step 5: Optional MongoDB Seeding ─────────────────────────────────────────

async function seedMongoDB(data) {
  console.log('\n🌱 Step 5: Seeding MongoDB...');

  const Product     = require('./models/Product');
  const Blog        = require('./models/Blog');
  const Testimonial = require('./models/Testimonial');
  const Comment     = require('./models/Comment');
  const StoreLocation = require('./models/StoreLocation');
  const Category    = require('./models/Category');
  const Event       = require('./models/Event');

  const MONGO_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/tomocadb';
  await mongoose.connect(MONGO_URI);
  console.log(`  ✓ Connected to MongoDB: ${MONGO_URI}`);

  // ── Blogs (postbox type ones that have full desc)
  const seedBlogs = data.seedData.blogs.filter(b => b.blog === 'blog-postbox' && b.desc);
  if (seedBlogs.length > 0) {
    await Blog.deleteMany({});
    await Blog.insertMany(seedBlogs);
    console.log(`  ✓ Seeded ${seedBlogs.length} blog(s)`);
  }

  // ── Testimonials
  if (data.seedData.testimonials.length > 0) {
    await Testimonial.deleteMany({});
    const testimonialsWithId = data.seedData.testimonials.map((t, i) => ({ ...t, id: i + 1 }));
    await Testimonial.insertMany(testimonialsWithId);
    console.log(`  ✓ Seeded ${testimonialsWithId.length} testimonial(s)`);
  }

  // ── Comments — link to blogs if no blogId set (assign to first blog)
  if (data.seedData.comments.length > 0) {
    await Comment.deleteMany({});
    const commentsWithBlog = data.seedData.comments.map((c, i) => ({
      ...c,
      id: c.id || i + 1,
      blogId: c.blogId || (seedBlogs[0]?.id ?? 7),
    }));
    await Comment.insertMany(commentsWithBlog);
    console.log(`  ✓ Seeded ${commentsWithBlog.length} comment(s)`);
  }

  await mongoose.disconnect();
  console.log('  ✓ MongoDB connection closed');
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  console.log('═══════════════════════════════════════════════════════');
  console.log('  Tomoca Data Extraction & Seeding Pipeline');
  console.log('═══════════════════════════════════════════════════════');
  console.log(`  Frontend : ${FRONTEND_ROOT}`);
  console.log(`  Backend  : ${BACKEND_ROOT}`);
  console.log(`  Seed DB  : ${SHOULD_SEED}`);

  try {
    const assetManifest  = extractAssetManifest();
    const frontendData   = extractFrontendData();
    const combined       = combineData(assetManifest, frontendData);

    saveJSON(combined);

    if (SHOULD_SEED) {
      await seedMongoDB(combined);
    }

    console.log('\n✅ Pipeline completed successfully!');
    console.log(`   Output: ${OUTPUT_FILE}`);
  } catch (err) {
    console.error('\n❌ Pipeline failed:', err.message);
    console.error(err.stack);
    process.exit(1);
  }
}

main();
