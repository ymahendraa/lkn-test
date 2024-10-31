import React, { useState } from 'react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import api from '../service/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TaskProps {
    handleCloseModal: () => void;
    initialData: {
        id: string;
        email: string;
        date: string;
        description: string;
    } | null;
}

const Update: React.FC<TaskProps> = ({
    handleCloseModal,
    initialData,
}) => {
    const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);

    const formik = useFormik({
        initialValues: initialData || { id: '', email: '', date: '', description: '' },
        onSubmit: async (values) => {
            mutation.mutate(values);
        },
    });

    const queryClient = useQueryClient();

    const mutation = useMutation((updatedData: any) => {
        return api.patch(`/tasks/${initialData?.id}`, updatedData);
    }, {
        onSuccess: async () => {
            toast.success('Data updated successfully!');
            handleCloseModal();
            await queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false, refetchActive: true });
        },
        onError: (error) => {
            toast.error((error as any)?.response?.data?.message || 'Update failed. Please try again.');
            handleCloseModal();
        },
    });

    const deleteMutation = useMutation(() => {
        return api.delete(`/tasks/${initialData?.id}`);
    }, {
        onSuccess: async () => {
            toast.success('Task deleted successfully!');
            handleCloseModal();
            await queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false, refetchActive: true });
        },
        onError: (error) => {
            toast.error((error as any)?.response?.data?.message || 'Delete failed. Please try again.');
        },
    });

    const handleDelete = () => {
        if (initialData?.id) {
            deleteMutation.mutate();
            setIsDeleteModalOpen(false); // Close the modal after deletion
        }
    };

    const openDeleteModal = () => {
        setIsDeleteModalOpen(true);
    };

    const closeDeleteModal = () => {
        setIsDeleteModalOpen(false);
    };

    return (
        <div className="container mx-auto p-4">
            <form onSubmit={formik.handleSubmit} className="space-y-4">
                <div className="grid grid-cols-3 gap-3">

                    <div className="grid grid-cols-2 col-span-2 gap-4">
                        <div className="col-span-2 grid grid-cols-3 items-center gap-4">
                            <label className="label col-span-1" htmlFor="email">
                                <span className="label-text text-primary">Email</span>
                            </label>
                            <input
                                id="email"
                                name="email"
                                type="email"
                                onChange={formik.handleChange}
                                value={formik.values.email}
                                className="input input-bordered col-span-2"
                            />
                        </div>

                        <div className="col-span-2 grid grid-cols-3 items-center">
                            <label className="label col-span-1" htmlFor="date">
                                <span className="label-text text-primary">Date</span>
                            </label>
                            <input
                                id="date"
                                name="date"
                                type="date"
                                onChange={formik.handleChange}
                                value={formik.values.date}
                                className="input input-bordered col-span-2"
                            />
                        </div>

                        <div className="col-span-2 grid grid-cols-3 items-center">
                            <label className="label col-span-1" htmlFor="description">
                                <span className="label-text text-primary">Description</span>
                            </label>
                            <textarea
                                id="description"
                                name="description"
                                onChange={formik.handleChange}
                                value={formik.values.description}
                                className="textarea textarea-bordered col-span-2"
                            />
                        </div>
                    </div>

                    <div
                        className='form-control col-span-1 flex justify-end'
                    >
                        <div className=" grid grid-cols-2 gap-2">
                            <button type="submit" className="btn btn-primary">
                                Update
                            </button>
                            <button
                                type="button"
                                className="btn btn-error"
                                onClick={openDeleteModal}
                            >
                                Delete
                            </button>
                        </div>
                    </div>

                </div>
            </form>

            {/* Confirmation Modal */}
            {isDeleteModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center z-50">
                    <div className="modal modal-open">
                        <div className="modal-box">
                            <h3 className="font-bold text-lg">Are you sure you want to delete this task?</h3>
                            <div className="modal-action">
                                <button
                                    className="btn btn-error"
                                    onClick={handleDelete}
                                >
                                    Delete
                                </button>
                                <button
                                    className="btn"
                                    onClick={closeDeleteModal}
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );

}

export default Update;