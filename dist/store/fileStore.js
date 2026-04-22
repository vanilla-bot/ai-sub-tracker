import * as fs from 'fs';
import * as path from 'path';
import { readFileSync, writeFileSync, mkdirSync } from 'fs';
const FILE_NOT_FOUND_ERROR_CODES = ['ENOENT', 'ENFILE'];
/**
 * Checks if an error indicates the file was not found.
 */
function isFileNotFoundError(error) {
    return FILE_NOT_FOUND_ERROR_CODES.includes(error.code);
}
/**
 * Loads plans from a JSON file (sync).
 * Returns an empty array if the file doesn't exist.
 */
export function loadPlansSync(filePath) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            throw new Error('Plans file must contain a JSON array');
        }
        return parsed;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
/**
 * Loads plans from a JSON file.
 * Returns an empty array if the file doesn't exist.
 * Throws if the file exists but contains invalid JSON.
 */
export async function loadPlans(filePath) {
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            throw new Error('Plans file must contain a JSON array');
        }
        return parsed;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
/**
 * Saves plans to a JSON file.
 */
export function savePlansSync(filePath, plans) {
    const dir = path.dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, JSON.stringify(plans, null, 2), 'utf-8');
}
/**
 * Saves plans to a JSON file.
 */
export async function savePlans(filePath, plans) {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(plans, null, 2), 'utf-8');
}
/**
 * Loads usage entries from a JSON file (sync).
 * Returns an empty array if the file doesn't exist.
 */
export function loadUsageEntriesSync(filePath) {
    try {
        const content = readFileSync(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            throw new Error('Usage entries file must contain a JSON array');
        }
        return parsed;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
/**
 * Loads usage entries from a JSON file.
 * Returns an empty array if the file doesn't exist.
 * Throws if the file exists but contains invalid JSON.
 */
export async function loadUsageEntries(filePath) {
    try {
        const content = await fs.promises.readFile(filePath, 'utf-8');
        const parsed = JSON.parse(content);
        if (!Array.isArray(parsed)) {
            throw new Error('Usage entries file must contain a JSON array');
        }
        return parsed;
    }
    catch (error) {
        if (error.code === 'ENOENT') {
            return [];
        }
        throw error;
    }
}
/**
 * Saves usage entries to a JSON file.
 */
export function saveUsageEntriesSync(filePath, entries) {
    const dir = path.dirname(filePath);
    mkdirSync(dir, { recursive: true });
    writeFileSync(filePath, JSON.stringify(entries, null, 2), 'utf-8');
}
/**
 * Saves usage entries to a JSON file.
 */
export async function saveUsageEntries(filePath, entries) {
    const dir = path.dirname(filePath);
    await fs.promises.mkdir(dir, { recursive: true });
    await fs.promises.writeFile(filePath, JSON.stringify(entries, null, 2), 'utf-8');
}
//# sourceMappingURL=fileStore.js.map