import React, { useState, useEffect } from 'react';

// components import
import Create from '../components/Create';
import { ToastContainer } from 'react-toastify';
import BigCalendar from '../components/calendar';
import Update from '../components/Update';
import { UserIcon } from '@heroicons/react/16/solid';

// utils and hooks import
import api from '../service/api';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { useQuery } from 'react-query';
import ProfileMenu from '../components/ProfileMenu';

// define fetchTasks function
const fetchTasks = async () => {
    const { data } = await api.get('/tasks');
    return data;
};

/**
 * @description Dashboard page component
 * @returns {React.FC}
 */
const Dashboard: React.FC = () => {
    // define state for dialog 
    const [isDialogCreateOpen, setIsDialogCreateOpen] = useState(false);
    const [isDialogUpdateOpen, setIsDialogUpdateOpen] = useState(false);

    // define state for selected task
    const [selectedTask, setSelectedTask] = useState<{ id: string, start: string, description: string, email: string } | null>(null);

    // define state for events
    const [events, setEvents] = useState<any[]>([]);

    const handleOpenCreateDialog = () => {
        setIsDialogCreateOpen(true);
    };

    const handleCloseCreateDialog = () => {
        setIsDialogCreateOpen(false);
    };

    const handleOpenUpdateDialog = (event: { _id: string, start: string, description: string, email: string }) => {
        setSelectedTask({
            id: event._id,
            start: event.start,
            description: event.description,
            email: event.email,
        });
        setIsDialogUpdateOpen(true);
    }

    const handleCloseUpdateDialog = () => {
        setIsDialogUpdateOpen(false);
    }

    // Use React Query to fetch tasks
    const { data: tasks, isLoading, error } = useQuery(['tasks'], fetchTasks, {
        retry: 1,
    });

    // Transform tasks into events for the calendar
    useEffect(() => {
        if (tasks) {
            const formattedEvents = tasks.map((task: { _id: number; email: string; date: string, description: string }) => ({
                _id: task._id,
                title: task.email,
                description: task.description,
                email: task.email,
                start: new Date(task.date).toISOString().split('T')[0], // Assuming task.date is in a valid date format
                end: new Date(task.date).toISOString().split('T')[0], // Assuming you want the event to last for a single day
            }));
            setEvents(formattedEvents);
        }
    }, [tasks]);

    return (
        <div className="flex flex-col items-center justify-center h-screen relative py-4">
            <h1 className="text-3xl font-bold">Dashboard</h1>
            <div className="w-full px-12 flex justify-between">
                <div className="relative">
                    <ProfileMenu />
                </div>
                {/* Create New Data Button */}
                <button
                    className=" btn btn-primary px-4 py-0 btn-sm"
                    onClick={handleOpenCreateDialog}
                >
                    Create
                </button>
            </div>


            {/* Calendar Section */}
            <div className="flex-grow flex items-center justify-center w-full">
                <div className="card w-full shadow-lg">
                    <div className="card-body">
                        <h2 className="text-center text-xl font-bold mb-4">Task Calendar</h2>
                        <div className="h-96 border border-gray-200 rounded-lg w-full">
                            {isLoading ? (
                                <div className="flex items-center justify-center h-full">
                                    <span className="loading loading-spinner loading-lg"></span>
                                </div>
                            ) : (error as any) ? (
                                <div className="text-red-500">Error fetching tasks: {(error as any).response?.data?.message}</div>
                            ) : (
                                <BigCalendar
                                    events={events}
                                    onSelectEvent={(event) => handleOpenUpdateDialog(event)} // Display task title on event click
                                />
                            )}
                        </div>
                    </div>
                </div>
            </div>

            {/* Dialog */}
            {isDialogCreateOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box w-11/12 max-w-5xl">
                            <h3 className="font-bold text-lg">Create New Data</h3>
                            <Create handleCloseModal={handleCloseCreateDialog} />
                            <div className="modal-action">
                                <button
                                    className="btn"
                                    onClick={handleCloseCreateDialog}
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {
                isDialogUpdateOpen && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                        <div className="modal modal-open">
                            <div className="modal-box w-11/12 max-w-5xl">
                                <h3 className="font-bold text-lg">Update Data</h3>
                                <Update
                                    handleCloseModal={handleCloseUpdateDialog}
                                    initialData={{
                                        id: selectedTask?.id || '',
                                        email: selectedTask?.email || '',
                                        date: selectedTask?.start || '',
                                        description: selectedTask?.description || '',
                                    }}
                                />
                                <div className="modal-action">
                                    <button
                                        className="btn"
                                        onClick={() => setIsDialogUpdateOpen(false)}
                                    >
                                        Close
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )
            }

            <ToastContainer />
        </div>
    );
};

export default Dashboard;