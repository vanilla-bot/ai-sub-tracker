import type { Plan, UsageEntry } from '../models/plan';
/**
 * Loads plans from a JSON file (sync).
 * Returns an empty array if the file doesn't exist.
 */
export declare function loadPlansSync(filePath: string): Plan[];
/**
 * Loads plans from a JSON file.
 * Returns an empty array if the file doesn't exist.
 * Throws if the file exists but contains invalid JSON.
 */
export declare function loadPlans(filePath: string): Promise<Plan[]>;
/**
 * Saves plans to a JSON file.
 */
export declare function savePlansSync(filePath: string, plans: Plan[]): void;
/**
 * Saves plans to a JSON file.
 */
export declare function savePlans(filePath: string, plans: Plan[]): Promise<void>;
/**
 * Loads usage entries from a JSON file (sync).
 * Returns an empty array if the file doesn't exist.
 */
export declare function loadUsageEntriesSync(filePath: string): UsageEntry[];
/**
 * Loads usage entries from a JSON file.
 * Returns an empty array if the file doesn't exist.
 * Throws if the file exists but contains invalid JSON.
 */
export declare function loadUsageEntries(filePath: string): Promise<UsageEntry[]>;
/**
 * Saves usage entries to a JSON file.
 */
export declare function saveUsageEntriesSync(filePath: string, entries: UsageEntry[]): void;
/**
 * Saves usage entries to a JSON file.
 */
export declare function saveUsageEntries(filePath: string, entries: UsageEntry[]): Promise<void>;
//# sourceMappingURL=fileStore.d.ts.map