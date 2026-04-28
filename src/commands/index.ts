import type { CommandsRegistry, CommandHandler } from "./types";
import { commandLogin } from "./commandLogin";
import { commandRegister } from "./commandRegister";
import { commandReset } from "./commandReset";
import { commandUsers } from "./commandUsers";

/**
 * helper: register a new command in the registry
 * @param registry - the registry where you are storing the commands
 * @param cmdName - name of the command like, login, help, exit, etc.
 * @param handler - command handler
*/
export function registerCommand(
  registry: CommandsRegistry,
  cmdName: string,
  handler: CommandHandler
): void {
  registry[cmdName] = handler;
}

/**
 * helper: run a registered command
 * @param registry - the command registry
 * @param cmdName - name of the command like, login, help, exit, etc.
 * @param args - extra arguments if any of the command e.g. login <user>
*/
export async function runCommand(
  registry: CommandsRegistry,
  cmdName: string,
  ...args: string[]
): Promise<void> {
  const handler = registry[cmdName];

  if (!handler) {
    throw new Error(`Unknown command: ${cmdName}`);
  }

  await handler(cmdName, ...args);
}

/**
  * helper to create and setup the default registry with all commands
*/
export function createCommandRegistry(): CommandsRegistry {
  const registry: CommandsRegistry = {};

  // register all commands here
  registerCommand(registry, "login", commandLogin);
  registerCommand(registry, "register", commandRegister);
  registerCommand(registry, "reset", commandReset);
  registerCommand(registry, "users", commandUsers);

  return registry;
}
