import { Box, Button, Container, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const NotFoundPage = () => {
    const navigate = useNavigate();

    const handleGoHome = () => {
        navigate('/'); // Navigate back to the home page
    };

    return (
        <Container
            maxWidth="md"
            sx={{ textAlign: 'center', alignItems: 'center', display: 'flex', height: '100vh' }}
        >
            <Box>
                <Typography variant="h1" component="h1" gutterBottom>
                    404
                </Typography>
                <Typography variant="h5" component="h2" gutterBottom>
                    Oops! The page you're looking for doesn't exist.
                </Typography>
                <Typography variant="body1" gutterBottom>
                    It seems that the page you were trying to reach doesn't exist anymore, or maybe
                    it has just moved.
                </Typography>
                <Box mt={4}>
                    <Button variant="contained" color="primary" onClick={handleGoHome}>
                        Go to Home
                    </Button>
                </Box>
            </Box>
        </Container>
    );
};

export default NotFoundPage;
