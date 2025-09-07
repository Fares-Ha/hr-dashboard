import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack } from '@mui/material';
import { IEmployee } from '../types/employee';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: IEmployee) => void;
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

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState('');
  const [salary, setSalary] = useState('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    const newEmployee: IEmployee = {
      firstName,
      lastName,
      dob,
      salary: parseFloat(salary) || 0,
    };
    onAdd(newEmployee);
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Add New Employee
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Stack spacing={2}>
            <TextField
              required
              fullWidth
              label="First Name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Last Name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
            <TextField
              required
              fullWidth
              label="Date of Birth"
              type="date"
              InputLabelProps={{ shrink: true }}
              value={dob}
              onChange={(e) => setDob(e.target.value)}
            />
            <TextField
              fullWidth
              label="Salary"
              type="number"
              value={salary}
              onChange={(e) => setSalary(e.target.value)}
            />
            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
              Add Employee
            </Button>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
