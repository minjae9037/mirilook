#!/usr/bin/env node
/**
 * Per-country build driver for the Mirilook mobile wrapper.
 *
 * Usage: node scripts/build-country.mjs --country=kr
 *
 * Loads config/shared.json + config/countries/<xx>.json, refuses disabled
 * countries (e.g. cn), writes .env.build with the resolved values, then
 * runs `cap sync` with MIRILOOK_COUNTRY set so capacitor.config.ts picks
 * up the same country.
 */
import { spawnSync } from "node:child_process";
import { readFileSync, writeFileSync, existsSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const here = dirname(fileURLToPath(import.meta.url));
const mobileRoot = join(here, "..");

function parseCountryArg() {
  for (const arg of process.argv.slice(2)) {
    const match = /^--country=(.+)$/.exec(arg);
    if (match) return match[1].toLowerCase();
  }
  return "kr";
}

function readJson(path) {
  return JSON.parse(readFileSync(path, "utf8"));
}

const countryCode = parseCountryArg();
const sharedPath = join(mobileRoot, "config", "shared.json");
const countryPath = join(mobileRoot, "config", "countries", `${countryCode}.json`);

if (!existsSync(countryPath)) {
  console.error(`[build-country] Unknown country "${countryCode}".`);
  console.error(`[build-country] Expected config file: ${countryPath}`);
  process.exit(1);
}

const shared = readJson(sharedPath);
const country = readJson(countryPath);

if (country.enabled !== true) {
  console.error(`[build-country] Country "${countryCode}" is DISABLED. Refusing to build.`);
  if (Array.isArray(country.blockers) && country.blockers.length > 0) {
    console.error("[build-country] Blockers:");
    for (const blocker of country.blockers) {
      console.error(`  - ${blocker}`);
    }
  }
  if (country.note) {
    console.error(`[build-country] Note: ${country.note}`);
  }
  process.exit(1);
}

const resolved = {
  MIRILOOK_COUNTRY: country.country,
  MIRILOOK_APP_ID: country.appId || `${shared.bundleIdPrefix}.app`,
  MIRILOOK_APP_NAME: country.storeName || shared.appName,
  MIRILOOK_DEFAULT_LOCALE: country.defaultLocale,
  MIRILOOK_STORE_LOCALE: country.storeLocale,
  MIRILOOK_WEB_URL: shared.webUrl,
  MIRILOOK_AI_BACKEND: country.aiBackend || shared.aiBackend,
  MIRILOOK_PAYMENT_PROVIDER: country.paymentProvider,
  MIRILOOK_DISTRIBUTION: (country.distribution || []).join(","),
};

console.log("[build-country] Resolved build configuration:");
console.log(`  country        : ${resolved.MIRILOOK_COUNTRY}`);
console.log(`  appId          : ${resolved.MIRILOOK_APP_ID}`);
console.log(`  appName        : ${resolved.MIRILOOK_APP_NAME}`);
console.log(`  defaultLocale  : ${resolved.MIRILOOK_DEFAULT_LOCALE}`);
console.log(`  storeLocale    : ${resolved.MIRILOOK_STORE_LOCALE}`);
console.log(`  webUrl         : ${resolved.MIRILOOK_WEB_URL}`);
console.log(`  aiBackend      : ${resolved.MIRILOOK_AI_BACKEND}`);
console.log(`  payment        : ${resolved.MIRILOOK_PAYMENT_PROVIDER}`);
console.log(`  distribution   : ${resolved.MIRILOOK_DISTRIBUTION}`);

const envLines = Object.entries(resolved)
  .map(([key, value]) => `${key}=${value}`)
  .join("\n");
const envPath = join(mobileRoot, ".env.build");
writeFileSync(envPath, `${envLines}\n`, "utf8");
console.log(`[build-country] Wrote ${envPath}`);

console.log("[build-country] Running: cap sync");
const result = spawnSync("npx", ["cap", "sync"], {
  cwd: mobileRoot,
  stdio: "inherit",
  shell: process.platform === "win32",
  env: { ...process.env, ...resolved },
});

if (result.error) {
  console.error(`[build-country] cap sync failed to start: ${result.error.message}`);
  process.exit(1);
}
if (result.status !== 0) {
  console.error(`[build-country] cap sync exited with code ${result.status}.`);
  console.error("[build-country] If native platforms are missing, run `npx cap add android` / `npx cap add ios` first.");
  process.exit(result.status ?? 1);
}

console.log(`[build-country] Done. Country "${countryCode}" is synced and ready for a native build.`);
