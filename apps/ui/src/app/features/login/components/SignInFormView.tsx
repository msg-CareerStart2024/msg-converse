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
import { LoginFormValues } from '../../../types/users/login.types';
import React from 'react';

type SignInFormProps = {
    handleSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
    register: UseFormRegister<LoginFormValues>;
    errors: FieldErrors<LoginFormValues>;
    loginError?: FetchBaseQueryError | SerializedError;
    isLoading: boolean;
};

export default function SignInFormView({
    handleSubmit,
    errors,
    register,
    loginError,
    isLoading
}: SignInFormProps) {
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
                    <TextField
                        margin="normal"
                        required
                        fullWidth
                        id="email"
                        label="Email"
                        autoFocus
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
                        Sign In
                    </Button>
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
                    {loginError && (
                        <Alert severity="error" sx={{ mb: 2 }}>
                            Invalid email or password.
                        </Alert>
                    )}
                    <Grid item xs={12} style={{ textAlign: 'left', width: '100%' }}>
                        <Typography variant="body2">
                            <Link href="/signup">Don't have an account? Sign Up</Link>
                        </Typography>
                    </Grid>
                </Box>
            </Box>
        </Container>
    );
}
