import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button, Stack, IconButton } from '@mui/material';
import { Grid } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import ClearIcon from '@mui/icons-material/Clear';
import { styled } from '@mui/material/styles';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';
import { IEmployee } from '../renderer';

interface AddEmployeeModalProps {
  open: boolean;
  onClose: () => void;
  onAdd: (employee: IEmployee) => void;
}

const ImageUploadButton = styled(Button)(({ theme }) => ({
  width: '100%',
  padding: theme.spacing(2),
  border: `2px dashed ${theme.palette.divider}`,
  '&:hover': {
    border: `2px dashed ${theme.palette.primary.main}`,
  },
}));

const PreviewImage = styled('img')({
  width: '100%',
  height: 'auto',
  maxHeight: '200px',
  objectFit: 'contain',
  marginTop: '8px',
});

const style = {
  position: 'absolute' as 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: '90%',
  maxWidth: '800px',
  maxHeight: '90vh',
  overflow: 'auto',
  bgcolor: 'background.paper',
  borderRadius: '8px',
  boxShadow: 24,
  p: 4,
};

export const AddEmployeeModal: React.FC<AddEmployeeModalProps> = ({ open, onClose, onAdd }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [dob, setDob] = useState<Date | null>(null);
  const [emiratesId, setEmiratesId] = useState('');
  const [passportNumber, setPassportNumber] = useState('');
  const [salary, setSalary] = useState('');
  const [emiratesIdFront, setEmiratesIdFront] = useState('');
  const [emiratesIdBack, setEmiratesIdBack] = useState('');
  const [passportImg, setPassportImg] = useState('');

  const handleImageUpload = async (type: 'emiratesFront' | 'emiratesBack' | 'passport') => {
    try {
      const filePath = await window.dialog.openImage();
      if (filePath) {
        switch (type) {
          case 'emiratesFront':
            setEmiratesIdFront(filePath);
            break;
          case 'emiratesBack':
            setEmiratesIdBack(filePath);
            break;
          case 'passport':
            setPassportImg(filePath);
            break;
        }
      }
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    // First check if we have a valid date
    if (!dob || isNaN(dob.getTime())) {
      alert('Please select a valid date of birth');
      return;
    }

    // Then check other required fields
    if (!firstName || !lastName || !emiratesId || !passportNumber) {
      alert('Please fill in all required fields');
      return;
    }

    // Format the date as YYYY-MM-DD
    const formattedDate = dob.toISOString().slice(0, 10);
    console.log('Formatted date:', formattedDate); // Debug log

    const newEmployee: IEmployee = {
      firstName,
      lastName,
      dob: formattedDate,  // This should be in YYYY-MM-DD format
      emiratesId,
      passportNumber,
      salary: parseFloat(salary) || 0,
      emiratesIdFrontPath: emiratesIdFront,
      emiratesIdBackPath: emiratesIdBack,
      passportImgPath: passportImg,
    };
    onAdd(newEmployee);
    // Reset form
    setFirstName('');
    setLastName('');
    setDob(null);
    setEmiratesId('');
    setPassportNumber('');
    setSalary('');
    setEmiratesIdFront('');
    setEmiratesIdBack('');
    setPassportImg('');
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={style}>
        <Typography variant="h6" component="h2">
          Add New Employee
        </Typography>
        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
          <Stack spacing={3}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="First Name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Last Name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <LocalizationProvider dateAdapter={AdapterDateFns}>
                  <DatePicker
                    label="Date of Birth"
                    value={dob}
                    onChange={(newValue) => {
                      if (newValue && !isNaN(newValue.getTime())) {
                        setDob(newValue);
                      }
                    }}
                    sx={{ width: '100%' }}
                    required
                    slotProps={{
                      textField: {
                        required: true,
                        error: !dob,
                        fullWidth: true,
                        helperText: !dob ? 'Date of birth is required' : ''
                      }
                    }}
                    format="yyyy-MM-dd"
                  />
                </LocalizationProvider>
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Emirates ID"
                  value={emiratesId}
                  onChange={(e) => setEmiratesId(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Passport Number"
                  value={passportNumber}
                  onChange={(e) => setPassportNumber(e.target.value)}
                  fullWidth
                  required
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  label="Salary"
                  value={salary}
                  onChange={(e) => setSalary(e.target.value)}
                  type="number"
                  fullWidth
                />
              </Grid>
            </Grid>

            <Typography variant="h6" sx={{ mt: 2 }}>Documents</Typography>

            <Grid container spacing={2}>
              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Emirates ID (Front)</Typography>
                <ImageUploadButton
                  onClick={() => handleImageUpload('emiratesFront')}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Front
                </ImageUploadButton>
                {emiratesIdFront && (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <PreviewImage src={emiratesIdFront} alt="Emirates ID Front" />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                      onClick={() => setEmiratesIdFront('')}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Emirates ID (Back)</Typography>
                <ImageUploadButton
                  onClick={() => handleImageUpload('emiratesBack')}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Back
                </ImageUploadButton>
                {emiratesIdBack && (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <PreviewImage src={emiratesIdBack} alt="Emirates ID Back" />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                      onClick={() => setEmiratesIdBack('')}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>

              <Grid item xs={12} md={4}>
                <Typography variant="subtitle2" gutterBottom>Passport</Typography>
                <ImageUploadButton
                  onClick={() => handleImageUpload('passport')}
                  startIcon={<CloudUploadIcon />}
                >
                  Upload Passport
                </ImageUploadButton>
                {passportImg && (
                  <Box sx={{ position: 'relative', mt: 1 }}>
                    <PreviewImage src={passportImg} alt="Passport" />
                    <IconButton
                      size="small"
                      sx={{ position: 'absolute', top: 0, right: 0, bgcolor: 'background.paper' }}
                      onClick={() => setPassportImg('')}
                    >
                      <ClearIcon />
                    </IconButton>
                  </Box>
                )}
              </Grid>
            </Grid>

            <Box sx={{ display: 'flex', gap: 2, justifyContent: 'flex-end', mt: 2 }}>
              <Button onClick={onClose}>Cancel</Button>
              <Button type="submit" variant="contained">
                Add Employee
              </Button>
            </Box>
          </Stack>
        </Box>
      </Box>
    </Modal>
  );
};
