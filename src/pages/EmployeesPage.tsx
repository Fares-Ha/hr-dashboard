import React, { useState, useEffect, useMemo } from 'react';
import { Box, Typography, Button, IconButton, TextField, Tooltip } from '@mui/material';
import {
  DataGrid,
  GridColDef,
  GridRenderCellParams,
  GridToolbar,
  GridFilterModel,
  GridFilterOperator
} from '@mui/x-data-grid';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import { AddEmployeeModal } from '../components/AddEmployeeModal';
import { EditEmployeeModal } from '../components/EditEmployeeModal';
import { ConfirmationDialog } from '../components/ConfirmationDialog';
import { DocumentPreviewModal } from '../components/DocumentPreviewModal';
import { IEmployee } from '../renderer';

const formatDate = (dateStr: string) => {
  if (!dateStr) return '';
  try {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return 'Invalid Date';
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    }).format(date);
  } catch {
    return 'Invalid Date';
  }
};

const columns: GridColDef[] = [
  { field: 'id', headerName: 'ID', width: 90 },
  { field: 'firstName', headerName: 'First Name', width: 150, editable: true },
  { field: 'lastName', headerName: 'Last Name', width: 150, editable: true },
  {
    field: 'dob',
    headerName: 'Date of Birth',
    width: 120,
    valueFormatter: (params: { value: string }) => formatDate(params.value),
  },
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
  const [previewDoc, setPreviewDoc] = useState<{ path: string; title: string } | null>(null);

  const columns: GridColDef[] = [
    { field: 'id', headerName: 'ID', width: 90 },
    {
      field: 'firstName',
      headerName: 'First Name',
      width: 150,
      editable: true,
      filterable: true,
    },
    {
      field: 'lastName',
      headerName: 'Last Name',
      width: 150,
      editable: true,
      filterable: true,
    },
    {
      field: 'dob',
      headerName: 'Date of Birth',
      width: 120,
      valueFormatter: (params: { value: string }) => formatDate(params.value),
    },
    {
      field: 'emiratesId',
      headerName: 'Emirates ID',
      width: 150,
      editable: true,
      filterable: true,
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem) => {
            return (params) => {
              return params.value?.toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: 'passportNumber',
      headerName: 'Passport Number',
      width: 150,
      editable: true,
      filterable: true,
      filterOperators: [
        {
          label: 'Contains',
          value: 'contains',
          getApplyFilterFn: (filterItem) => {
            return (params) => {
              return params.value?.toLowerCase().includes(filterItem.value.toLowerCase());
            };
          },
        },
      ],
    },
    {
      field: 'salary',
      headerName: 'Salary',
      type: 'number',
      width: 110,
      editable: true,
      valueFormatter: (params: { value: number | null }) => {
        if (params.value == null) return '';
        return `$${params.value.toLocaleString()}`;
      },
    },
    {
      field: 'documents',
      headerName: 'Documents',
      width: 250,
      sortable: false,
      renderCell: (params: GridRenderCellParams) => (
        <Box sx={{ display: 'flex', gap: 1 }}>
          {params.row.emiratesIdFrontPath && (
            <Tooltip title="Click to preview Emirates ID Front">
              <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={params.row.emiratesIdFrontPath}
                  alt="Emirates ID Front"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  onClick={() => setPreviewDoc({ path: params.row.emiratesIdFrontPath, title: 'Emirates ID Front' })}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', right: -8, top: -8, bgcolor: 'background.paper', padding: '2px' }}
                  onClick={() => setPreviewDoc({ path: params.row.emiratesIdFrontPath, title: 'Emirates ID Front' })}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {params.row.emiratesIdBackPath && (
            <Tooltip title="Click to preview Emirates ID Back">
              <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={params.row.emiratesIdBackPath}
                  alt="Emirates ID Back"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  onClick={() => setPreviewDoc({ path: params.row.emiratesIdBackPath, title: 'Emirates ID Back' })}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', right: -8, top: -8, bgcolor: 'background.paper', padding: '2px' }}
                  onClick={() => setPreviewDoc({ path: params.row.emiratesIdBackPath, title: 'Emirates ID Back' })}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
          {params.row.passportImgPath && (
            <Tooltip title="Click to preview Passport">
              <Box sx={{ position: 'relative', cursor: 'pointer' }}>
                <img
                  src={params.row.passportImgPath}
                  alt="Passport"
                  style={{ width: 40, height: 40, objectFit: 'cover', borderRadius: 4 }}
                  onClick={() => setPreviewDoc({ path: params.row.passportImgPath, title: 'Passport' })}
                />
                <IconButton
                  size="small"
                  sx={{ position: 'absolute', right: -8, top: -8, bgcolor: 'background.paper', padding: '2px' }}
                  onClick={() => setPreviewDoc({ path: params.row.passportImgPath, title: 'Passport' })}
                >
                  <ZoomInIcon fontSize="small" />
                </IconButton>
              </Box>
            </Tooltip>
          )}
        </Box>
      ),
      filterable: false,
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
          <IconButton onClick={() => handleDeleteClick(params.row as IEmployee)}>
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
      setLoading(true);
      // Optimistic update
      setEmployees(prev => [...prev, { ...employee, id: Date.now() }]);

      await window.db.addEmployee(employee);
      setIsAddModalOpen(false);
      await fetchEmployees(); // Refresh to get the real ID from database
    } catch (error) {
      console.error('Failed to add employee:', error);
      // Revert optimistic update on error
      await fetchEmployees();
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsEditModalOpen(true);
  };

  const handleUpdateEmployee = async (employee: IEmployee) => {
    if (!employee.id) return;
    try {
      setLoading(true);
      // Optimistic update
      setEmployees(prev =>
        prev.map(emp => emp.id === employee.id ? employee : emp)
      );

      await window.db.updateEmployee(employee.id, employee);
      setIsEditModalOpen(false);
      await fetchEmployees(); // Refresh to ensure consistency
    } catch (error) {
      console.error('Failed to update employee:', error);
      // Revert optimistic update on error
      await fetchEmployees();
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (employee: IEmployee) => {
    setSelectedEmployee(employee);
    setIsConfirmOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (selectedEmployee && selectedEmployee.id) {
      try {
        setLoading(true);
        // Optimistic update
        setEmployees(prev => prev.filter(emp => emp.id !== selectedEmployee.id));

        await window.db.deleteEmployee(selectedEmployee.id);
        setIsConfirmOpen(false);
        setSelectedEmployee(null);
        await fetchEmployees(); // Refresh to ensure consistency
      } catch (error) {
        console.error('Failed to delete employee:', error);
        // Revert optimistic update on error
        await fetchEmployees();
      } finally {
        setLoading(false);
        setIsConfirmOpen(false);
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
        employee={selectedEmployee}
      />
      <ConfirmationDialog
        open={isConfirmOpen}
        onClose={() => setIsConfirmOpen(false)}
        onConfirm={handleConfirmDelete}
        title="Delete Employee"
        content="Are you sure you want to delete this employee? This action cannot be undone."
      />
      {previewDoc && (
        <DocumentPreviewModal
          open={Boolean(previewDoc)}
          onClose={() => setPreviewDoc(null)}
          imagePath={previewDoc.path}
          title={previewDoc.title}
        />
      )}
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
