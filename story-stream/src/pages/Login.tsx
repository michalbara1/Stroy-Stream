import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { googleLogin, login } from '../store/reducer/userSlice';
import { GoogleLogin } from '@react-oauth/google';
import Header from '../components/Header';

const Login: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const responseGoogle = async (response: any) => {
        const decodedEmail: { email: string } = jwtDecode(response?.credential);
        if(!decodedEmail){
            toast.error('Login failed');
            return;
        } else {
            try {
                await dispatch(googleLogin( decodedEmail));
                toast.success('Login successful');
                navigate('/');
            } catch (err : any) {
                toast.error(err);
            }
        }
    };
    const errorGoogle = () => {
        toast.error('Login failed');
        return;
    };
    const handleLogin = async () => {
        if (!email || !password) {
            toast.error('Please fill in all fields');
            return;
        } else {
            try {
                await dispatch(login({ email, password })).unwrap();
                toast.success('Login successful');
                navigate('/');
                
            } catch (err : any) {
                toast.error(err);
            }
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow p-4 flex justify-center items-center pb-20">
                <div className="w-full max-w-md bg-white shadow-md rounded-lg p-6">
                    <h2 className="text-2xl font-bold mb-4 text-center">Login</h2>
                    <div className="flex justify-center mb-4">
                        <GoogleLogin 
                            containerProps={{ className: "bg-red-600 text-white px-4 py-2 rounded-lg flex items-center" }} 
                            onSuccess={responseGoogle} 
                            onError={errorGoogle} 
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
                    <button
                        onClick={handleLogin}
                        className="w-full bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600"
                    >
                        Login
                    </button>
                    <div className="mt-4 text-center">
                        <p className="text-gray-700">
                            Don't have an account?{' '}
                            <Link to="/register" className="text-blue-500 hover:underline">
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Login;