import { jwtDecode } from 'jwt-decode';
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { googleLogin, login } from '../store/reducer/userSlice';
import { GoogleLogin } from '@react-oauth/google';

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
                await dispatch(googleLogin(decodedEmail));
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
        <div style={{ 
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            minHeight: '100vh',
            backgroundColor: '#e6f2ff',
            padding: '0 16px'
        }}>
            <div style={{
                width: '100%',
                maxWidth: '400px',
                margin: '0 auto',
                backgroundColor: 'white',
                borderRadius: '8px',
                overflow: 'hidden',
                boxShadow: '0 4px 10px rgba(0, 0, 0, 0.1)',
                border: '4px solid #bcdcff'
            }}>
                <div style={{
                    backgroundColor: '#d9edff',
                    padding: '16px 24px',
                    borderBottom: '2px solid #bcdcff'
                }}>
                    <h2 style={{
                        fontSize: '24px',
                        fontWeight: 'bold',
                        textAlign: 'center',
                        color: '#2c5282',
                        margin: 0
                    }}>Login</h2>
                </div>
                
                <div style={{ padding: '20px' }}>
                    <div style={{ 
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <GoogleLogin 
                            onSuccess={responseGoogle} 
                            onError={errorGoogle} 
                        />
                    </div>
                    
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                            color: '#4a5568'
                        }}>
                            Email
                        </label>
                        <input
                            id="email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={{
                                width: '94%',
                                padding: '10px',
                                backgroundColor: '#ebf5ff',
                                border: '2px solid #90cdf4',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                outline: 'none'
                            }}
                            placeholder="Enter your email"
                        />
                    </div>
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                            color: '#4a5568'
                        }}>
                            Password
                        </label>
                        <input
                            id="password"
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            style={{
                                width: '94%',
                                padding: '10px',
                                backgroundColor: '#ebf5ff',
                                border: '2px solid #90cdf4',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                outline: 'none'
                            }}
                            placeholder="Enter your password"
                        />
                    </div>
                    
                    <button
                        onClick={handleLogin}
                        style={{
                            width: '100%',
                            backgroundColor: '#3182ce',
                            color: 'white',
                            padding: '10px',
                            borderRadius: '8px',
                            fontSize: '18px',
                            fontWeight: 'bold',
                            border: 'none',
                            cursor: 'pointer'
                        }}
                    >
                        Login
                    </button>
                    
                    <div style={{
                        marginTop: '14px',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#4a5568' }}>
                            Don't have an account?{' '}
                            <Link to="/register" style={{ 
                                color: '#2b6cb0',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}>
                                Register
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;