import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { add_comment, delete_comment, get_comments, get_post, messageClear, update_comment } from '../store/reducer/commentSlice';
import { AppDispatch, RootState } from '../store/store';
import { toast } from 'react-toastify';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';
import { baseURL } from '../api/api';
import Header from '../components/Header';


const Comments: React.FC = () => {
    const { postId } = useParams<{ postId: string }>();
    const dispatch = useDispatch<AppDispatch>();
    const { posts, comments, errorMessage, successMessage } = useSelector((state: RootState) => state.comments);
    const { userId } = useSelector((state: RootState) => state.user);
    const [newComment, setNewComment] = useState('');
    const [editingCommentId, setEditingCommentId] = useState<string | null>(null);
    const navigate=useNavigate();
    useEffect(() => {
        if (postId) {
            dispatch(get_post(postId));
            dispatch(get_comments(postId));
        }
    }, [dispatch]);

    const handleAddOrUpdateComment = () => {
            
                if (!localStorage.getItem('accessToken')) {
                    toast.error('You must log in to add a comment.');
                    navigate('/login');
                }
        if (postId && newComment.trim()) {
            if (editingCommentId) {
                const existingComment = comments.find(comment => comment._id === editingCommentId);
                if (!existingComment) return;

                const commentData = {
                    ...existingComment,
                    content: newComment,
                };
                dispatch(update_comment({ commentData, commentId: editingCommentId }));
                setEditingCommentId(null);
            } else {
                dispatch(add_comment({ postId, content: newComment }));
            }
            setNewComment('');
        }
    };

    const handleEditComment = (commentId: string, content: string) => {
        setEditingCommentId(commentId);
        setNewComment(content);
    };

    const handleDeleteComment = (commentId: string) => {
        if (window.confirm('Are you sure you want to delete this comment?')) {
            dispatch(delete_comment( commentId )).then(()=>{
            if(postId){
                dispatch(get_comments(postId));
             }
            });
        }
    };

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
            <main className="flex-grow p-4">
                {errorMessage && <div className="text-red-500 mb-4">{errorMessage}</div>}
                <div className="max-w-2xl mx-auto bg-white shadow-md rounded-lg overflow-hidden relative">
                    <div className="flex items-center p-4 relative">
                        {posts && (
                            <>
                                <img src={`${baseURL}${posts.userImg}`} alt={posts.userName} className="w-10 h-10 rounded-full bg-gray-300 flex-shrink-0" />
                                <h2 className="ml-4 text-xl font-bold">{posts.userName}</h2>
                            </>
                        )}
                        <button
                            className="absolute top-2 right-2 text-gray p-2 rounded-full hover:bg-gray-500 transition"
                            onClick={() => navigate(-1)}
                            style={{ width: '40px', height: '40px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                        >
                            X
                        </button>
                    </div>
                    {posts && posts.postImg && (
                        <div className="w-full h-48 bg-gray-200">
                            <img
                                 src={`${baseURL}${posts.postImg}`}
                                alt={posts.title}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    )}
                    <div className="p-4">
                        {posts && (
                            <>
                                <p className="mt-2 text-gray-600">{posts.title}</p>
                                <div
                                    className="mt-4 text-gray-800"
                                    dangerouslySetInnerHTML={{ __html: posts.content }}
                                />
                            </>
                        )}
                    </div>
                </div>
                <div className="max-w-2xl mx-auto mt-4">
                    <h3 className="text-lg font-semibold mb-2">Comments</h3>
                    <div className="space-y-4">
                        {comments.map(comment => (
                            <div key={comment._id} className="bg-gray-100 p-4 rounded-lg shadow-md relative">
                                <div className="flex items-center">
                                    <img src={`{comment.img}`} alt={comment.userName} className="w-8 h-8 rounded-full bg-gray-300 flex-shrink-0" />
                                    <h4 className="ml-3 text-md font-semibold">{comment.userName}</h4>
                                    {comment.ownerId === userId && (
                                        <div className="absolute top-2 right-2 flex space-x-2">
                                            <button
                                                className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                                               onClick={() => handleEditComment(comment._id, comment.content)}
                                            >
                                                <FaEdit />
                                            </button>
                                            <button
                                                className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                                                 onClick={() => handleDeleteComment(comment._id)}
                                            >
                                                <FaTrashAlt />
                                            </button>
                                        </div>
                                    )}
                                </div>
                                <p className="mt-2 text-gray-600">{comment.content}</p>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4">
                        <textarea
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Add a comment..."
                        />
                        <button
                            onClick={handleAddOrUpdateComment}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 text-white px-6 py-2 rounded-lg shadow-lg hover:scale-105 transform transition duration-300 ease-in-out hover:shadow-xl"
                       
                        >
                            {editingCommentId ? 'Update Comment' : 'Add Comment'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
};

export default Comments; 