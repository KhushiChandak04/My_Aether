import React from 'react';
import {
    Box,
    Typography,
    Paper,
    IconButton,
} from '@mui/material';
import { ChevronLeft, ChevronRight } from '@mui/icons-material';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

interface Investment {
    name: string;
    value: number;
    color: string;
}

const data: Investment[] = [
    { name: 'Stock name', value: 35, color: '#F59E0B' },
    { name: 'Stock name', value: 25, color: '#EC4899' },
    { name: 'Stock name', value: 40, color: '#3B82F6' },
];

const months = ['January', 'February', 'March', 'April', 'May', 'June', 
                'July', 'August', 'September', 'October', 'November', 'December'];

const Investments: React.FC = () => {
    const [currentDate, setCurrentDate] = React.useState(new Date());
    
    const currentMonthDisplay = `${months[currentDate.getMonth()]} ${currentDate.getFullYear()}`;

    const handlePrevMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() - 1);
            return newDate;
        });
    };

    const handleNextMonth = () => {
        setCurrentDate(prev => {
            const newDate = new Date(prev);
            newDate.setMonth(newDate.getMonth() + 1);
            return newDate;
        });
    };

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                mb: 3
            }}>
                <Typography variant="h6">Investments</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <IconButton size="small" onClick={handlePrevMonth}>
                        <ChevronLeft />
                    </IconButton>
                    <Typography variant="body2">{currentMonthDisplay}</Typography>
                    <IconButton size="small" onClick={handleNextMonth}>
                        <ChevronRight />
                    </IconButton>
                </Box>
            </Box>

            <Box sx={{ 
                height: 300,
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                position: 'relative'
            }}>
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={data}
                            innerRadius={60}
                            outerRadius={80}
                            paddingAngle={5}
                            dataKey="value"
                        >
                            {data.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>
                
                <Box sx={{ 
                    position: 'absolute',
                    top: '50%',
                    left: '50%',
                    transform: 'translate(-50%, -50%)',
                    textAlign: 'center'
                }}>
                    <Typography variant="h4">45623</Typography>
                </Box>
            </Box>

            <Box sx={{ mt: 2 }}>
                {data.map((item, index) => (
                    <Box 
                        key={index}
                        sx={{ 
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            mb: 1
                        }}
                    >
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                            <Box 
                                sx={{ 
                                    width: 12,
                                    height: 12,
                                    borderRadius: '50%',
                                    bgcolor: item.color
                                }}
                            />
                            <Typography variant="body2">{item.name}</Typography>
                        </Box>
                        <Typography 
                            variant="body2" 
                            sx={{ color: 'success.main' }}
                        >
                            +{item.value}%
                        </Typography>
                    </Box>
                ))}
            </Box>
        </Paper>
    );
};

export default Investments;
