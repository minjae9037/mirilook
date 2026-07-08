import type { CapacitorConfig } from "@capacitor/cli";
import { readFileSync } from "fs";
import { join } from "path";

// NOTE: the Capacitor CLI transpiles this file to CommonJS before executing
// it, so we rely on __dirname (CJS) instead of import.meta.url (ESM).
const here = __dirname;

interface SharedConfig {
  appName: string;
  productName: string;
  webUrl: string;
  bundleIdPrefix: string;
  aiBackend: string;
}

interface CountryConfig {
  country: string;
  enabled: boolean;
  defaultLocale: string;
  storeName: string;
  appId: string;
  distribution: string[];
  paymentProvider: string;
  aiBackend: string;
  storeLocale: string;
  blockers?: string[];
  note?: string;
}

function readJson<T>(relPath: string): T {
  return JSON.parse(readFileSync(join(here, relPath), "utf8")) as T;
}

function resolveCountry(): { shared: SharedConfig; country: CountryConfig } {
  const shared = readJson<SharedConfig>("config/shared.json");
  const requested = (process.env.MIRILOOK_COUNTRY || "kr").toLowerCase();
  let country: CountryConfig;
  try {
    country = readJson<CountryConfig>(`config/countries/${requested}.json`);
  } catch {
    console.warn(
      `[mirilook-mobile] Unknown country "${requested}", falling back to "kr".`,
    );
    country = readJson<CountryConfig>("config/countries/kr.json");
  }
  return { shared, country };
}

const { shared, country } = resolveCountry();

const config: CapacitorConfig = {
  appId: country.appId || `${shared.bundleIdPrefix}.app`,
  appName: country.storeName || shared.appName,
  webDir: "shell",
  server: {
    url: process.env.MIRILOOK_WEB_URL || shared.webUrl,
    cleartext: false,
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1200,
      launchAutoHide: true,
      backgroundColor: "#FFF0F5",
      showSpinner: false,
    },
    PushNotifications: {
      presentationOptions: ["badge", "sound", "alert"],
    },
  },
};

export default config;
