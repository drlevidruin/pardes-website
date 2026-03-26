#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const ROOT = path.resolve(__dirname, '..');
const MANIFEST_FILE = path.join(ROOT, 'data', 'image-manifest.json');
const STALE_IMAGE_DIRS = new Set([
  'Website Pictures Elementary',
  'Gan Katan Website Pictures',
]);
const IMAGE_EXTENSIONS = new Set([
  '.jpg',
  '.jpeg',
  '.png',
  '.gif',
  '.webp',
  '.svg',
  '.heic',
  '.avif',
]);
const TEXT_EXTENSIONS = new Set([
  '.html',
  '.js',
  '.json',
  '.md',
  '.css',
  '.svg',
  '.txt',
  '.yml',
  '.yaml',
  '.toml',
]);
const findings = [];
const stats = {
  htmlFiles: 0,
  htmlAssetRefs: 0,
  manifestPaths: 0,
  sourceFiles: 0,
  imageFiles: 0,
};

main();

function main() {
  const htmlFiles = listFiles(ROOT, (filePath) => path.extname(filePath).toLowerCase() === '.html').sort();
  stats.htmlFiles = htmlFiles.length;
  for (const filePath of htmlFiles) {
    scanHtmlFile(filePath);
  }

  scanManifest(MANIFEST_FILE);

  const sourceFiles = listFiles(ROOT, isTextSourceFile).sort();
  stats.sourceFiles = sourceFiles.length;
  for (const filePath of sourceFiles) {
    scanSecrets(filePath);
  }

  const imagesRoot = path.join(ROOT, 'assets', 'images');
  const imageFiles = fs.existsSync(imagesRoot)
    ? listFiles(imagesRoot, (filePath) => IMAGE_EXTENSIONS.has(path.extname(filePath).toLowerCase())).sort()
    : [];
  stats.imageFiles = imageFiles.length;
  for (const filePath of imageFiles) {
    scanJunkFilename(filePath);
  }

  printResults();
  process.exitCode = findings.length === 0 ? 0 : 1;
}

function scanHtmlFile(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lineStarts = buildLineStarts(text);
  const referencePattern = /(?:src|href)\s*=\s*(["'])([^"']+)\1|url\(\s*(["']?)([^)"']+)\3\s*\)/gi;

  for (const match of text.matchAll(referencePattern)) {
    const ref = (match[2] || match[4] || '').trim();
    if (!ref || isExternalReference(ref)) {
      continue;
    }

    const line = getLineNumber(lineStarts, match.index);
    const resolved = resolveReference(filePath, ref);
    if (resolved.repoRelative && resolved.repoRelative.startsWith('assets/')) {
      stats.htmlAssetRefs += 1;
      if (!isExistingFile(resolved.absolutePath)) {
        addFinding({
          code: 'broken-asset',
          file: filePath,
          line,
          message: `Asset reference does not resolve: ${ref}`,
        });
      }
    }

    checkImageDirectoryReference(filePath, line, ref);
  }

  scanPublicPageShell(filePath, text, lineStarts);
}

function scanManifest(filePath) {
  if (!fs.existsSync(filePath)) {
    addFinding({
      code: 'manifest',
      file: filePath,
      line: 1,
      message: 'Missing data/image-manifest.json.',
    });
    return;
  }

  const text = fs.readFileSync(filePath, 'utf8');
  try {
    JSON.parse(text);
  } catch (error) {
    addFinding({
      code: 'manifest',
      file: filePath,
      line: 1,
      message: `Invalid JSON: ${error.message}`,
    });
    return;
  }

  const lines = text.split(/\r?\n/);
  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const pathPattern = /"((?:assets\/)[^"]+)"/g;
    for (const match of line.matchAll(pathPattern)) {
      const assetPath = match[1];
      stats.manifestPaths += 1;
      const resolvedPath = path.join(ROOT, ...assetPath.split('/'));
      if (!isExistingFile(resolvedPath)) {
        addFinding({
          code: 'manifest',
          file: filePath,
          line: index + 1,
          message: `Manifest path does not resolve: ${assetPath}`,
        });
      }
      checkImageDirectoryReference(filePath, index + 1, assetPath);
    }
  }
}

