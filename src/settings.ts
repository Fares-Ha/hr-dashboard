import { app } from 'electron';
import path from 'path';
import fs from 'fs';

const userDataPath = app.getPath('userData');
const settingsFilePath = path.join(userDataPath, 'settings.json');

interface ISettings {
  theme: 'light' | 'dark';
  logoPath: string | null;
}

const defaultSettings: ISettings = {
  theme: 'light',
  logoPath: null,
};

/**
 * Reads the settings from the JSON file.
 * If the file doesn't exist, it creates it with default settings.
 * @returns The settings object.
 */
export const getSettings = (): ISettings => {
  try {
    if (fs.existsSync(settingsFilePath)) {
      const fileContent = fs.readFileSync(settingsFilePath, 'utf-8');
      return JSON.parse(fileContent);
    } else {
      fs.writeFileSync(settingsFilePath, JSON.stringify(defaultSettings, null, 2));
      return defaultSettings;
    }
  } catch (error) {
    console.error('Error reading settings file:', error);
    // Return defaults in case of a corrupted file
    return defaultSettings;
  }
};

/**
 * Writes the given settings object to the JSON file.
 * @param settings - The settings to save.
 */
export const setSettings = (settings: ISettings) => {
  try {
    fs.writeFileSync(settingsFilePath, JSON.stringify(settings, null, 2));
  } catch (error) {
    console.error('Error writing settings file:', error);
  }
};
