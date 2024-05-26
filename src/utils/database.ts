import { exists, readTextFile, BaseDirectory, writeTextFile } from '@tauri-apps/api/fs';

const DATABASE_ROOT = 'databases';
const DATABASE_FILE = `${DATABASE_ROOT}/v1.txt`;

export interface DatabaseData {
  token?: {
    github?: string;
  };
}

class Database {
  private _data?: DatabaseData;

  private async _load() {
    const exitsFile = await exists(DATABASE_FILE, { dir: BaseDirectory.AppData });
    if (!exitsFile) {
      return {};
    }
    const text = await readTextFile(DATABASE_FILE, { dir: BaseDirectory.AppData });
    return JSON.parse(text) as DatabaseData;
  }

  private async _getData() {
    if (this._data !== undefined) {
      return this._data;
    }
    const data = await this._load();
    this._data = data;
    return data;
  }

  async getFieldValue<T>(key: string) {
    const data = await this._getData();

    let pointer = data as any;
    const keys = key.split('.');

    for (let i = 0; i < keys.length; i++) {
      const currentKey = keys[i];
      pointer = pointer[currentKey] || {};
    }
    return pointer as T | undefined;
  }

  async updateFieldValue(key: string, value: any) {
    const data = await this._load();

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
  }
}

export const database = new Database();
