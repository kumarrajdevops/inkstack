import React from 'react';
import { Card, CardMedia, CardContent, Typography, CardActionArea } from '@mui/material';
import { Link } from 'react-router-dom';

const BlogCard = ({ blog }) => {
    return (
        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <CardActionArea component={Link} to={`/blog/${blog.id}`}>
                <CardMedia
                    component="img"
                    height="140"
                    image={blog.image_url || "https://source.unsplash.com/random"}
                    alt={blog.title}
                />
                <CardContent>
                    <Typography gutterBottom variant="h5" component="div">
                        {blog.title}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{
                        overflow: 'hidden',
                        textOverflow: 'ellipsis',
                        display: '-webkit-box',
                        WebkitLineClamp: 3,
                        WebkitBoxOrient: 'vertical',
                    }}>
                        {blog.content}
                    </Typography>
                    <Typography variant="caption" display="block" sx={{ mt: 2 }}>
                        By {blog.author?.username || "Unknown"}
                    </Typography>
                </CardContent>
            </CardActionArea>
        </Card>
    );
};

export default BlogCard;
