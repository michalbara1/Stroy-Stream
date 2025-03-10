import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utils/authUtils';
import { AppDispatch, RootState } from '../store/store';
import { getUserInfo, logoutUser } from '../store/reducer/userSlice';
import { baseURL } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';
import '../App.css';

function Header() {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { userName } = useSelector((state: RootState) => state.user);
    let image = useSelector((state: RootState) => state.user.image);
    image = image ? `${baseURL}${image}` : `${baseURL}/public/user.png`;
    const isLogIn = !!localStorage.getItem('accessToken');

    useEffect(() => {
        if (isLogIn) {
            dispatch(getUserInfo());
        } else {
            dispatch(logoutUser());
        }
    }, [dispatch, isLogIn]);

    const sign = isLogIn ? "Log Out" : "Log In";

    return (
        <header className="bg-gray-800 p-4">
            <div className="container mx-auto" style={{ position: 'relative' }}>
                {/* Left: Logo and Title */}
                <div style={{ display: 'inline-block', marginLeft: '10px' }}>
                    <Link to="/" style={{ display: 'flex', alignItems: 'center' }}>
                        <img
                            src={`${baseURL}/public/logo.png`}
                            alt="Logo"
                            style={{ width: '70px', height: '70px', marginRight: '8px' }}
                        />
                        <span className="text-white text-10xl special-font">Story Stream</span>
                    </Link>
                </div>

                {/* Right: User Info and Navigation */}
                <div style={{ display: 'inline-block', position: 'absolute', right: '10px', top: '50%', transform: 'translateY(-50%)' , }}>
                    {isLogIn ? (
                        <>
                            <Link to="/profile" className="text-white text-sm" style={{ marginRight: '10px' }}>
                                {userName}
                            </Link>
                            <Link to="/profile" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }}>
                                <img
                                    src={image}
                                    alt="User"
                                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                            </Link>
                            <button
                                onClick={async () => {
                                    await logout(navigate);
                                }}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl text-sm"
                                style={{ verticalAlign: 'middle' }}
                            >
                                {sign}
                            </button>
                        </>
                    ) : (
                        <>
                            <span className="text-white text-sm" style={{ marginRight: '10px', verticalAlign: 'middle' }}>Guest</span>
                            <Link to="/profile" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }}>
                                <img
                                    src={`${baseURL}/public/user.png`}
                                    alt="User"
                                    style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                                />
                            </Link>
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl text-sm"
                                style={{ marginRight: '10px', verticalAlign: 'middle' }}
                            >
                                Log In
                            </button>
                            <button
                                onClick={() => navigate('/register')}
                                className="bg-gradient-to-r from-green-500 to-teal-500 text-white px-4 py-1 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl text-sm"
                                style={{ verticalAlign: 'middle' }}
                            >
                                Register
                            </button>
                        </>
                    )}
                </div>
            </div>
        </header>
    );
}
export default Header;