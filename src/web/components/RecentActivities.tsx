import React from 'react';
import {
    Box,
    Typography,
    Paper,
    ButtonGroup,
    Button,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableRow,
} from '@mui/material';

interface Activity {
    title: string;
    type: string;
    code: string;
    change: number;
}

const activities: Activity[] = [
    { title: 'title', type: 'tp', code: 'NFR53.495', change: -0.11 },
    { title: 'title', type: 'tp', code: 'NFR15.9', change: -2.1 },
    { title: 'title', type: 'tp', code: 'NFR15.978', change: -2.5 },
    { title: 'title', type: 'tp', code: 'NFR4.955', change: +0.11 },
    { title: 'title', type: 'tp', code: 'NFR287', change: -0.42 },
    { title: 'title', type: 'tp', code: 'NFR0.49', change: -1.1 },
];

const RecentActivities: React.FC = () => {
    const [filter, setFilter] = React.useState('markets');

    return (
        <Paper sx={{ p: 3 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
                <Typography variant="h6">Recent Activities</Typography>
                <ButtonGroup size="small">
                    <Button 
                        variant={filter === 'markets' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('markets')}
                    >
                        Markets
                    </Button>
                    <Button 
                        variant={filter === 'nifty' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('nifty')}
                    >
                        NIFTY
                    </Button>
                    <Button 
                        variant={filter === 'niftyb' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('niftyb')}
                    >
                        NIFTYB
                    </Button>
                    <Button 
                        variant={filter === 'ipo' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('ipo')}
                    >
                        IPO
                    </Button>
                    <Button 
                        variant={filter === 'nit' ? 'contained' : 'outlined'}
                        onClick={() => setFilter('nit')}
                    >
                        NIT
                    </Button>
                </ButtonGroup>
            </Box>

            <TableContainer>
                <Table size="small">
                    <TableBody>
                        {activities.map((activity, index) => (
                            <TableRow 
                                key={index}
                                sx={{ '&:last-child td, &:last-child th': { border: 0 } }}
                            >
                                <TableCell sx={{ width: '30%' }}>
                                    <Typography variant="body2">{activity.title}</Typography>
                                    <Typography variant="caption" color="text.secondary">{activity.type}</Typography>
                                </TableCell>
                                <TableCell>
                                    <Typography variant="body2">{activity.code}</Typography>
                                </TableCell>
                                <TableCell align="right">
                                    <Typography 
                                        variant="body2" 
                                        sx={{ 
                                            color: activity.change >= 0 ? 'success.main' : 'error.main',
                                            fontWeight: 500
                                        }}
                                    >
                                        {activity.change >= 0 ? '+' : ''}{activity.change}%
                                    </Typography>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Box sx={{ mt: 2, textAlign: 'center' }}>
                <Button color="primary" size="small">
                    View All
                </Button>
            </Box>
        </Paper>
    );
};

export default RecentActivities;
