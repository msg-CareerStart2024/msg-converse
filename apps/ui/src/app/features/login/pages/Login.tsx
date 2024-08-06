import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { SubmitHandler, useForm } from 'react-hook-form';
import { Avatar, Box, Button, Container, Grid, Link, TextField, Typography } from '@mui/material';
import { LockOutlined } from '@mui/icons-material';
import { emailSchemaCheck, passwordSchemaCheck } from '../../../types/users/login';

const userSchema = z.object({
    email: emailSchemaCheck,
    password: passwordSchemaCheck
});

type UserFormValues = z.infer<typeof userSchema>;

export default function Login() {
    const {
        register,
        handleSubmit,
        formState: { errors }
    } = useForm<UserFormValues>({
        resolver: zodResolver(userSchema)
    });

    const onSubmit: SubmitHandler<UserFormValues> = data => {
        alert('Login not yet implemented');
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
                <Avatar sx={{ m: 1, bgcolor: 'primary.main' }}>
                    <LockOutlined />
                </Avatar>
                <Typography component="h1" variant="h5">
                    Sign in
                </Typography>
                <Box component="form" onSubmit={handleSubmit(onSubmit)} noValidate sx={{ mt: 1 }}>
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
