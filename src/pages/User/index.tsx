import React, { useEffect, useCallback, useRef, useState } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';

import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';
import { Avatar, Badge, Box, Button, Container, Divider, IconButton, TextField } from '@material-ui/core';
import { useForm } from 'react-hook-form';
import ExitToAppIcon from '@material-ui/icons/ExitToApp';
import useStyles from '../User/styles';
import { PhotoCameraTwoTone } from '@material-ui/icons';

interface IProfile {
  id: string;
  name: string;
  email: string;
  photo?: string;
  old_password: number;
  password: number;
  new_password: number;
}

const Profile: React.FC = () => {
  const imageInputRef = useRef<HTMLInputElement | null>(null)
  const [photo, setPhoto] = useState<string | ArrayBuffer | null | undefined>()
  const { user, signOut, updateUser } = useAuth();
  const { addToast } = useToast();
  const classes = useStyles()
  const { 
    register, handleSubmit, reset, formState: { errors }, setError
  } = useForm();

  const {register: imageRegister, handleSubmit: imageHandleSubmit} = useForm()

  useEffect(() => {
    let userParser = {...user};
    setPhoto(userParser.photo)
    delete userParser['photo'];
    reset(userParser);
  }, [reset, user]);

  const onSubmit = useCallback(
    async data => {
      try {
        const response = await api.put(`user/${user.id}/`, data);
        updateUser(response.data)
        addToast({
          type: 'success',
          title: 'Perfil salvo com sucesso',
        });
      } catch (err) {
        Object.entries(err.response.data).forEach(
          ([key, value]) => {
            const optionError = {message: (value as Array<string>)[0]}
            setError(key as keyof IProfile, optionError);
          }
        )

        addToast({
          type: 'error',
          title: 'Erro ao salvar perfil',
          description: 'Ocorreu um erro ao tentar salvar perfil.',
        });
      }
    },
    [addToast, setError, user, updateUser],
  );

  const onImageSubmit = useCallback(async (data) => {
    const formData = new FormData();
    formData.append("photo", data.photo[0]);
    const response = await api.patch(`user/${user.id}/`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    })

    updateUser(response.data)
  }, [user?.id, updateUser])

  const handleSelectImage = (e:any) => {
    const [file] = e.target.files;
    if (file) {
      const reader = new FileReader();
      reader.onload = e => {
        setPhoto(e.target?.result);
      };
      reader.readAsDataURL(file);
    }
  }

  return (
    <>
      <Header arrow/>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
          <Badge
            overlap="circle"
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            badgeContent={(
              <form onSubmit={imageHandleSubmit(onImageSubmit)}>
                <input 
                  accept="image/*" 
                  name="photo"
                  className={classes.uploadInput} 
                  ref={(e) => {
                    imageRegister(e);
                    imageInputRef.current = e
                  }}
                  onChange={(e) => {
                    imageHandleSubmit(onImageSubmit)(e)
                    handleSelectImage(e)
                  }}
                  id="icon-button-file" 
                  type="file" 
                />  
                <IconButton 
                  color="primary" 
                  aria-label="upload picture" 
                  onClick={() => imageInputRef.current?.click()}
                >
                  <PhotoCameraTwoTone fontSize="large" />
                </IconButton>
              </form>
            )}
          >
            <Avatar alt={user.name} src={photo as string} className={classes.large}/>
          </Badge>
          <form noValidate onSubmit={handleSubmit(onSubmit)}>
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              name="name"
              label="Nome"
              type="text"
              id="name"
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
            <Divider />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="old_password"
              label="Senha antiga"
              type="password"
              id="old_password"
              inputRef={ register }
              error={!!errors.old_password}
              helperText={errors.old_password?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password"
              label="Nova senha"
              type="password"
              id="password"
              inputRef={ register }
              error={!!errors.password}
              helperText={errors.password?.message}
            />
            <TextField
              variant="outlined"
              margin="normal"
              fullWidth
              name="password_confirmation"
              label="Confirmação de senha"
              type="password"
              id="password_confirmation"
              inputRef={ register }
              error={!!errors.password_confirmation}
              helperText={errors.password_confirmation?.message}
            />
            <Box mt={2} mb={2}>
              <Button 
                type="submit"
                fullWidth
                variant="contained"
                color="primary"
              >
                Salvar
              </Button>
            </Box>
          </form>
        </div>
        <Divider />
        <Box mt={2}>
          <Button 
            fullWidth
            variant="contained"
            color="secondary"
            endIcon={<ExitToAppIcon />}
            onClick={signOut}
          >
            Sair
          </Button>
        </Box>
      </Container>
    </>
  );
};

export default Profile;