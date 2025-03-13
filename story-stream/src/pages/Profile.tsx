import React, { useEffect, useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toast } from 'react-toastify';
import MyPost from '../components/MyPost';
import { messageClear, update_post } from '../store/reducer/postSlice';
import api from '../api/api';
import { getAccessToken } from '../utils/authUtils';
import { update_profile } from '../store/reducer/userSlice';
import { useNavigate } from 'react-router-dom';
import { update_comment } from '../store/reducer/commentSlice';
import { baseURL } from '../api/api';

const Profile: React.FC = () => {
    const dispatch: AppDispatch = useDispatch();
    const {user} = useSelector((state: RootState) => state);
    const {comments} = useSelector((state: RootState) => state.comments);
    const { userName, image, userId } = useSelector((state: RootState) => state.user);
    const { posts } = useSelector((state: RootState) => state.posts);
    const { successMessage, errorMessage } = useSelector((state: RootState) => state.posts);
    const [isEditing, setIsEditing] = useState(false);
    const navigate = useNavigate();
    const [newName, setNewName] = useState(userName);
    const [newImage, setNewImage] = useState<File | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    useEffect(() => {
        // Redirect to login if no token exists
        if (!localStorage.getItem('accessToken')) {
            toast.error('You must log in to access this page.');
            navigate('/login');
        }
    }, [navigate]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleImageClick = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent default button behavior
        // Click the hidden file input when the button is clicked
        if (fileInputRef.current) {
            fileInputRef.current.click();
        }
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImage(file);
            // No preview, just store the file for upload
            toast.info('Photo selected for upload');
        }
    };

    const handleSaveChanges = async () => {
        if (newName.trim() === '') {
            toast.error('Name cannot be empty!');
            return;
        }
        let photoUrl: string | null = null;
        try {
            if (!newImage && userName === newName) {
                toast.info('No changes made to the profile.');
                return;
            }

            if (!newImage) {
                // Only name changed
                const userData = {
                    userName: newName,
                    image: image,
                };
                await dispatch(update_profile(userData));
                toast.success('Profile updated successfully!');
            } else {
                // Image (and possibly name) changed
                const formData = new FormData();
                formData.append('photo', newImage);
                
                const token = await getAccessToken();
                const photoResponse = await api.post('/posts/storage', formData, {
                    headers: {
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`,
                    },
                });
                photoUrl = photoResponse.data.url.toString();
                const userData = {
                    userName: newName,
                    image: photoUrl,
                };
                await dispatch(update_profile(userData));
                toast.success('Profile updated successfully!');
            }
            
            // Update posts
            posts.forEach(async (post) => {
                const postData = {
                    title: post.title,
                    content: post.content,
                    userName: newName ? newName : user.userName,
                    _id: post._id,
                    numLikes: post.numLikes,
                    comments: post.comments,
                    postImg: post.postImg,
                    userImg: photoUrl ? photoUrl : user.image,
                    ownerId: post.ownerId,
                    likes: post.likes,
                    createdAt: post.createdAt, 
                };
                await dispatch(update_post({postData, postId: post._id}));
            });

            // Update comments
            comments.forEach(async (comment) => {
                if(comment.ownerId === userId) {
                    const commentData = {
                        _id: comment._id,
                        content: comment.content,
                        postId: comment.postId,
                        ownerId: comment.ownerId,
                        img: photoUrl ? photoUrl : user.image,
                        userName: newName ? newName : user.userName,
                    };
                    await dispatch(update_comment({commentData, commentId: comment._id}));
                }
            });
        } catch (error) {
            console.error('Error updating profile:', error);
            toast.error('Failed to update profile');
        }
  
        setIsEditing(false);
        setNewImage(null);
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleCancelChanges = () => {
        setNewName(userName);
        setNewImage(null);
        setIsEditing(false);
        // Reset the file input
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage);
            dispatch(messageClear());
        }
        if (errorMessage) {
            toast.error(errorMessage);
            dispatch(messageClear());
        }
    }, [successMessage, errorMessage, dispatch]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow p-4 flex justify-center">
                <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6">
                    {/* User Details Section */}
                    <div className="md:w-1/4 bg-white shadow-lg rounded-lg p-6 h-[400px]">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                {/* Current profile image - always show the server image */}
                                <div className="w-20 h-20 overflow-hidden rounded-full border-4 border-blue-300">
                                    <img
                                        src={`${baseURL}${image}`}
                                        alt="User"
                                        className="w-full h-full object-cover"
                                    />
                                </div>
                                
                                {isEditing && (
                                    <div className="file-input-container">
                                        {/* Completely hidden file input with inline styles */}
                                        <input
                                            ref={fileInputRef}
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            style={{
                                                position: 'absolute',
                                                width: '1px',
                                                height: '1px',
                                                padding: 0,
                                                margin: '-1px',
                                                overflow: 'hidden',
                                                clip: 'rect(0, 0, 0, 0)',
                                                whiteSpace: 'nowrap',
                                                borderWidth: 0,
                                                display: 'none'
                                            }}
                                        />
                                        
                                        {/* Camera icon button - larger and positioned properly */}
                                        <div 
                                            onClick={handleImageClick}
                                            className="absolute bottom-0 right-0 bg-blue-500 text-white rounded-full cursor-pointer hover:bg-blue-600 flex items-center justify-center shadow-md"
                                            style={{
                                                width: '32px',
                                                height: '32px',
                                                padding: '0',
                                                border: 'none',
                                                outline: 'none'
                                            }}
                                            title="Change profile picture"
                                        >
                                            {/* Camera icon */}
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 24 24"
                                                fill="none"
                                                stroke="currentColor"
                                                strokeWidth="2"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className="w-5 h-5"
                                            >
                                                <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
                                                <circle cx="12" cy="13" r="4" />
                                            </svg>
                                        </div>
                                        
                                        {/* Show status if a file is selected */}
                                        {newImage && (
                                            <div className="mt-3 text-xs text-green-600 text-center">
                                                New photo selected
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                            
                            {isEditing ? (
                                <div className="w-full mt-4">
                                    <input
                                        type="text"
                                        value={newName}
                                        onChange={handleNameChange}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        placeholder="Enter your name"
                                    />
                                    <div className="flex justify-between mt-4">
                                        <button
                                            onClick={handleSaveChanges}
                                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
                                            style={{ border: 'none', outline: 'none' }}
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelChanges}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
                                            style={{ border: 'none', outline: 'none' }}
                                        >
                                            Cancel
                                        </button>
                                    </div>
                                </div>
                            ) : (
                                <>
                                    <h2 className="text-2xl font-bold mt-4">{userName}</h2>
                                    <button
                                        onClick={() => setIsEditing(true)}
                                        className="bg-gradient-to-r mt-3 from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
                                        style={{ border: 'none', outline: 'none' }}
                                    >
                                        Edit Profile
                                    </button>
                                </>
                            )}
                        </div>
                    </div>

                    {/* User Posts Section */}
                    <div className="md:w-3/4 bg-white shadow-lg rounded-lg p-6">
                        <h2 className="text-xl font-bold mb-4">Your Posts</h2>
                        <MyPost />
                    </div>
                </div>
            </main>
            {/* Fixed styling - removed the problematic jsx attribute */}
            <style>
                {`
                input[type="file"] {
                    display: none !important;
                    visibility: hidden !important;
                    width: 0 !important;
                    height: 0 !important;
                    position: absolute !important;
                }
                
                /* Override any button styling from your global CSS */
                .file-input-container div {
                    border: none !important;
                    outline: none !important;
                    padding: 0 !important;
                }
                `}
            </style>
        </div>
    );
};

export default Profile;