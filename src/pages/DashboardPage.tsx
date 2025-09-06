import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Grid, Paper, Box } from '@mui/material';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IEmployee } from '../renderer';

export const DashboardPage: React.FC = () => {
  const [employees, setEmployees] = useState<IEmployee[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        setLoading(true);
        const data = await window.db.getAllEmployees();
        setEmployees(data);
      } catch (error) {
        console.error('Failed to fetch employees:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  const salaryDistribution = useMemo(() => {
    const buckets = {
      '< $50K': 0,
      '$50K - $100K': 0,
      '> $100K': 0,
    };

    employees.forEach((emp) => {
      if (emp.salary < 50000) {
        buckets['< $50K']++;
      } else if (emp.salary >= 50000 && emp.salary <= 100000) {
        buckets['$50K - $100K']++;
      } else {
        buckets['> $100K']++;
      }
    });

    return Object.entries(buckets).map(([name, value]) => ({ name, count: value }));
  }, [employees]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Dashboard
      </Typography>
      <Grid container spacing={3}>
        {/* Total Employees KPI */}
        <Grid item xs={12} md={4} lg={3}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 140,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Total Employees
            </Typography>
            <Typography component="p" variant="h4">
              {employees.length}
            </Typography>
          </Paper>
        </Grid>

        {/* Salary Distribution Chart */}
        <Grid item xs={12} md={8} lg={9}>
          <Paper
            sx={{
              p: 2,
              display: 'flex',
              flexDirection: 'column',
              height: 400,
            }}
          >
            <Typography component="h2" variant="h6" color="primary" gutterBottom>
              Salary Distribution
            </Typography>
            <ResponsiveContainer>
              <BarChart data={salaryDistribution}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="count" fill="#8884d8" />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
};
