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

const Post: React.FC = () => {
    const { posts,  totalPages,currentPage, loading } = useSelector((state: RootState) => state.posts);
    const { userId } = useSelector((state: RootState) => state.user);
    const [currentPagee, setCurrentPage] = useState(currentPage);
    const [postsPerPage] = useState(2);
    const [sortCriteria, setSortCriteria] = useState('createdAt');
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
            dispatch(delete_post({
                postId,
                postData: null
            })).then(() => {
                if (posts.length===1 && currentPagee>1) {
                    setCurrentPage(currentPagee-1);
                }
                dispatch(get_posts({ page: currentPagee, limit: postsPerPage , sort: sortCriteria}));
        
            });
        }
    }
    useEffect(() => {
      
    }, [loading]);
  
    useEffect(() => {
        setTimeout(() => {
            dispatch(get_posts({ page: currentPagee, limit: postsPerPage , sort: sortCriteria}));
        }, 300);
    }, [dispatch,currentPagee, postsPerPage, sortCriteria]);

    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
    };

    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        setSortCriteria(event.target.value);
        handlePageChange(1);
    };

    const sortedPosts = posts;

    return (
        <div className="flex flex-col gap-6 w-full max-w-2xl mx-auto">
            <div className="flex justify-end mb-4">
                <select
                    value={sortCriteria}
                    onChange={handleSortChange}
                    className="bg-white border border-gray-300 rounded-lg px-4 py-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 transition hover:bg-gray-100"
                >
                    <option value="createdAt">Newest</option>
                    <option value="numLikes">Most Liked</option>
                </select>
            </div>
            {loading ? (
            <Loader />
            ) : (
            <>
                {sortedPosts.map(post => (
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
                    <div className="p-4">
                    {/* Styled Title */}
                    <p className="ml-4 text-2xl font-bold text-purple-300">
                    {post.title}
                    </p>
                    <div className="mt-4 text-gray-700">{parse(post.content)}</div>
                    </div>

                    {/* User Info */}
                    <div className="flex items-center p-4">
                    <img
                        src={`${baseURL}${post.userImg}`}  
                        alt={post.userName}
                        className="mt-4 text-gray-700"
                    />
                    <h2 className="mt-4 text-gray-700">{post.userName}</h2>
                    </div>


                    {/* Post Image */}
                    {post.postImg && (
                                <Link to={`/comments/${post._id}`} className="block w-full h-48 bg-gray-200">
                                    <img
                                        src={`${baseURL}${post.postImg}`}
                                        alt={post.title}
                                        className="w-full h-full object-cover"
                                    />
                                </Link>
                     )}

                    {/* Post Footer */}
                    <div className="p-4 flex justify-between items-center border-t">
                    {/* Like Button */}
                    <button
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
                        onClick={() => post._id && handleLike(post._id)}
                    >
                        {post.likes.includes(userId) ? <FaHeart className="text-red-500" /> : <FaHeart className="text-gray-500" />}
                        <span className="text-gray-800 font-medium">{post.numLikes}</span>
                    </button>

                    {/* Comments Link */}
                    <Link
                        to={`/comments/${post._id}`}
                        className="flex items-center gap-2 text-blue-500 hover:text-blue-600 transition"
                    >
                        <FaRegCommentDots /> {/* Comment Icon */}
                        <span className="text-gray-800 font-medium">{post.comments}</span>
                    </Link>
                    </div>
                </div>
                ))}
                <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
                />
            </>
            )}
        </div>
    );
};

export default Post;
