import { contextBridge, ipcRenderer } from 'electron';

// Expose a secure API for database operations
contextBridge.exposeInMainWorld('db', {
  getAllEmployees: () => ipcRenderer.invoke('db:get-all-employees'),
  addEmployee: (employee: any) => ipcRenderer.invoke('db:add-employee', employee),
  updateEmployee: (id: number, employee: any) => ipcRenderer.invoke('db:update-employee', id, employee),
  deleteEmployee: (id: number) => ipcRenderer.invoke('db:delete-employee', id),
});

// Expose a secure API for settings management
contextBridge.exposeInMainWorld('settings', {
  get: () => ipcRenderer.invoke('settings:get'),
  set: (settings: any) => ipcRenderer.invoke('settings:set', settings),
});

// Expose a secure API for dialogs
contextBridge.exposeInMainWorld('dialog', {
  openImage: () => ipcRenderer.invoke('dialog:open-image'),
});
