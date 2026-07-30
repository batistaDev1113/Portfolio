#!/usr/bin/env node
/**
 * scripts/audit-tally.mjs
 *
 * Reads npm audit JSON and groups advisories by package + severity.
 * Prints a top-N table sorted by (critical+high) count desc, with
 * each advisory's human-readable title alongside its GHSA URL.
 * Used to drive upstream-unblock watcher issues (mirror Issue #95).
 *
 * Usage:  node scripts/audit-tally.mjs <path/to/audit.json> [N]
 *   N default = 8
 */
import { readFileSync } from 'node:fs';
import process from 'node:process';

if (process.argv.length < 3) {
  console.error('usage: node scripts/audit-tally.mjs <audit.json> [N]');
  process.exit(2);
}

const input = process.argv[2];
const topN = Number(process.argv[3] ?? 8);

const audit = JSON.parse(readFileSync(input, 'utf8'));
const meta = audit.metadata?.vulnerabilities ?? {};
const vulns = audit.vulnerabilities ?? {};

console.log(
  `# totals: critical=${meta.critical ?? 0} ` +
    `high=${meta.high ?? 0} ` +
    `moderate=${meta.moderate ?? 0} ` +
    `low=${meta.low ?? 0}`,
);

const grouped = new Map();
for (const [pkg, v] of Object.entries(vulns)) {
  for (const via of v.via ?? []) {
    if (typeof via !== 'object') continue;
    const severity = via.severity ?? 'unknown';
    const slot = grouped.get(pkg) ?? {
      c: 0,
      h: 0,
      m: 0,
      l: 0,
      ghsas: new Set(),
      titles: new Map(),
    };
    const code = severity[0];
    if (code === 'c' || code === 'h' || code === 'm' || code === 'l') slot[code]++;
    const url = via.url ?? '';
    if (url) slot.ghsas.add(url);
    if (via.title) slot.titles.set(url, via.title);
    grouped.set(pkg, slot);
  }
}

const ranked = [...grouped.entries()]
  .map(([pkg, s]) => ({
    pkg,
    critical: s.c,
    high: s.h,
    moderate: s.m,
    low: s.l,
    ghsas: [...s.ghsas],
    titles: s.titles,
  }))
  .sort((a, b) => b.critical + b.high - (a.critical + a.high));

console.log(`# top ${topN} packages by (critical+high) count:`);
for (const row of ranked.slice(0, topN)) {
  const totalHighCrit = row.critical + row.high;
  if (totalHighCrit === 0) break;
  console.log(
    `- ${row.pkg} | crit=${row.critical} high=${row.high} ` +
      `mod=${row.moderate} low=${row.low} | ${row.ghsas.length} GHSA(s)`,
  );
  for (const g of row.ghsas) {
    const t = row.titles.get(g);
    console.log(`    ${g}${t ? ` — ${t}` : ''}`);
  }
}
