import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogin, register } from '../store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {jwtDecode} from 'jwt-decode';
import api from '../api/api'; // Make sure this is your Axios instance

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [image, setImage] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string>('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImage(file);
            setPreviewImage(URL.createObjectURL(file));
        }
    };

    const responseGoogle = async (response: any) => {
        const decodedEmail: { email: string, name: string } = jwtDecode(response?.credential);
        if (!decodedEmail) {
            toast.error('Register failed');
            return;
        } else {
            try {
                await dispatch(googleLogin(decodedEmail));
                toast.success('Register successful');
                navigate('/');
            } catch (err: any) {
                toast.error(err.message || 'Google Register failed');
            }
        }
    };

    const errorGoogle = () => {
        toast.error('Register failed');
    };

    const handleRegister = async () => {
        if (!email || !password || !userName) {
            toast.error('Please fill in all fields');
            return;
        }
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        let imageUrl = '';

        try {
            if (image) {
                const formData = new FormData();
                formData.append('photo', image);

                const response = await api.post('/posts/storage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                    },
                });

                imageUrl = response.data.url;
            }

            await dispatch(register({ email, password, userName, imageUrl: imageUrl })).unwrap();

            toast.success('Registration successful');
            navigate('/login');
        } catch (err: any) {
            toast.error(err.message || 'Registration failed');
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow p-4 flex justify-center items-center pb-20">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                    <div className="flex justify-center mb-4">
                        <GoogleLogin
                            onSuccess={responseGoogle}
                            onError={errorGoogle}
                        />
                    </div>
                    {/* Image Upload Section */}
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Profile Picture</label>
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="w-full"
                        />
                        {previewImage && (
                            <img
                                src={previewImage}
                                alt="Preview"
                                className="mt-2 w-24 h-24 object-cover rounded-full"
                            />
                        )}
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Username</label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Password</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2">Confirm Password</label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Confirm password"
                        />
                    </div>
                    <button
                        onClick={handleRegister}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Register
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-gray-700">
                            Already have an account?{' '}
                            <Link to="/login" className="text-blue-500 hover:underline">Login</Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;