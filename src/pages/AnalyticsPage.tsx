import React, { useState, useEffect, useMemo } from 'react';
import { Typography, Paper, Box } from '@mui/material';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { IEmployee } from '../renderer';

export const AnalyticsPage: React.FC = () => {
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

  const hiringTrends = useMemo(() => {
    const hiresByMonth: { [key: string]: number } = {};

    employees.forEach((emp) => {
      const date = new Date(emp.createdAt);
      const month = date.toLocaleString('default', { month: 'short', year: '2-digit' });

      if (hiresByMonth[month]) {
        hiresByMonth[month]++;
      } else {
        hiresByMonth[month] = 1;
      }
    });

    // We need to sort the data by date for the line chart to make sense
    const sortedMonths = Object.keys(hiresByMonth).sort((a, b) => {
      const dateA = new Date(`01 ${a}`);
      const dateB = new Date(`01 ${b}`);
      return dateA.getTime() - dateB.getTime();
    });

    return sortedMonths.map(month => ({ name: month, hires: hiresByMonth[month] }));
  }, [employees]);

  if (loading) {
    return <Typography>Loading...</Typography>;
  }

  return (
    <Box>
      <Typography variant="h4" gutterBottom>
        Analytics
      </Typography>
      <Paper sx={{ p: 2, display: 'flex', flexDirection: 'column', height: 500 }}>
        <Typography component="h2" variant="h6" color="primary" gutterBottom>
          Hiring Trends by Month
        </Typography>
        <ResponsiveContainer>
          <LineChart data={hiringTrends}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis allowDecimals={false} />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="hires" stroke="#82ca9d" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>
    </Box>
  );
};
