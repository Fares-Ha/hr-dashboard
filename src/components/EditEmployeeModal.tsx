import React, { useState, useEffect } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IEmployee } from '../renderer';

interface EditEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onUpdate: (employee: IEmployee) => void;
  employee: IEmployee | null;
}

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

export const EditEmployeeModal: React.FC<EditEmployeeModalProps> = ({ open, onClose, onUpdate, employee }) => {
  const [formData, setFormData] = useState<IEmployee | null>(null);

  useEffect(() => {
    // When the employee prop changes, update the form data
    setFormData(employee);
  }, [employee]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (formData) {
      setFormData({ ...formData, [event.target.name]: event.target.value });
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    if (formData) {
      onUpdate(formData);
    }
  };

  if (!formData) return null;

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Edit Employee
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="First Name"
              name="firstName"
              value={formData.firstName}
              onChange={handleChange}
            />
            <TextField
              required
              fullWidth
              label="Last Name"
              name="lastName"
              value={formData.lastName}
              onChange={handleChange}
            />
            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DatePicker
                label="Date of Birth"
                value={new Date(formData.dob)}
                onChange={(newValue) => {
                  if (newValue && formData) {
                    setFormData({
                      ...formData,
                      dob: newValue.toISOString().split('T')[0]
                    });
                  }
                }}
                sx={{ width: '100%' }}
              />
            </LocalizationProvider>
            <TextField
              fullWidth
              label="Salary"
              name="salary"
              type="number"
              value={formData.salary || ''}
              onChange={handleChange}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Update Employee
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
