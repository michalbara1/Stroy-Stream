import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { delete_post, get_posts, setLike } from '../store/reducer/postSlice';
import { AppDispatch, RootState } from '../store/store';
import { useDispatch, useSelector } from 'react-redux';
import parse from 'html-react-parser';
import { FaEdit, FaHeart, FaRegCommentDots, FaTrashAlt } from 'react-icons/fa';
import Pagination from './Pagination';
import Loader from './Loader';
import { baseURL } from '../api/api';

interface PostProps {
    externalSortCriteria?: string;
    externalCurrentPage?: number;
    onExternalPageChange?: (pageNumber: number) => void;
}

const Post: React.FC<PostProps> = ({ 
    externalSortCriteria, 
    externalCurrentPage,
    onExternalPageChange
}) => {
    const { posts, totalPages, currentPage, loading } = useSelector((state: RootState) => state.posts);
    const { userId } = useSelector((state: RootState) => state.user);
    
    // Use external props if provided, otherwise use local state
    const [currentPagee, setCurrentPage] = useState(externalCurrentPage || currentPage);
    const [postsPerPage] = useState(2);
    const [sortCriteria, setSortCriteria] = useState(externalSortCriteria || 'createdAt');
    
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLike = (postId: string) => {
        dispatch(setLike(postId));
    };

    const handleEdit = (postId: string) => {
        navigate(`/edit-post/${postId}`);
    };

    const handleDelete = (postId: string) => {
        if (window.confirm('Are you sure you want to delete this post?')) {
            dispatch(delete_post({ postId, postData: null })).then(() => {
                if (posts.length === 1 && currentPagee > 1) {
                    handlePageChange(currentPagee - 1);
                } else {
                    dispatch(get_posts({ page: currentPagee, limit: postsPerPage, sort: sortCriteria }));
                }
            });
        }
    };

    useEffect(() => {
        // Update local state when external props change
        if (externalSortCriteria !== undefined) {
            setSortCriteria(externalSortCriteria);
        }
        
        if (externalCurrentPage !== undefined) {
            setCurrentPage(externalCurrentPage);
        }
    }, [externalSortCriteria, externalCurrentPage]);

    useEffect(() => {}, [loading]);

    useEffect(() => {
        setTimeout(() => {
            dispatch(get_posts({ page: currentPagee, limit: postsPerPage, sort: sortCriteria }));
        }, 300);
    }, [dispatch, currentPagee, postsPerPage, sortCriteria]);

    const handlePageChange = (pageNumber: number) => {
        if (onExternalPageChange) {
            // If controlled externally, call the parent handler
            onExternalPageChange(pageNumber);
        } else {
            // Otherwise, use local state
            setCurrentPage(pageNumber);
            window.scrollTo(0, 0);
        }
    };

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            {loading ? (
                <Loader />
            ) : (
                <>
                    {posts.map((post) => (
                        <div key={post._id} className="bg-white shadow-md rounded-lg overflow-hidden relative">
                            {post.ownerId === userId && (
                                <div className="absolute top-2 right-2 flex space-x-2">
                                    <button
                                        className="bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                                        onClick={() => post._id && handleEdit(post._id)}
                                    >
                                        <FaEdit />
                                    </button>
                                    <button
                                        className="bg-red-500 text-white p-2 rounded-full hover:bg-red-600 transition"
                                        onClick={() => post._id && handleDelete(post._id)}
                                    >
                                        <FaTrashAlt />
                                    </button>
                                </div>
                            )}

                            {/* Post Content */}
                            <div className="p-4 space-y-3">
                            {/* User Info (Username + Profile Image) - Fixed Version */}
                            <Link to="/profile" style={{ marginRight: '10px', display: 'inline-block', verticalAlign: 'middle' }}>
                                <img
                                    src={`${baseURL}${post.userImg}`}
                                    alt="User"
                                    style={{ width: '35px', height: '35px', borderRadius: '50%' }}
                                />
                                <p className="text-base font-bold text-gray-900">{post.userName}</p>
                            </Link>
                                {/* Post Title */}
                                <h2 className="text-2xl font-bold text-gray-900 mb-3">{post.title}</h2>

                                {/* Post Body Content */}
                                <div className="text-base text-gray-800 leading-relaxed mb-3">
                                    {parse(post.content)}
                                </div>

                                {/* Post Image */}
                                {post.postImg && (
                                    <Link to={`/comments/${post._id}`} className="block w-full h-48 bg-gray-200 mt-3">
                                        <img
                                            src={`${baseURL}${post.postImg}`}
                                            alt={post.title}
                                            className="w-full h-full object-cover"
                                        />
                                    </Link>
                                )}
                            </div>

                            {/* Post Footer (Likes + Comments) */}
                            <div className="p-4 flex justify-between items-center border-t">
                                {/* Like Button */}
                                <button
                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
                                    onClick={() => post._id && handleLike(post._id)}
                                >
                                    {post.likes.includes(userId) ? (
                                        <FaHeart className="text-red-500" />
                                    ) : (
                                        <FaHeart className="text-gray-500" />
                                    )}
                                    <span className="text-sm text-gray-800 font-medium">{post.numLikes}</span>
                                </button>

                                {/* Comments Link */}
                                <Link
                                    to={`/comments/${post._id}`}
                                    className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
                                >
                                    <FaRegCommentDots />
                                    <span className="text-sm text-gray-800 font-medium">{post.comments}</span>
                                </Link>
                            </div>
                        </div>
                    ))}
                    <Pagination currentPage={currentPage} totalPages={totalPages} onPageChange={handlePageChange} />
                </>
            )}
        </div>
    );
};

export default Post;