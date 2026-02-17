import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Container, Typography, Box, Avatar, Paper, Button, TextField, CircularProgress, Alert } from '@mui/material';
import Layout from '../components/Layout';
import { userApi, authApi } from '../api/services';

const Profile = () => {
    const { username } = useParams();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [isEditing, setIsEditing] = useState(false);

    // Edit form state
    const [fullName, setFullName] = useState('');
    const [bio, setBio] = useState('');
    const [avatarUrl, setAvatarUrl] = useState('');

    const currentUser = authApi.getCurrentUser();
    const isOwnProfile = currentUser && currentUser.sub === username;

    useEffect(() => {
        const fetchProfile = async () => {
            try {
                const data = await userApi.getProfile(username);
                setProfile(data);
                // State initialized only when edit is clicked
            } catch (err) {
                console.error("Failed to fetch profile", err);
                setError('Failed to load profile.');
            } finally {
                setLoading(false);
            }
        };

        fetchProfile();
    }, [username, isOwnProfile]);

    const handleEditClick = () => {
        setFullName(profile.full_name || '');
        setBio(profile.bio || '');
        setAvatarUrl(profile.avatar_url || '');
        setIsEditing(true);
    };

    const handleUpdate = async () => {
        try {
            const updatedUser = await userApi.updateProfile({
                full_name: fullName.trim(),
                bio: bio.trim(),
                avatar_url: avatarUrl.trim()
            });
            setProfile(updatedUser);
            setIsEditing(false);
        } catch (err) {
            console.error("Failed to update profile", err);
            setError('Failed to update profile.');
        }
    };

    if (loading) {
        return (
            <Layout>
                <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                    <CircularProgress />
                </Box>
            </Layout>
        );
    }

    if (error || !profile) {
        return (
            <Layout>
                <Container maxWidth="md" sx={{ mt: 4 }}>
                    <Alert severity="error">{error || 'User not found'}</Alert>
                </Container>
            </Layout>
        );
    }

    return (
        <Layout>
            <Container maxWidth="md" sx={{ mt: 8 }}>
                <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 4 }}>
                        <Avatar
                            src={profile.avatar_url}
                            alt={profile.username}
                            sx={{ width: 120, height: 120, mb: 2, bgcolor: 'primary.main', fontSize: '3rem' }}
                        >
                            {profile.username.charAt(0).toUpperCase()}
                        </Avatar>

                        <Typography variant="h4" fontWeight="bold" gutterBottom>
                            {profile.username}
                        </Typography>

                        {!isEditing ? (
                            <>
                                <Typography variant="h6" color="text.secondary" gutterBottom>
                                    {profile.full_name || 'No Name Set'}
                                </Typography>
                                <Typography variant="body1" align="center" sx={{ maxWidth: 600, mt: 2, color: 'text.secondary' }}>
                                    {profile.bio || 'No bio available.'}
                                </Typography>

                                {isOwnProfile && (
                                    <Button variant="outlined" sx={{ mt: 3 }} onClick={handleEditClick}>
                                        Edit Profile
                                    </Button>
                                )}
                            </>
                        ) : (
                            <Box sx={{ width: '100%', maxWidth: 500, mt: 2 }}>
                                <TextField
                                    fullWidth
                                    label="Full Name"
                                    margin="normal"
                                    value={fullName}
                                    onChange={(e) => setFullName(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Bio"
                                    margin="normal"
                                    multiline
                                    rows={3}
                                    value={bio}
                                    onChange={(e) => setBio(e.target.value)}
                                />
                                <TextField
                                    fullWidth
                                    label="Avatar URL"
                                    margin="normal"
                                    value={avatarUrl}
                                    onChange={(e) => setAvatarUrl(e.target.value)}
                                    helperText="Paste a URL for your profile picture"
                                />
                                <Box sx={{ display: 'flex', justifyContent: 'flex-end', gap: 2, mt: 3 }}>
                                    <Button color="secondary" onClick={() => setIsEditing(false)}>
                                        Cancel
                                    </Button>
                                    <Button variant="contained" onClick={handleUpdate}>
                                        Save Changes
                                    </Button>
                                </Box>
                            </Box>
                        )}
                    </Box>
                </Paper>
            </Container>
        </Layout>
    );
};

export default Profile;
