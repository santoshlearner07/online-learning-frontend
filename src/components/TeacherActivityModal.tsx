import { Dialog, DialogContent, AppBar, Toolbar, IconButton, Slide, Typography, Grid, Paper, Divider, Chip, Table, TableBody, TableRow, TableCell } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/useAuthStore';
import axios from 'axios';
import { baseURL } from '../routes/AppRoutes';
import type { TransitionProps } from '@mui/material/transitions';

const SlideTransition = React.forwardRef(function Transition(
    props: TransitionProps & { children: React.ReactElement<any, any> },
    ref: React.Ref<unknown>,
) {
    return <Slide direction="up" ref={ref} {...props} />;
});

export const TeacherActivityModal = ({ teacherId, open, onClose }: any) => {
    const [activity, setActivity] = useState<any>(null);
    const { token } = useAuthStore();

    useEffect(() => {
        if (open && teacherId) {
            axios.get(`${baseURL}/admin/teacher-activity/${teacherId}`, {
                headers: { Authorization: `Bearer ${token}` }
            }).then(res => setActivity(res.data));
        }
    }, [open, teacherId]);

    if (!activity) return null;

    return (
        <Dialog fullScreen open={open} onClose={onClose} TransitionComponent={SlideTransition}>
            <AppBar sx={{ position: 'relative', bgcolor: '#2c3e50' }}>
                <Toolbar>
                    <Typography sx={{ ml: 2, flex: 1 }} variant="h6">
                        Activity Log: {activity.profile.firstName}
                    </Typography>
                    <IconButton edge="start" color="inherit" onClick={onClose}><CloseIcon /></IconButton>
                </Toolbar>
            </AppBar>
            <DialogContent>
                <Grid container spacing={4}>
                    <Grid size={{xs:12,md:4}}>
                        <Paper sx={{ p: 3, bgcolor: '#f8f9fa' }}>
                            <Typography variant="h6">Summary</Typography>
                            <Divider sx={{ my: 2 }} />
                            <Typography><b>Regular Students:</b> {activity.students.length}</Typography>
                            <Typography><b>Future Demos:</b> {activity.futureDemos.length}</Typography>
                            <Typography><b>Total Classes Conducted:</b> {activity.allClasses.filter((c:any) => new Date(c.endTime) < new Date()).length}</Typography>
                        </Paper>
                    </Grid>

                    <Grid size={{ xs: 12, md: 8 }}>
                        <Typography variant="h6">Upcoming Demos</Typography>
                        {activity.futureDemos.map((d: any) => (
                            <Chip key={d._id} label={`${d.firstName} - ${new Date(d.demoSlot).toLocaleString()}`} sx={{ m: 0.5 }} color="primary" />
                        ))}

                        <Typography variant="h6" sx={{ mt: 4 }}>Recent Class History</Typography>
                        <Table>
                            <TableBody>
                                {activity.allClasses.slice(0, 10).map((cls: any) => (
                                    <TableRow key={cls._id}>
                                        <TableCell>{new Date(cls.startTime).toLocaleDateString()}</TableCell>
                                        <TableCell>{cls.studentId?.firstName}</TableCell>
                                        <TableCell>{cls.subject}</TableCell>
                                        <TableCell>
                                            <Chip size="small" label={new Date(cls.startTime) > new Date() ? "UPCOMING" : "COMPLETED"} />
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </Grid>
                </Grid>
            </DialogContent>
        </Dialog>
    );
};