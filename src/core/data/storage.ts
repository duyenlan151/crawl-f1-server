import fs from 'fs/promises';
import path from 'path';

import { F1Metadata } from './types';

// const DEFAULT_FILE_PATH = 'f1_metadata.json';
const DEFAULT_FILE_PATH = path.resolve(__dirname, '../f1_metadata.json');


/**
 * Reads data from a JSON file.
 * @param filePath The file path, defaults to 'f1_metadata.json'.
 * @returns The F1Metadata data.
 * @throws Error if reading the file fails.
 */
export async function readDataFile(filePath: string = DEFAULT_FILE_PATH): Promise<F1Metadata | []> {
  try {
    const data = await fs.readFile(filePath, 'utf8');
    return JSON.parse(data) as F1Metadata;
  } catch (error) {
    return [];
    // throw new Error(`Failed to read data from ${filePath}: ${(error as Error).message}`);
  }
}

/**
 * Writes data to a JSON file.
 * @param data The F1Metadata data to be written.
 * @param filePath The file path, defaults to 'f1_metadata.json'.
 * @throws Error if writing to the file fails.
 */
export async function saveData(data: F1Metadata, filePath: string = DEFAULT_FILE_PATH): Promise<void> {
  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    throw new Error(`Failed to save data to ${filePath}: ${(error as Error).message}`);
  }
}
