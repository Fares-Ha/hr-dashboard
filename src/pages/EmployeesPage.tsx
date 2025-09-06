import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, IconButton, TextField } from '@mui/material';
import { DataGrid, GridColDef, GridRenderCellParams, GridToolbar } from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { IEmployee } from '../renderer';

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
  { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
  { field: 'dob', headerName: 'Date of Birth', width: 120 },
  {
    field: 'salary',
    headerName: 'Salary',
    type: 'number',
    width: 110,
    editable: true,
  },
  // We will add columns for actions (edit/delete) and image thumbnails later
];

export const EmployeesPage: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const [selectedEmployee, setSelectedEmployee] = useState<IEmployee | null>(null);
  const [searchText, setSearchText] = useState('');

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
    { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
    { field: 'dob', headerName: 'Date of Birth', width: 120 },
    {
      field: 'salary',
      headerName: 'Salary',
      type: 'number',
      width: 110,
      editable: true,
    },
    {
      field: 'actions',
      headerName: 'Actions',
      sortable: false,
      width: 100,
      renderCell: (params: GridRenderCellParams) => (
        <>
          <IconButton onClick={() => handleEditClick(params.row as IEmployee)}>
            <EditIcon />
          </IconButton>
          <IconButton onClick={() => handleDeleteClick(params.row.id)}>
            <DeleteIcon />
          </IconButton>
        </>
      ),
    },
  ];

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      // The 'db' object is exposed by our preload script
      const data = await window.db.getAllEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Failed to fetch employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const handleAddEmployee = async (employee: IEmployee) => {
    try {
      await window.db.addEmployee(employee);
      setIsModalOpen(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Failed to add employee:', error);
    }
  };

  const handleEditClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (employee: IEmployee) => {
    if (!employee.id) return;
    try {
      await window.db.updateEmployee(employee.id, employee);
      setIsEditModalOpen(false);
      fetchEmployees(); // Refresh the list
    } catch (error) {
      console.error('Failed to update employee:', error);
    }
  };

  const handleDeleteClick = (id: number) => {
    setSelectedEmployee({ id } as IEmployee); // Only need id for delete
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee && selectedEmployee.id) {
      try {
        await window.db.deleteEmployee(selectedEmployee.id);
        fetchEmployees(); // Refresh the list
      } catch (error) {
        console.error('Failed to delete employee:', error);
      } finally {
        setIsConfirmOpen(false);
        setSelectedEmployeeId(null);
      }
    }
  };

  const filteredEmployees = useMemo(() => {
    if (!searchText) return employees;
    return employees.filter((emp) =>
      Object.values(emp).some((value) =>
        String(value).toLowerCase().includes(searchText.toLowerCase())
      )
    );
  }, [employees, searchText]);

  return (
    <Box sx={{ height: 'calc(100vh - 128px)', width: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h4">Employees</Typography>
        <Box>
          <TextField
            variant="outlined"
            size="small"
            placeholder="Search..."
            value={searchText}
            onChange={(e) => setSearchText(e.target.value)}
            sx={{ mr: 2 }}
          />
          <Button variant="contained" onClick={() => setIsAddModalOpen(true)}>
            Add Employee
          </Button>
        </Box>
      </Box>
      <AddEmployeeModal
        open={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddEmployee}
      />
      <EditEmployeeModal
        open={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateEmployee}
        employee={selectedEmployee}
      />
      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        message="Are you sure you want to delete this employee? This action cannot be undone."
      />
      <DataGrid
        rows={filteredEmployees}
        columns={columns}
        loading={loading}
        initialState={{
          pagination: {
            paginationModel: {
              pageSize: 10,
            },
          },
        }}
        pageSizeOptions={[5, 10, 20]}
        checkboxSelection
        disableRowSelectionOnClick
        slots={{
          toolbar: GridToolbar,
        }}
      />
    </Box>
  );
};
