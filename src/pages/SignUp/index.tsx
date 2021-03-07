import React, { useCallback } from 'react';

import {
  Avatar, Box, Button, Container, Grid, Link, TextField, Typography 
} from '@material-ui/core';
import LockOutlinedIcon from '@material-ui/icons/LockOutlined'
import { yupResolver } from '@hookform/resolvers/yup';
import * as Yup from "yup";

import { useHistory } from 'react-router';
import Copyright from '../../components/Copyright';
import useStyles from './styles';
import api from '../../services/api';
import { useForm } from 'react-hook-form';
import { useToast } from '../../hooks/toast';

interface ISignUpFormData {
  name: string;
  email: string;
  password: string;
}

const schema = Yup.object().shape({
  name: Yup.string().required('Nome obrigatório'),
  email: Yup.string()
    .required('E-mail obrigatório')
    .email('Digite um e-mail válido'),
  password: Yup.string().min(6, 'No mínio 6 dígitos'),
});

const SignUp: React.FC = () => {
  const classes = useStyles();
  const history = useHistory();
  const { addToast } = useToast();
  const { 
    register, handleSubmit, formState: { errors }, setError
  } = useForm<ISignUpFormData>({
    resolver: yupResolver(schema)
  });

  const onSubmit = useCallback(
    async (data: ISignUpFormData) => {
      try {
        await api.post('/user/register/', data);

        history.push('/');

        addToast({
          type: 'success',
          title: 'Cadastro realizado!',
          description: 'Você já pode fazer seu logon na Agenda!',
        });
      } catch (err) {
        Object.entries(err.response.data).forEach(
          ([key, value]) => {
            const optionError = {message: (value as Array<string>)[0]}
            setError(key as keyof ISignUpFormData, optionError);
          }
        )

        addToast({
          type: 'error',
          title: 'Erro no cadastro',
          description: 'Ocorreu um erro ao fazer cadastro, tente novamente.',
        });
      }
    },
    [addToast, history, setError],
  );

  return (
    <Container component="main" maxWidth="xs">
      <div className={classes.paper}>
        <Avatar>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Registro
        </Typography>
        <form noValidate onSubmit={handleSubmit(onSubmit)}>
          <TextField
            autoComplete="fname"
            name="name"
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="Name"
            label="Nome"
            autoFocus
            inputRef={ register }
            error={!!errors.name}
            helperText={errors.name?.message}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            id="email"
            label="Email"
            name="email"
            autoComplete="email"
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
            className={classes.submit}
          >
            Sign Up
          </Button>
          <Grid container>
            <Grid item>
              <Link href="signin" variant="body2">
                Já possui uma conta? Entre
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
}

export default SignUp;
