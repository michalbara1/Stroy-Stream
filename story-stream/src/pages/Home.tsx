import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Post from '../components/Post';
import { toast } from 'react-toastify';
import { messageClear, get_posts } from '../store/reducer/postSlice';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../store/store';

const Home: React.FC = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch<AppDispatch>();
    const { successMessage, errorMessage } = useSelector((state: RootState) => state.posts);
    
    // Add sort state to Home component
    const [sortCriteria, setSortCriteria] = useState('createdAt');
    const [currentPage, setCurrentPage] = useState(1);
    const [postsPerPage] = useState(2);
    
    const handleCreatePost = () => {
        navigate('/create-post');
    };
    
    // Handle sort change
    const handleSortChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
        const newSortCriteria = event.target.value;
        setSortCriteria(newSortCriteria);
        setCurrentPage(1); // Reset to first page when sort changes
        
        // Dispatch the get_posts action with the new sort criteria
        dispatch(get_posts({ 
            page: 1, 
            limit: postsPerPage, 
            sort: newSortCriteria 
        }));
    };
    
    // Pass currentPage and handlePageChange to Post component
    const handlePageChange = (pageNumber: number) => {
        setCurrentPage(pageNumber);
        window.scrollTo(0, 0);
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
    }, [successMessage, dispatch, errorMessage]);

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
                maxWidth: '800px',
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
                    }}>STORIES</h2>
                </div>
                
                <div style={{ padding: '20px' }}>
                    <div style={{ 
                        marginBottom: '20px',
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <button
                            onClick={handleCreatePost}
                            style={{
                                backgroundColor: '#3182ce',
                                color: 'white',
                                padding: '10px 20px',
                                borderRadius: '8px',
                                fontSize: '16px',
                                fontWeight: 'bold',
                                border: 'none',
                                cursor: 'pointer',
                                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
                                transition: 'transform 0.2s, box-shadow 0.2s',
                            }}
                            onMouseOver={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 4px 8px rgba(0, 0, 0, 0.15)';
                            }}
                            onMouseOut={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 2px 4px rgba(0, 0, 0, 0.1)';
                            }}
                        >
                            Create Post
                        </button>
                        
                        <div style={{
                            backgroundColor: '#e1f0ff',
                            borderRadius: '8px',
                            padding: '8px 12px',
                            display: 'flex',
                            alignItems: 'center',
                            border: '2px solid #bcdcff',
                            boxShadow: '0 2px 4px rgba(0, 0, 0, 0.05)'
                        }}>
                            <span style={{
                                color: '#2c5282',
                                fontWeight: 'bold',
                                fontSize: '14px',
                                marginRight: '8px'
                            }}>
                                Filter by:
                            </span>
                            <select
                                value={sortCriteria}
                                onChange={handleSortChange}
                                style={{
                                    backgroundColor: '#f0f8ff',
                                    border: '1px solid #90cdf4',
                                    borderRadius: '6px',
                                    padding: '6px 10px',
                                    color: '#2c5282',
                                    fontWeight: 'bold',
                                    outline: 'none',
                                    cursor: 'pointer'
                                }}
                            >
                                <option value="createdAt">Newest</option>
                                <option value="numLikes">Most Liked</option>
                            </select>
                        </div>
                    </div>
                    
                    <div style={{
                        width: '100%',
                        display: 'flex',
                        justifyContent: 'center'
                    }}>
                        <div 
                            style={{
                                width: '100%',
                                maxWidth: '700px'
                            }}
                            className="posts-container"
                        >
                            <style>{`
                                .posts-container > div > div {
                                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                                }
                                .posts-container > div > div:hover {
                                    transform: translateY(-5px);
                                    box-shadow: 0 10px 20px rgba(0, 0, 0, 0.1);
                                }
                            `}</style>
                            <Post 
                                externalSortCriteria={sortCriteria}
                                externalCurrentPage={currentPage}
                                onExternalPageChange={handlePageChange}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Home;