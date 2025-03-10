import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Comments from './pages/Comments';
import CreatePost from './pages/CreatePost';
import Register from './pages/Register';
import Login from './pages/Login';
import { ToastContainer } from 'react-toastify';
import EditPost from './pages/EditPost';
import Header from './components/Header';

const App: React.FC = () => {


  return (
    <Router>
        <Header/>
        <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/comments/:postId" element={<Comments />} />
            <Route path="/create-post" element={<CreatePost />} />
            <Route path="/register" element={<Register />} />
            <Route path="/login" element={<Login />} />
            <Route path="/edit-post/:postId" element={<EditPost />} />
        </Routes>
        <ToastContainer />
    </Router>
    );
};

export default App;