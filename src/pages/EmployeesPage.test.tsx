import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import '@testing-library/jest-dom';
import { EmployeesPage } from './EmployeesPage';

// Mock the electron window.db object
Object.defineProperty(window, 'db', {
  writable: true,
  value: {
    getAllEmployees: jest.fn().mockResolvedValue([
      { id: 1, firstName: 'John', lastName: 'Doe', dob: '1990-01-01', salary: 50000 },
    ]),
    deleteEmployee: jest.fn().mockResolvedValue(undefined),
    addEmployee: jest.fn().mockResolvedValue(undefined),
    updateEmployee: jest.fn().mockResolvedValue(undefined),
  },
});

describe('EmployeesPage', () => {
  it('should call deleteEmployee when the delete action is confirmed', async () => {
    // Mock the getAllEmployees function to return a single employee
    window.db.getAllEmployees = jest.fn().mockResolvedValue([
      { id: 1, firstName: 'John', lastName: 'Doe', dob: '1990-01-01', salary: 50000 },
    ]);
    window.db.deleteEmployee = jest.fn().mockResolvedValue(undefined);

    const { container } = render(<EmployeesPage />);

    // Wait for the component to finish loading data
    await waitFor(() => expect(window.db.getAllEmployees).toHaveBeenCalled());

    // Find the delete button by its aria-label and click it.
    const deleteButton = await screen.findByLabelText('delete');
    fireEvent.click(deleteButton);

    // Now the confirmation dialog should be open. Find the confirm button and click it.
    const confirmButton = await screen.findByRole('button', { name: /confirm/i });
    fireEvent.click(confirmButton);

    expect(window.db.deleteEmployee).toHaveBeenCalledWith(1);
  });
});
