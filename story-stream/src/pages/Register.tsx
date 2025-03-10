import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import { googleLogin, register } from '../store/reducer/userSlice';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../store/store';
import { useNavigate } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import api from '../api/api';

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
                    }}>Register</h2>
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
                    
                    {/* Profile Picture - Compact */}
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                            color: '#4a5568'
                        }}>
                            Profile Picture
                        </label>
                        <div style={{
                            display: 'flex',
                            alignItems: 'center',
                            backgroundColor: '#ebf5ff',
                            border: '2px solid #90cdf4',
                            borderRadius: '8px',
                            padding: '6px',
                            width: '98%'
                        }}>
                            {previewImage && (
                                <img
                                    src={previewImage}
                                    alt="Preview"
                                    style={{
                                        width: '30px',
                                        height: '30px',
                                        objectFit: 'cover',
                                        borderRadius: '50%',
                                        marginRight: '10px'
                                    }}
                                />
                            )}
                            <input
                                type="file"
                                accept="image/*"
                                onChange={handleImageChange}
                                style={{
                                    width: previewImage ? 'calc(100% - 40px)' : '100%',
                                    fontSize: '14px',
                                    fontWeight: 'bold'
                                }}
                            />
                        </div>
                    </div>
                    
                    <div style={{ marginBottom: '14px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                            color: '#4a5568'
                        }}>
                            Username
                        </label>
                        <input
                            type="text"
                            value={userName}
                            onChange={(e) => setUserName(e.target.value)}
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
                            placeholder="Enter your username"
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
                    
                    <div style={{ marginBottom: '14px' }}>
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
                    
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{
                            display: 'block',
                            fontSize: '14px',
                            fontWeight: 'bold',
                            marginBottom: '6px',
                            color: '#4a5568'
                        }}>
                            Confirm Password
                        </label>
                        <input
                            type="password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            placeholder="Confirm password"
                        />
                    </div>
                    
                    <button
                        onClick={handleRegister}
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
                        Register
                    </button>
                    
                    <div style={{
                        marginTop: '14px',
                        textAlign: 'center'
                    }}>
                        <p style={{ color: '#4a5568' }}>
                            Already have an account?{' '}
                            <Link to="/login" style={{ 
                                color: '#2b6cb0',
                                fontWeight: 'bold',
                                textDecoration: 'none'
                            }}>
                                Login
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;