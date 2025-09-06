import React from 'react';
import { Typography, Box, Paper, FormGroup, FormControlLabel, Switch, Button, Stack } from '@mui/material';
import { useThemeContext } from '../theme/ThemeContext';

export const SettingsPage: React.FC = () => {
  const { mode, toggleTheme, setLogo, logo } = useThemeContext();

  const handleLogoUpload = async () => {
    const filePath = await window.dialog.openImage();
    if (filePath) {
      // The context will handle saving the setting
      setLogo(filePath);
    }
  };

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Settings
      </Typography>
      <Paper sx={{ p: 2 }}>
        <FormGroup>
          <FormControlLabel
            control={<Switch checked={mode === 'dark'} onChange={toggleTheme} />}
            label="Dark Mode"
          />
        </FormGroup>
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6" gutterBottom>
            Custom Logo
          </Typography>
          {logo && <img src={logo} alt="Custom Logo" style={{ maxWidth: '200px', maxHeight: '50px', marginBottom: '1rem' }} />}
          <Stack direction="row" spacing={2}>
            <Button variant="contained" onClick={handleLogoUpload}>
              Upload Logo
            </Button>
            {logo && (
              <Button variant="outlined" onClick={() => setLogo(null)}>
                Clear Logo
              </Button>
            )}
          </Stack>
        </Box>
      </Paper>
    </Box>
  );
};
