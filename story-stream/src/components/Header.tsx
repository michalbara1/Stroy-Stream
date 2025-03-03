import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../utils/authUtils';
import { AppDispatch, RootState } from '../store/store';
import { getUserInfo, logoutUser } from '../store/reducer/userSlice';
import { baseURL } from '../api/api';
import { useNavigate, Link } from 'react-router-dom';

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
            <div className="container mx-auto flex items-center justify-between">
                {/* Left: Logo and Title */}
                <div className="flex items-center">
                    <Link to="/" className="flex items-center">
                        <img
                            src={`${baseURL}/public/logo.png`}
                            alt="Logo"
                            style={{ width: '24px', height: '24px', marginRight: '8px' }}
                        />
                        <span className="text-white text-lg">Story Stream</span>
                    </Link>
                </div>

                {/* Right: User Info and Navigation */}
                <div className="flex items-center space-x-4">
                    <Link to="/profile" className="text-white text-sm">
                        {userName}
                    </Link>
                    <Link to="/profile">
                        <img
                            src={image}
                            alt="User"
                            style={{ width: '24px', height: '24px', borderRadius: '50%' }}
                        />
                    </Link>
                    <button
                        onClick={async () => {
                            if (sign === "Log In") {
                                navigate('/login');
                            } else {
                                await logout(navigate);
                            }
                        }}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-4 py-1 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl text-sm"
                    >
                        {sign}
                    </button>
                </div>
            </div>
        </header>
    );
}

export default Header;