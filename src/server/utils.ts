import fs from 'node:fs/promises';

export async function loadJSONFile(filepath: string) {
  const json = await fs.readFile(filepath, 'utf-8');

  return JSON.parse(json);
}
