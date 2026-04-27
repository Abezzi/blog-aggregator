import fs from "fs";
import os from "os";
import path from "path";

export type Config = {
  dbUrl: string;
  // optional because it might not exist
  currentUserName?: string;
};

/** 
 * helper: get the full path to ~/.gatorconfig.json
 * @returns the config full path
 */
function getConfigFilePath(): string {
  const homeDir = os.homedir();
  return path.join(homeDir, ".gatorconfig.json");
}

/**
 * helper: write Config object to disk
 * @param cfg - config of type Config
*/
function writeConfig(cfg: Config): void {
  const filePath = getConfigFilePath();
  // convert camelCase to snake_case for JSON
  const jsonConfig = {
    db_url: cfg.dbUrl,
    current_user_name: cfg.currentUserName,
  };

  fs.writeFileSync(filePath, JSON.stringify(jsonConfig, null, 2), { encoding: "utf-8" });
}

/**
 * helper: validate raw JSON object and convert to Config type
 * @param rawConfig - raw json config
 * @returns JSON converted into Config type
 */
function validateConfig(rawConfig: any): Config {
  if (typeof rawConfig !== "object" || rawConfig === null) {
    throw new Error("Invalid config: must be an object");
  }

  if (typeof rawConfig.db_url !== "string") {
    throw new Error("Invalid config: db_url must be a string");
  }

  return {
    dbUrl: rawConfig.db_url,
    currentUserName: typeof rawConfig.current_user_name === "string"
      ? rawConfig.current_user_name
      : undefined,
  };
}

/**
 * read config from ~/.gatorconfig.json
 * @returns validated config
 */
export function readConfig(): Config {
  const filePath = getConfigFilePath();

  if (!fs.existsSync(filePath)) {
    throw new Error(`Config file not found at ${filePath}. Please create ~/.gatorconfig.json first.`);
  }

  const fileContent = fs.readFileSync(filePath, { encoding: "utf-8" });
  const rawConfig = JSON.parse(fileContent);

  return validateConfig(rawConfig);
}

/**
 * set current user and save config
 * @param userName string with your name like "Alex"
 */
export function setUser(userName: string): void {
  // read existing config
  let config: Config;

  try {
    config = readConfig();
  } catch (error) {
    // if config doesn't exist yet, create minimal config
    config = { dbUrl: "postgres://example" };
  }

  // update the user
  config.currentUserName = userName;

  // write back to disk
  writeConfig(config);
}
