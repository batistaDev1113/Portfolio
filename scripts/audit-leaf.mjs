#!/usr/bin/env node
/**
 * scripts/audit-leaf.mjs
 *
 * Enumerates DISTINCT leaf-cert GHSA advisories across the dep graph.
 * Reconciles meta-vs-leaf numbers so callers can be honest in their
 * tracking-issue body that:
 *   - npm audit's `meta.vulnerabilities.high = N` is the propagated
 *     path-count (multi-path chains through the dep tree aggregate).
 *   - This script's `LEAF-COUNT` is the distinct GHSA count the
 *     upstream mainter needs to ship a fix for.
 *
 * Usage: node scripts/audit-leaf.mjs <audit.json>
 */
import { readFileSync } from 'node:fs';
import process from 'node:process';

if (process.argv.length < 3) {
  console.error('usage: node scripts/audit-leaf.mjs <audit.json>');
  process.exit(2);
}

const audit = JSON.parse(readFileSync(process.argv[2], 'utf8'));
const meta = audit.metadata?.vulnerabilities ?? {};
const vulns = audit.vulnerabilities ?? {};

// {url: {severity, title, package: 'leaf-source'}} — only entries with .url are leaves
const leaves = new Map();

// First pass: discover which packages have direct (leaf-cert) advisory entries.
for (const [pkg, v] of Object.entries(vulns)) {
  for (const via of v.via ?? []) {
    if (typeof via !== 'object') continue;          // skip transitive-string refs
    const url = via.url;
    if (!url) continue;
    if (!leaves.has(url)) {
      leaves.set(url, { severity: via.severity, title: via.title, leafSource: pkg });
    }
  }
}

// Second pass: count propagation-path references per leaf (chain refs that's how 29 builds up).
const propagationByLeaf = new Map();
for (const url of leaves.keys()) propagationByLeaf.set(url, 0);
for (const [, v] of Object.entries(vulns)) {
  for (const via of v.via ?? []) {
    if (typeof via !== 'object') continue;
    const url = via.url;
    if (url && propagationByLeaf.has(url)) {
      propagationByLeaf.set(url, propagationByLeaf.get(url) + 1);
    }
  }
}

// Group distinct leaves by severity.
const bySeverity = { critical: [], high: [], moderate: [], low: [] };
let metaReconciled = 0;
for (const [url, info] of leaves.entries()) {
  const sev = info.severity ?? 'unknown';
  if (bySeverity[sev]) bySeverity[sev].push({ url, info, propagation: propagationByLeaf.get(url) });
  if (sev === 'high' || sev === 'critical') metaReconciled += propagationByLeaf.get(url);
}

console.log(`# meta-vs-leaf reconciliation`);
console.log(`# npm audit meta.vulnerabilities.high = ${meta.high ?? 0}`);
console.log(`# distinct leaf-cert GHSAs at HIGH = ${bySeverity.high.length}`);
console.log(`# propagation-paths through dep graph (from leaf-certs) = ${metaReconciled}`);
console.log(`# distinct leaf-cert GHSAs at MODERATE = ${bySeverity.moderate.length}`);
console.log(`# distinct leaf-cert GHSAs at LOW = ${bySeverity.low.length}`);
console.log(`# distinct leaf-cert GHSAs at CRITICAL = ${bySeverity.critical.length}`);
console.log(``);
console.log(`# HIGH-severity leaf-cert GHSAs (distinct upstream fixes):`);
for (const { url, info, propagation } of bySeverity.high) {
  console.log(`  ${url} | leaf=@${info.leafSource} | propagation-paths=${propagation} | ${info.title ?? ''}`);
}
console.log(``);
console.log(`# MODERATE-severity leaf-cert GHSAs:`);
for (const { url, info, propagation } of bySeverity.moderate) {
  console.log(`  ${url} | leaf=@${info.leafSource} | propagation-paths=${propagation} | ${info.title ?? ''}`);
}
