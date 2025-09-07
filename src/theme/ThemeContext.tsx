import React, { createContext, useState, useMemo, useEffect, useContext } from 'react';
import { createTheme, ThemeProvider as MuiThemeProvider } from '@mui/material/styles';
import { PaletteMode } from '@mui/material';

import { ISettings } from '../renderer';

// Define the shape of the context
interface IThemeContext {
  toggleTheme: () => void;
  mode: PaletteMode;
  logo: string | null;
  setLogo: (path: string | null) => void;
}

// Create the context with a default value
export const ThemeContext = createContext<IThemeContext>({
  toggleTheme: () => {},
  mode: 'light',
  logo: null,
  setLogo: () => {},
});

// Custom hook to use the theme context
export const useThemeContext = () => useContext(ThemeContext);

// Create the provider component
export const AppThemeProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [mode, setMode] = useState<PaletteMode>('light');
  const [logo, setLogo] = useState<string | null>(null);

  // Load saved settings on initial load
  useEffect(() => {
    const loadSettings = async () => {
      const settings = await window.settings.get();
      setMode(settings.theme || 'light');
      setLogo(settings.logoPath || null);
    };
    loadSettings();
  }, []);

  const handleSetLogo = async (path: string | null) => {
    setLogo(path);
    const currentSettings = await window.settings.get();
    await window.settings.set({ ...currentSettings, logoPath: path });
  };

  const themeContextValue = useMemo(
    () => ({
      toggleTheme: async () => {
        const newMode = mode === 'light' ? 'dark' : 'light';
        setMode(newMode);
        // Save the new theme to settings
        const currentSettings = await window.settings.get();
        await window.settings.set({ ...currentSettings, theme: newMode });
      },
      mode,
      logo,
      setLogo: handleSetLogo,
    }),
    [mode, logo]
  );

  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
        },
      }),
    [mode]
  );

  return (
    <ThemeContext.Provider value={themeContextValue}>
      <MuiThemeProvider theme={theme}>{children}</MuiThemeProvider>
    </ThemeContext.Provider>
  );
};
