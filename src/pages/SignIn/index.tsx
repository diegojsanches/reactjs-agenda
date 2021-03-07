import React, { useCallback } from 'react';

import {
  Avatar, Box, Button, Container, Grid, Link, TextField, Typography
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOpenOutlined';
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";

import { useHistory } from 'react-router-dom';
import Copyright from '../../components/Copyright';
import useStyles from './styles';
import { useAuth } from '../../hooks/auth';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/toast';

interface ISignInFormData {
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: Yup.string().required('Senha obrigatória'),
});

const SignIn: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToast();
  const { register, handleSubmit, formState: { errors } } = useForm<ISignInFormData>({
    resolver: yupResolver(schema)
  });

  const { signIn } = useAuth();

  const onSubmit = useCallback(
    async (data: ISignInFormData) => {
      try {
        await signIn({
          email: data.email,
          password: data.password,
        });

        history.push('/');
      } catch (err) {
        addToast({
          type: 'error',
          title: 'Erro na autenticação',
          description: 'Ocorreu um erro ao fazer login, cheque as credenciais.',
        });
      }
    },
    [signIn, history, addToast],
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
            autoFocus
            inputRef={ register }
            error={!!errors.email}
            helperText={errors.email?.message}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            inputRef={ register }
            error={!!errors.password}
            helperText={errors.password?.message}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
          >
            Entrar
          </Button>
          <Grid container>
            <Grid item xs>
              <Link href="#" variant="body2">
                Esqueceu a senha?
              </Link>
            </Grid>
            <Grid item>
              <Link href="signup" variant="body2">
                Ainda não tem uma conta? Registre-se
              </Link>
            </Grid>
          </Grid>
        </form>
      </div>
      <Box mt={8}>
        <Copyright />
      </Box>

    </Container>
  );
};

export default SignIn;