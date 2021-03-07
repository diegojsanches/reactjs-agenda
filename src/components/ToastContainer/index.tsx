import React from 'react';
import { Snackbar } from '@material-ui/core';
import Alert from '@material-ui/lab/Alert';

import { useToast, ToastMessage } from '../../hooks/toast';
import { AlertTitle } from '@material-ui/lab';

interface ToastContainerProps {
  messages: ToastMessage[];
}

const ToastContainer: React.FC<ToastContainerProps> = ({ messages }) => {
  const { removeToast } = useToast()

  const handleClose = (id:string) => {
    removeToast(id);
  }

  return (
    <>
      {messages.map((item) => (
        <Snackbar
          anchorOrigin={{ vertical:'top', horizontal:'right' }}
          open
          onClose={() => handleClose(item.id)}
          autoHideDuration={3000}
          key={item.id}
        >
          <Alert onClose={() => handleClose(item.id)} severity={item.type || 'info'}>
            <AlertTitle>{item.title}</AlertTitle>
            {item.description}
          </Alert>
        </Snackbar>
      ))}
    </>
  );
};

export default ToastContainer;