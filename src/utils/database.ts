import { exists, writeTextFile, readTextFile, BaseDirectory, createDir } from '@tauri-apps/api/fs';

const DATABASE_ROOT = 'databases';
const DATABASE_FILE = `${DATABASE_ROOT}/v1.txt`;

export interface IDatabase {
  token?: {
    github?: string;
  };
}

export const getAllDatabase = async (): Promise<IDatabase | null> => {
  const exitsFile = await exists(DATABASE_FILE, { dir: BaseDirectory.AppData });
  if (!exitsFile) {
    return null;
  }
  const text = await readTextFile(DATABASE_FILE, { dir: BaseDirectory.AppData });
  return JSON.parse(text);
};

export const updateDatabase = async (key: string, value: any): Promise<IDatabase> => {
  const exitsDir = await exists(DATABASE_ROOT, { dir: BaseDirectory.AppData });
  if (!exitsDir) {
    await createDir(DATABASE_ROOT, { dir: BaseDirectory.AppData, recursive: true });
  }

  const data = (await getAllDatabase() || {});

  let pointer = data as any;
  const keys = key.split('.');

  for (let i = 0; i < keys.length; i++) {
    const currentKey = keys[i];
    if (i === keys.length - 1) {
      pointer[currentKey] = value;
    } else {
      pointer = pointer[currentKey] || {};
    }
  }
  await writeTextFile(DATABASE_FILE, JSON.stringify(data), { dir: BaseDirectory.AppData });
  return data;
};
