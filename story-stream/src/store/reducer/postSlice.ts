import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';
import api from '../../api/api';
import { getAccessToken } from '../../utils/authUtils';


// Define the Post type based on your API response structure
interface Post {
    likes: string[];
    _id: string | null;
    title: string;
    content: string;
    userName: string;
    numLikes: number | 0;
    comments: number | null;
    userImg: string | null;
    postImg: string | null;
    ownerId: string | null;
    createdAt: string | null;
}

// Define the state type for the slice
interface PostState {
    posts: Post[]; 
    errorMessage: string; 
    currentPage: number;
    totalPages: number;
    totalPosts: number;
    successMessage: string; 
    loading: boolean;
}


export const get_posts = createAsyncThunk(
    'posts/get_posts',
    async ({ page, limit , sort}: { page: number; limit: number, sort: string }, { rejectWithValue, fulfillWithValue }) => {
        try {
            const {data} = await api.get(`/posts?page=${page}&limit=${limit}&sort=${sort}`);
            return fulfillWithValue(data)
        } catch (error) {
            return rejectWithValue(error)
        }
    }
)

export const setLike = createAsyncThunk(
    'posts/setLike',
    async (postId: string, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.put(`/posts/like/${postId}`, null, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);



export const create_post = createAsyncThunk(
    'posts/create_post',
    async (postData: Post, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.post('/posts', postData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


interface UpdatePostParams {
    postData: Post | null;
    postId: string | null;
}

export const update_post = createAsyncThunk(
    'posts/update_post',
    async ({ postData, postId }: UpdatePostParams, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.put(`/posts/${postId}`, postData, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);


export const delete_post = createAsyncThunk(
    'posts/delete_post',
    async ( {postId} : UpdatePostParams, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.delete(`/posts/${postId}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
      
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const get_posts_byId = createAsyncThunk(
    'posts/get_posts_byId',
    async (_, { rejectWithValue, fulfillWithValue }) => {
        try {
            const token = await getAccessToken();
            const { data } = await api.get(`/posts/sender`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            return fulfillWithValue(data);
        } catch (error) {
            return rejectWithValue(error);
        }
    }
);

export const postSlice = createSlice({
    name: 'posts',
    initialState: {
        posts: [],
        currentPage: 1,
        totalPages: 1,
        totalPosts: 0,
        errorMessage : '',
        successMessage: '',
        loading: true,
    } as PostState,
    reducers : {
        messageClear : (state) => {
            state.errorMessage = ""
            state.successMessage = ""
        },
   
    },
    extraReducers: (builder) => {
        builder
        .addCase(get_posts.rejected, (state) => {
            state.loading = false;
        })
        .addCase(get_posts.pending, (state) => {
            state.loading = true;
        })
        .addCase(get_posts.fulfilled, (state, { payload }) => {
            state.loading = false;
            state.posts = payload.getPosts;
            state.currentPage = payload.currentPage;
            state.totalPages = payload.totalPages;
            state.totalPosts = payload.totalPosts;
        })
        .addCase(setLike.fulfilled, (state, { payload }) => {
            const post = state.posts.find(post => post._id === payload.post._id);
        
            if (post) {
                post.numLikes = payload.post.numLikes;
                post.likes = payload.post.likes;
            }
            state.successMessage = payload.message;
        })
        .addCase(create_post.fulfilled, (state) => {
            state.loading = true;
        })
        .addCase(create_post.rejected, (state) => {
            
            state.errorMessage = "Error creating post";
        })
        .addCase(update_post.fulfilled, (state, { payload}) => {
            const post = state.posts.find(post => post._id === payload.updatePost._id);
        
            if (post) {
                post.title = payload.updatePost.title;
                post.content = payload.updatePost.content;
                post.postImg = payload.updatePost.postImg;
                post.createdAt = payload.updatePost.createdAt;
                post.userName = payload.updatePost.userName;
                post.userImg = payload.updatePost.userImg;
                post.numLikes = payload.updatePost.numLikes;
                post.comments = payload.updatePost.comments;
                post.likes = payload.updatePost.likes;
                post.ownerId = payload.updatePost.ownerId;
                post._id = payload.updatePost._id;
            }
        })
        // .addCase(update_post.rejected, (state) => {
        //     state.errorMessage = "Error creating post";
        // })
        .addCase(delete_post.fulfilled, (state,{payload}) => {
            state.posts = state.posts.filter(post => post._id !== payload.post._id);
            state.successMessage = "Post deleted successfully";
        })
        .addCase(delete_post.rejected, (state) => {
            state.errorMessage = "Error deleting post";
        })
        .addCase(get_posts_byId.fulfilled, (state, { payload }) => {
            state.posts = payload.senderPosts;
        })
    }

})

export const {messageClear} = postSlice.actions
export default postSlice.reducer