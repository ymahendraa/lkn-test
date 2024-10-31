import React from 'react';
import { useFormik } from 'formik';
import { useMutation, useQueryClient } from 'react-query';
import api from '../service/api';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface TaskProps {
    handleCloseModal: () => void;
}

const Create: React.FC<TaskProps> = ({
    handleCloseModal,
}) => {
    const formik = useFormik({
        initialValues: {
            email: '',
            date: '',
            description: '',
        },
        onSubmit: async (values) => {
            mutation.mutate(values);
        },
    });

    // define queryClient
    const queryClient = useQueryClient();

    const mutation = useMutation((newData: any) => {
        return api.post('/tasks', newData);
    }, {
        onSuccess: async () => {
            toast.success('Data submitted successfully!');
            handleCloseModal();
            await queryClient.invalidateQueries({ queryKey: ['tasks'], exact: false, refetchActive: true })
        },
        onError: (error) => {
            toast.error((error as any)?.response?.data?.message || 'Submission failed. Please try again.');
            handleCloseModal();
        },
    });

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

                    <div className="form-control col-span-1 flex justify-end">
                        <button type="submit" className="btn btn-primary">
                            Submit
                        </button>
                    </div>
                </div>

            </form>
        </div>
    );
};

export default Create;