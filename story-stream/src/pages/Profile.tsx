import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store/store';
import { toast } from 'react-toastify';
import MyPost from '../components/MyPost';
import { messageClear, update_post } from '../store/reducer/postSlice';
import api from '../api/api';
import { getAccessToken } from '../utils/authUtils';
import { update_profile } from '../store/reducer/userSlice';
import {useNavigate } from 'react-router-dom';
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
    const [newImage, setNewImage] = useState<File | string |null>(image);
    const [previewImage, setPreviewImage] = useState<string>(image);

    useEffect(() => {
        // Redirect to login if no token exists
        if (!localStorage.getItem('accessToken')) {
            toast.error('You must log in to access this page.');
            navigate('/login');
        }
    }, [navigate]);


    useEffect(() => {
        setPreviewImage(image);
    }, [image]);

    const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setNewName(e.target.value);
    };

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setNewImage(file);
            setPreviewImage(URL.createObjectURL(file)); // Live preview of the image
        }
    };

    const handleSaveChanges = async () => {
        if (newName.trim() === '') {
            toast.error('Name cannot be empty!');
            return;
        }
        let photoUrl: string | null = null;
        try {
            const formData = new FormData();
            if (newImage === image && userName === newName) {
                toast.info('No changes made to the profile.');
                return;
            }

            if (newImage === image) {
                const userData = {
                    userName: newName,
                    image: image,
                };
                await dispatch(update_profile(userData));
                toast.success('Profile updated successfully!');
            } else {
                if (newImage) {
                   
                    formData.append('photo', newImage);
                }
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
               

                await dispatch(update_post({postData, postId : post._id}));
                
            });

            comments.forEach(async (comment) => {
                const commentData = {
                    _id: comment._id,
                    content: comment.content,
                    postId: comment.postId,
                    ownerId: comment.ownerId,
                    img: photoUrl ? photoUrl : user.image,
                    userName: newName ? newName : user.userName,
                };
                if(comment.ownerId === userId){
                    await dispatch(update_comment({commentData, commentId: comment._id}));
                }
            });
        } catch (error) {
            console.error('Error uploading profile image:', error);
            toast.error('Failed to upload profile image');
        }
  
        setIsEditing(false);
    };

    const handleCancelChanges = () => {
        setNewName(userName);
        setPreviewImage(image);
        setNewImage(null);
        setIsEditing(false);
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
            <main className="flex-grow p-4 flex justify-center ">
                <div className="flex flex-col md:flex-row w-full max-w-5xl gap-6">
                    {/* User Details Section */}
                    <div className="md:w-1/4 bg-white shadow-lg rounded-lg p-6 h-[400px]
                     ">
                        <div className="flex flex-col items-center">
                            <div className="relative">
                                <img
                                    src={`${baseURL}${previewImage}`}
                                    alt="User"
                                  className="w-[200px] h-[200px] rounded-full object-cover border-[10px] bg-gradient-to-r from-blue-500 to-purple-500 p-1 shadow-lg ring-4 ring-offset-4 ring-offset-gray-100 ring-blue-300 "
                                />
                                {isEditing && (
                                    <label className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full cursor-pointer hover:bg-blue-600">
                                        <input
                                            type="file"
                                            accept="image/*"
                                            onChange={handleImageChange}
                                            className="hidden"
                                        />
                                        <svg
                                            xmlns="http://www.w3.org/2000/svg"
                                            fill="none"
                                            viewBox="0 0 24 24"
                                            stroke="currentColor"
                                            className="w-6 h-6"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M15.232 5.232l3.536 3.536M9 13h3l7-7a2.828 2.828 0 10-4-4l-7 7v3zm0 0L3 21h3l3-3z"
                                            />
                                        </svg>
                                    </label>
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
                                        >
                                            Save
                                        </button>
                                        <button
                                            onClick={handleCancelChanges}
                                            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-600"
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
        </div>
    );
};

export default Profile;