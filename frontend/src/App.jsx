import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import Login from './pages/Login';
import Signup from './pages/Signup';
import BlogDetail from './pages/BlogDetail';
import CreateBlog from './pages/CreateBlog';
import EditBlog from './pages/EditBlog';
import Profile from './pages/Profile';
import { ArchitectureProvider } from './context/ArchitectureContext';

function App() {
    return (
        <ArchitectureProvider>
            <Router>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/signup" element={<Signup />} />
                    <Route path="/new" element={<CreateBlog />} />
                    <Route path="/edit/:id" element={<EditBlog />} />
                    <Route path="/blog/:id" element={<BlogDetail />} />
                    <Route path="/profile/:username" element={<Profile />} />
                </Routes>
            </Router>
        </ArchitectureProvider>
    );
}

export default App;
