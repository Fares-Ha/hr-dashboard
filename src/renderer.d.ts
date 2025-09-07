// This file declares the APIs that are exposed from the preload script
// to the renderer process.
import { IEmployee } from './types/employee';

export interface ISettings {
  theme: 'light' | 'dark';
  logoPath: string | null;
}

// Extend the global Window interface
declare global {
  interface Window {
    db: {
      getAllEmployees: () => Promise<IEmployee[]>;
      addEmployee: (employee: IEmployee) => Promise<void>;
      updateEmployee: (id: number, employee: IEmployee) => Promise<void>;
      deleteEmployee: (id: number) => Promise<void>;
    };
    settings: {
      get: () => Promise<ISettings>;
      set: (settings: ISettings) => Promise<void>;
    };
    dialog: {
      openImage: () => Promise<string | null>;
    };
  }
}
