import React, { useEffect, useState } from 'react';
import { Grid, Typography, CircularProgress, Box, Pagination } from '@mui/material';
import Layout from '../components/Layout';
import BlogCard from '../components/BlogCard';
import { blogApi } from '../api/services';

const Home = () => {
    const [blogs, setBlogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const ITEMS_PER_PAGE = 6;

    useEffect(() => {
        setLoading(true);
        blogApi.getAll('', page, ITEMS_PER_PAGE)
            .then(data => {
                // Backend now returns { items: [], total: ... }
                // Handle legacy array response just in case during transition
                const items = Array.isArray(data) ? data : data.items;
                const total = Array.isArray(data) ? data.length : data.total;

                setBlogs(items);
                setTotalPages(Math.ceil(total / ITEMS_PER_PAGE));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to fetch blogs", err);
                setLoading(false);
            });
    }, [page]);

    const handlePageChange = (event, value) => {
        setPage(value);
        window.scrollTo(0, 0);
    };

    return (
        <Layout>
            <Box sx={{ mb: 4 }}>
                <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 'bold' }}>
                    Latest Stories
                </Typography>
            </Box>

            {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 8 }}>
                    <CircularProgress />
                </Box>
            ) : (
                <>
                    {blogs.length === 0 ? (
                        <Typography variant="h6" color="text.secondary" align="center" sx={{ my: 8 }}>
                            No stories found.
                        </Typography>
                    ) : (
                        <Grid container spacing={4}>
                            {blogs.map((blog) => (
                                <Grid item key={blog.id} xs={12} sm={6} md={4}>
                                    <BlogCard blog={blog} />
                                </Grid>
                            ))}
                        </Grid>
                    )}

                    {totalPages > 1 && (
                        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 8 }}>
                            <Pagination
                                count={totalPages}
                                page={page}
                                onChange={handlePageChange}
                                color="primary"
                                size="large"
                                width={6}
                            />
                        </Box>
                    )}
                </>
            )}
        </Layout>
    );
};

export default Home;
