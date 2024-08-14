import { LockOutlined } from '@mui/icons-material';
import {
    Alert,
    alpha,
    Avatar,
    Box,
    Button,
    Container,
    Grid,
    LinearProgress,
    Link,
    TextField,
    Typography,
    useTheme
} from '@mui/material';
import { SerializedError } from '@reduxjs/toolkit';
import { FetchBaseQueryError } from '@reduxjs/toolkit/query';
import { FieldErrors, UseFormRegister } from 'react-hook-form';
import { SignupFormValues } from '../../../types/users/SignUpFormValues.types';

type SignUpFormProps = {
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<SignupFormValues>;
    errors: FieldErrors<SignupFormValues>;
    registerError?: FetchBaseQueryError | SerializedError;
    isLoading: boolean;
};

export default function SignUpFormView({
    handleSubmit,
    errors,
    register,
    registerError,
    isLoading
}: SignUpFormProps) {
    const theme = useTheme();
    return (
        <Container component="main" maxWidth="xs" sx={{ mt: 25 }}>
            <Box
                sx={{
                    marginTop: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center'
                }}
            >
                <Grid item xs={12}>
                    <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                            <LockOutlined />
                        </Avatar>
                        <Typography component="h1" variant="h5">
                            Sign up
                        </Typography>
                    </Box>
                </Grid>
                <Grid item xs={12} component="form" onSubmit={handleSubmit}>
                    <Grid container spacing={2}>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="firstName"
                                label="First Name"
                                autoFocus
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                {...register('firstName')}
                            />
                        </Grid>
                        <Grid item xs={6}>
                            <TextField
                                margin="normal"
                                required
                                fullWidth
                                id="lastName"
                                label="Last Name"
                                error={!!errors.firstName}
                                helperText={errors.firstName?.message}
                                {...register('lastName')}
                            />
                        </Grid>
                    </Grid>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        error={!!errors.email}
                        helperText={errors.email?.message}
                        {...register('email')}
                    />
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        label="Password"
                        type="password"
                        id="password"
                        error={!!errors.password}
                        helperText={errors.password?.message}
                        {...register('password')}
                    />
                    <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                        Sign Up
                    </Button>
                </Grid>

                {isLoading && (
                    <LinearProgress
                        sx={{
                            mb: 2,
                            bgcolor: alpha(theme.palette.secondary.main, 0.5),
                            '& .MuiLinearProgress-bar': {
                                backgroundColor: 'secondary.main'
                            }
                        }}
                    />
                )}
                {registerError && (
                    <Alert severity="error" sx={{ mb: 2 }}>
                        An error occured, please try again.
                    </Alert>
                )}
                <Grid item xs={12} style={{ textAlign: 'right', width: '100%' }}>
                    <Typography variant="body2">
                        <Link href="/login">Already have an account? Sign in</Link>
                    </Typography>
                </Grid>
            </Box>
        </Container>
    );
}
