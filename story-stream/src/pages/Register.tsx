import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogin, register } from '../store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';

const Register: React.FC = () => {
    const [userName, setUserName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    const responseGoogle = async (response: any) => {
        const decodedEmail: { email: string , name : string} = jwtDecode(response?.credential);
        if(!decodedEmail){
            toast.error('Register failed');
            return;
        } else {
            try {
                await dispatch(googleLogin( decodedEmail));
                toast.success('Register successful');
                navigate('/');
            } catch (err : any) {
                toast.error(err);
            }
        }
    };
    const errorGoogle = () => {
        toast.error('Register failed');
        return;
    };
    const handleRegister = async () => {

        if (!email || !password || !userName) {
            toast.error('Please fill in all fields');
            return;
        } else
        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        } else {
            try {
                await dispatch(register({ email, password, userName })).unwrap();
                toast.success('Registration successful');
                navigate('/login');
                
            } catch (err : any) {
                toast.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow p-4 flex justify-center items-center pb-20">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Register</h2>
                    <div className="flex justify-center mb-4">
                        {/* <button className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center">
                            <FaGoogle className="mr-2" />
                            Login with Google
                        </button> */}
                        <GoogleLogin 
                            containerProps={{ className: "bg-red-600 text-white px-4 py-2 rounded-lg flex items-center" }} 
                            onSuccess={responseGoogle} 
                            onError={errorGoogle} 
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="username">
                            Username
                        </label>
                        <input
                            id="username"
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your username"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="email">
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your email"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="password">
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter your password"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="confirmPassword">
                           Confirm Password
                        </label>
                        <input
                            id="confirmPassword"
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
                            <Link to="/login" className="text-blue-500 hover:underline">
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Register;