function scanSecrets(filePath) {
  const text = fs.readFileSync(filePath, 'utf8');
  const lines = text.split(/\r?\n/);

  for (let index = 0; index < lines.length; index += 1) {
    const line = lines[index];
    const secretMatch = detectSecretLikeString(line);
    if (!secretMatch) {
      continue;
    }

    addFinding({
      code: 'secret-like',
      file: filePath,
      line: index + 1,
      message: secretMatch,
    });
  }
}

function scanJunkFilename(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  if (!IMAGE_EXTENSIONS.has(ext)) {
    return;
  }

  const basename = path.basename(filePath, ext).toLowerCase();
  if (!/^[a-z]{2,12}$/.test(basename)) {
    return;
  }

  const uniqueRatio = new Set(basename).size / basename.length;
  if (uniqueRatio > 0.5) {
    return;
  }

  addFinding({
    code: 'junk-filename',
    file: filePath,
    message: 'Suspicious low-entropy image filename; likely a test upload that should be reviewed.',
  });
}

function detectSecretLikeString(line) {
  const literalPrefixPatterns = [
    /\bgh[pousr]_[A-Za-z0-9_]{20,}\b/,
    /\bgithub_pat_[A-Za-z0-9_]{20,}\b/,
    /\bsk-[A-Za-z0-9_-]{16,}\b/,
  ];
  if (literalPrefixPatterns.some((pattern) => pattern.test(line))) {
    return 'Contains a token/key prefix that looks like a real secret.';
  }

  const literalAssignment = line.match(
    /(?:"|')?(api(?:[_ -]?key)?|token|secret|password|passwd|pwd)(?:"|')?\s*[:=]\s*(?:"([^"\n]{6,})"|'([^'\n]{6,})'|`([^`\n]{6,})`)/i,
  );
  if (literalAssignment) {
    const value = literalAssignment[2] || literalAssignment[3] || literalAssignment[4] || '';
    if (!/^[a-f0-9]{64}$/i.test(value)) {
      return `Contains a literal ${literalAssignment[1]} assignment that should be reviewed.`;
    }
  }

  if (/\b(?:default|credentials?)\b.{0,24}:\s*[A-Za-z0-9._-]{3,}\s*\/\s*[^\s/]{6,}/i.test(line)) {
    return 'Contains a default credential-style pair that should not be committed.';
  }

  return null;
}

function checkImageDirectoryReference(filePath, line, ref) {
  const normalizedRef = safeDecode(stripQueryAndHash(ref)).replace(/\\/g, '/');
  const match = normalizedRef.match(/(?:^|\/)assets\/images\/([^/]+)\//);
  if (!match) {
    return;
  }

  const subdirectory = match[1];
  const directoryPath = path.join(ROOT, 'assets', 'images', subdirectory);
  if (!fs.existsSync(directoryPath) || !fs.statSync(directoryPath).isDirectory()) {
    const extra = STALE_IMAGE_DIRS.has(subdirectory)
      ? ' (known stale directory)'
      : '';
    addFinding({
      code: 'stale-image-dir',
      file: filePath,
      line,
      message: `References missing assets/images subdirectory "${subdirectory}"${extra}.`,
    });
  }
}

function resolveReference(fromFilePath, ref) {
  const cleanedRef = safeDecode(stripQueryAndHash(ref));
  const absolutePath = cleanedRef.startsWith('/')
    ? path.join(ROOT, cleanedRef.slice(1))
    : path.resolve(path.dirname(fromFilePath), cleanedRef);

  const repoRelative = isWithinRepo(absolutePath)
    ? toPosix(path.relative(ROOT, absolutePath))
    : null;

  return {
    absolutePath,
    repoRelative,
  };
}

function scanPublicPageShell(filePath, text, lineStarts) {
  const relativePath = toPosix(path.relative(ROOT, filePath));
  if (!isPublicPage(relativePath)) {
    return;
  }

  const expectedContext = relativePath === 'index.html' ? 'root' : 'subpage';
  const expectedScript = expectedContext === 'root' ? 'js/site-shell.js' : '../js/site-shell.js';
  const expectedCta = ({
    'index.html': 'team',
    'pages/about.html': 'team',
    'pages/preschool.html': 'team',
  })[relativePath] || (expectedContext === 'root' ? 'team' : 'tour');
  const shellScriptMatches = [...text.matchAll(/<script\b[^>]*\bsrc=(["'])([^"']+site-shell\.js)\1[^>]*><\/script>/gi)];
  const shellScriptMatch = shellScriptMatches[0] || null;
  const mainBundleIndex = text.indexOf('main-cpapzbpt.js');

  if (!shellScriptMatch) {
    addFinding({
      code: 'shell',
      file: filePath,
      line: 1,
      message: 'Missing required site-shell.js include on public page.',
    });
  } else {
    if (shellScriptMatches.length !== 1) {
      addFinding({
        code: 'shell',
        file: filePath,
        line: getLineNumber(lineStarts, shellScriptMatch.index),
        message: 'Expected exactly one site-shell.js include on public page.',
      });
    }

    const shellPath = shellScriptMatch[2];
    if (shellPath !== expectedScript) {
      addFinding({
        code: 'shell',
        file: filePath,
        line: getLineNumber(lineStarts, shellScriptMatch.index),
        message: `site-shell.js include should be "${expectedScript}", found "${shellPath}".`,
      });
    }

    if (mainBundleIndex !== -1 && shellScriptMatch.index > mainBundleIndex) {
      addFinding({
        code: 'shell',
        file: filePath,
        line: getLineNumber(lineStarts, shellScriptMatch.index),
        message: 'site-shell.js must load before the main bundle.',
      });
    }
  }

  validateShellElement({
    filePath,
    text,
    lineStarts,
    tagName: 'site-header',
    requiredAttributes: {
      'data-context': expectedContext,
      'data-cta': expectedCta,
    },
  });

  validateShellElement({
    filePath,
    text,
    lineStarts,
    tagName: 'site-footer',
    requiredAttributes: {
      'data-context': expectedContext,
    },
  });

  const legacyHeader = text.match(/<header\s+class=(["'])site-header\1/i);
  if (legacyHeader) {
    addFinding({
      code: 'shell',
      file: filePath,
      line: getLineNumber(lineStarts, legacyHeader.index),
      message: 'Legacy static site-header markup should be replaced by <site-header>.',
    });
  }

  const legacyFooter = text.match(/<footer\s+class=(["'])site-footer\1/i);
  if (legacyFooter) {
    addFinding({
      code: 'shell',
      file: filePath,
      line: getLineNumber(lineStarts, legacyFooter.index),
      message: 'Legacy static site-footer markup should be replaced by <site-footer>.',
    });
  }
}

function isPublicPage(relativePath) {
  return relativePath === 'index.html' || /^pages\/[^/]+\.html$/.test(relativePath);
}

function validateShellElement({ filePath, text, lineStarts, tagName, requiredAttributes }) {
  const matches = [...text.matchAll(new RegExp(`<${tagName}\\b([^>]*)><\\/${tagName}>`, 'gi'))];
  if (matches.length !== 1) {
    addFinding({
      code: 'shell',
      file: filePath,
      line: 1,
      message: `Expected exactly one <${tagName}></${tagName}> placeholder.`,
    });
    return;
  }

  const match = matches[0];
  const attributesSource = match[1];
  for (const [name, expectedValue] of Object.entries(requiredAttributes)) {
    const actualValue = getAttributeValue(attributesSource, name);
    if (!actualValue) {
      addFinding({
        code: 'shell',
        file: filePath,
        line: getLineNumber(lineStarts, match.index),
        message: `<${tagName}> is missing required ${name}.`,
      });
      continue;
    }

    if (actualValue !== expectedValue) {
      addFinding({
        code: 'shell',
        file: filePath,
        line: getLineNumber(lineStarts, match.index),
        message: `<${tagName}> has ${name}="${actualValue}", expected "${expectedValue}".`,
      });
    }
  }
}

function getAttributeValue(attributesSource, attributeName) {
  const match = attributesSource.match(new RegExp(`\\b${attributeName}=(["'])([^"']+)\\1`, 'i'));
  return match ? match[2] : null;
}

function stripQueryAndHash(ref) {
  return ref.split('#')[0].split('?')[0];
}

function safeDecode(value) {
  try {
    return decodeURIComponent(value);
  } catch {
    return value;
  }
}

function isExternalReference(ref) {
  return /^(?:https?:|data:|mailto:|tel:|javascript:|#)/i.test(ref);
}

function isExistingFile(filePath) {
  try {
    return fs.statSync(filePath).isFile();
  } catch {
    return false;
  }
}

function isTextSourceFile(filePath) {
  if (isWithinRepo(filePath) && toPosix(path.relative(ROOT, filePath)).startsWith('.git/')) {
    return false;
  }

  const basename = path.basename(filePath);
  if (basename === '.gitignore') {
    return true;
  }

  return TEXT_EXTENSIONS.has(path.extname(filePath).toLowerCase());
}

function listFiles(startPath, predicate) {
  const files = [];
  walk(startPath, files, predicate);
  return files;
}

function walk(currentPath, files, predicate) {
  if (!fs.existsSync(currentPath)) {
    return;
  }

  const statsForPath = fs.statSync(currentPath);
  if (!statsForPath.isDirectory()) {
    if (predicate(currentPath)) {
      files.push(currentPath);
    }
    return;
  }

  const entries = fs.readdirSync(currentPath, { withFileTypes: true });
  for (const entry of entries) {
    if (entry.name === '.git') {
      continue;
    }

    const nextPath = path.join(currentPath, entry.name);
    if (entry.isDirectory()) {
      walk(nextPath, files, predicate);
    } else if (predicate(nextPath)) {
      files.push(nextPath);
    }
  }
}

function buildLineStarts(text) {
  const starts = [0];
  for (let index = 0; index < text.length; index += 1) {
    if (text.charCodeAt(index) === 10) {
      starts.push(index + 1);
    }
  }
  return starts;
}

function getLineNumber(lineStarts, index) {
  let low = 0;
  let high = lineStarts.length - 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    if (lineStarts[mid] <= index) {
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return high + 1;
}

function addFinding(finding) {
  findings.push({
    ...finding,
    file: path.resolve(finding.file),
  });
}

function isWithinRepo(filePath) {
  const relativePath = path.relative(ROOT, filePath);
  return relativePath === '' || (!relativePath.startsWith('..') && !path.isAbsolute(relativePath));
}

function toPosix(value) {
  return value.split(path.sep).join('/');
}

function printResults() {
  findings.sort((left, right) => {
    const fileCompare = left.file.localeCompare(right.file);
    if (fileCompare !== 0) {
      return fileCompare;
    }

    const leftLine = left.line || 0;
    const rightLine = right.line || 0;
    if (leftLine !== rightLine) {
      return leftLine - rightLine;
    }

    return left.code.localeCompare(right.code);
  });

  if (findings.length === 0) {
    console.log(
      `PASS validation (${stats.htmlFiles} HTML files, ${stats.htmlAssetRefs} asset refs, ${stats.manifestPaths} manifest paths, ${stats.sourceFiles} source files, ${stats.imageFiles} images scanned).`,
    );
    return;
  }

  console.error(`FAIL validation (${findings.length} findings)`);
  for (const finding of findings) {
    const location = finding.line ? `${finding.file}:${finding.line}` : finding.file;
    console.error(`- [${finding.code}] ${location} ${finding.message}`);
  }
}
