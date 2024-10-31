import React from 'react';
import { useFormik } from 'formik';
import { useMutation } from 'react-query';
import * as Yup from 'yup';
import api from '../service/api';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

interface LoginValues {
    username: string;
    password: string;
}

const loginUser = async (values: LoginValues) => {
    const response = await api.post('/login', values);
    return response.data;
};

const LoginForm: React.FC = () => {
    const { login } = useAuth(); // get login function from AuthContext
    const navigate = useNavigate();

    const mutation = useMutation(loginUser, {
        onSuccess: (data) => {
            console.log('Login successful:', data);
            // Handle successful login (e.g., redirect or show a success message)
            login(data.token, data.refreshToken);
            navigate('/dashboard');
            toast.success('Login successful!');
        },
        onError: (error) => {
            console.error('Login error:', error);
            // Handle error (e.g., show an error message)
            toast.error((error as any)?.response?.data?.message || 'Login failed. Please try again.');
        },
    });

    const formik = useFormik({
        initialValues: {
            username: '',
            password: '',
        },
        validationSchema: Yup.object({
            username: Yup.string().required('Required'),
            password: Yup.string().required('Required'),
        }),
        onSubmit: (values, { setSubmitting }) => {
            mutation.mutate(values);
            setSubmitting(false);
        },
    });

    return (
        <div>
            <form onSubmit={formik.handleSubmit} className="space-y-4 border border-primary p-8 rounded-xl">
                <div>
                    <label className="label">
                        <span className="label-text">Username</span>
                    </label>
                    <input
                        type="username"
                        name="username"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.username}
                        className={`input input-bordered w-full ${formik.touched.username && formik.errors.username ? 'input-error' : ''}`}
                        placeholder="Enter your username"
                    />
                    {formik.touched.username && formik.errors.username ? (
                        <div className="text-red-500 text-sm">{formik.errors.username}</div>
                    ) : null}
                </div>

                <div>
                    <label className="label">
                        <span className="label-text">Password</span>
                    </label>
                    <input
                        type="password"
                        name="password"
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        value={formik.values.password}
                        className={`input input-bordered w-full ${formik.touched.password && formik.errors.password ? 'input-error' : ''}`}
                        placeholder="Enter your password"
                    />
                    {formik.touched.password && formik.errors.password ? (
                        <div className="text-red-500 text-sm">{formik.errors.password}</div>
                    ) : null}
                </div>

                <button type="submit" className="btn btn-primary w-full" disabled={formik.isSubmitting}>
                    {formik.isSubmitting ? 'Signing in...' : 'Sign In'}
                </button>

                {/* Error alert */}
                {mutation.isError && (
                    <div className="alert alert-error mb-4 rounded-lg text-white">
                        <div>
                            <span>{(mutation.error as any)?.response?.data?.message || 'Login failed. Please try again.'}</span>
                        </div>
                    </div>
                )}
            </form>

            {/* Toast Container */}
            <ToastContainer />
        </div>
    );
};

export default LoginForm;