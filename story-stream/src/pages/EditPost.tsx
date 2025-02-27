import ReactQuill from 'react-quill';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';
import {  get_post } from '../store/reducer/commentSlice';
import { toast } from 'react-toastify';
import api from '../api/api';
import { getAccessToken } from '../utils/authUtils';
import { useNavigate, useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { update_post } from '../store/reducer/postSlice';
import { baseURL } from '../api/api';

const EditPost: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const [title, setTitle] = useState('');
    const [content, setContent] = useState('');
    const [photo, setPhoto] = useState<File | null>(null);
    const [photoPreview, setPhotoPreview] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const { userName, image } = useSelector((state: RootState) => state.user);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();
    
    const {posts} = useSelector((state: RootState) => state.comments);


    useEffect(() => {
         if (postId) {
             dispatch(get_post(postId));
         }
    }, [dispatch, postId]);

    useEffect(() => {
        if (posts) {
            setTitle(posts.title);
             setContent(posts.content);
             setPhotoPreview(posts.postImg ? `{posts.postImg}` : null);
        }
     }, [posts]);

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setTitle(e.target.value);
    };

    const handleContentChange = (value: string) => {
        setContent(value);
    };

    const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setPhoto(file);
            setPhotoPreview(URL.createObjectURL(file));
        }
    };

     const handleSubmit = async () => {
        if (!title || !content) {
             toast.error('Please fill in all fields');
            return;
         }

         setLoading(true);
        try {
             let photoUrl = posts?.postImg;
           if (photo) {
                const formData = new FormData();
                formData.append('photo', photo);
                const token = await getAccessToken();
                const photoResponse = await api.post('/posts/upload', formData, {
                    headers: { 
                        'Content-Type': 'multipart/form-data',
                        Authorization: `Bearer ${token}`
                    },
                });
                photoUrl = photoResponse.data.url;
            }

            const postData = {
                title,
                content,
                userName,
                _id: postId ?? null,
                numLikes: 0,
                comments: 0,
                postImg: photoUrl || '',
                userImg: image || '',
                ownerId: null,
                likes: [],
                createdAt: new Date().toISOString(), 
            };

            dispatch(update_post({postData, postId: postId ?? null}));
        } catch (error) {
            console.error('Error updating post:', error);
            toast.error('Failed to update the post');
        } finally {
            toast.success('Post updated successfully!');
            navigate('/');
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <main className="flex-grow p-4 flex justify-center items-center relative">
                <div className="w-full max-w-2xl bg-white shadow-md rounded-lg p-6 relative">
                    <div className="flex justify-between items-center mb-6">
                        <h2 className="text-3xl font-bold text-gray-800">Edit Post</h2>
                        <button
                            className="text-gray p-2 rounded-full hover:bg-gray-500 transition"
                            onClick={() => navigate(-1)}
                            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            X
                        </button>
                    </div>
                    <div className="mb-6 flex items-center gap-4 relative">
                        <img src={`${baseURL}${image}`} alt={userName} className="w-12 h-12 rounded-full" />
                        <p className="text-lg font-bold text-gray-700">{userName}</p>
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="title">
                            Title
                        </label>
                        <input
                            id="title"
                            type="text"
                            value={title}
                            onChange={handleTitleChange}
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Enter the title"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="content">
                            Content
                        </label>
                        <ReactQuill
                            value={content}
                            onChange={handleContentChange}
                            className="bg-white"
                            theme="snow"
                        />
                    </div>
                    <div className="mb-6">
                        <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="photo">
                            Upload Photo
                        </label>
                        <input
                            id="photo"
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="w-full"
                        />
                        {photoPreview && (
                            <div className="mt-4">
                                <img
                                    src={photoPreview}
                                    alt="Selected"
                                    className="w-full h-25 rounded-lg border border-gray-300 shadow-lg"
                                />
                            </div>
                        )}
                    </div>
                    <button
                         onClick={handleSubmit}
                        className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
                        disabled={loading}
                    >
                        {loading ? 'Submitting...' : 'Update'}
                    </button>
                </div>
            </main>
        </div>
    );
};

export default EditPost;