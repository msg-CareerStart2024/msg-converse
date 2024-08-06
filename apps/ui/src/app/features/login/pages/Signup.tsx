import { SignupFormValues, signUpSchema } from '../../../types/users/signup.types';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';

export default function Signup() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<SignupFormValues>({
        resolver: zodResolver(signUpSchema)
    });

    const onSubmit: SubmitHandler<SignupFormValues> = data => {
        alert('Sign up not yet implemented');
    };

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
                <Grid item xs={12} component="form" onSubmit={handleSubmit(onSubmit)}>
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
                </Grid>
                <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
                    Sign Up
                </Button>
                <Grid item xs={12} style={{ textAlign: 'right', width: '100%' }}>
                    <Typography variant="body2">
                        <Link href="/login">Already have an account? Sign in</Link>
                    </Typography>
                </Grid>
            </Box>
        </Container>
    );
}
