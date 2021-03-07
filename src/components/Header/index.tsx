import React from 'react';
import { 
  AppBar, Avatar, Box, Button, IconButton, Link, Toolbar, Typography
} from '@material-ui/core';
import AccountCircle from '@material-ui/icons/AccountCircle'

import { useAuth } from '../../hooks/auth';
import useStyles from './styles';
import { ArrowBack } from '@material-ui/icons';

interface IProps {
  arrow?: boolean;
}


const Header: React.FC<IProps> = ({ arrow=false }) => {
  const classes = useStyles();
  const { user } = useAuth()

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" className={classes.title} >
          <Link href="/" color="inherit">
            {arrow && <ArrowBack fontSize="small" /> }
            Agenda
          </Link>
        </Typography>
        { user ? (
          <div>
          <IconButton
            aria-label="account of current user"
            color="inherit"
            href="/perfil"
          > 
            <Box mr={2}>
              <Typography>{user.name}</Typography>
            </Box>
            <Avatar alt={user.name} src={user.photo} />
          </IconButton>
          
        </div>
        ) : (
          <>
            <Box mr={2}>
              <Button color="inherit" href="signin">Entrar</Button>
            </Box>
            <Button variant="contained" href="signup">Registre-se</Button>
          </>
        )}        
      </Toolbar>
    </AppBar>
  );
}

export default Header;