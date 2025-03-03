import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header';
import Post from '../components/Post';
import { toast } from 'react-toastify';
import { messageClear } from '../store/reducer/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';


const Home: React.FC = () => {
    const navigate = useNavigate();
    const handleCreatePost = () => {
        navigate('/create-post');
    };

    const dispatch = useDispatch<AppDispatch>();
    const { successMessage,errorMessage } = useSelector((state: RootState) => state.posts);
    useEffect(() => {
        if (successMessage) {
            toast.success(successMessage)
            dispatch(messageClear()) 
      }
      if (errorMessage) {
          toast.error(errorMessage)
          dispatch(messageClear())
        }
    },[successMessage,dispatch,errorMessage])



    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <Header />
            <main className="flex-grow p-4 flex flex-col items-center">
                <button
                    onClick={handleCreatePost}
                    className="mb-4 bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
                >
                    Create Post
                </button>
                <div className="w-full max-w-4xl bg-white shadow-lg rounded-lg p-6 flex justify-center">
                    <div className="w-full flex justify-center">
                        <div className="w-full max-w-2xl">
                            <Post />
                        </div>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Home;