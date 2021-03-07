import React, { useEffect, useCallback, useRef, useState } from 'react';

import api from '../../services/api';

import Header from '../../components/Header';

import { useToast } from '../../hooks/toast';
import { Avatar, Badge, Box, Button, Checkbox, Container, Divider, FormControlLabel, IconButton, InputAdornment, TextField, Tooltip } from '@material-ui/core';
import { useFieldArray, useForm } from 'react-hook-form';
import useStyles from '../User/styles';
import { DeleteForever, PhotoCameraTwoTone, Search } from '@material-ui/icons';
import { useParams } from 'react-router';
import axios from 'axios';

interface IContactAddress {
  pk: string;
  zip_code: string;
  street: string;
  number: string;
  complement: string;
  district: string;
  city: string;
  state: string;
}

export interface IContact {
  pk: string;
  name: string;
  email: string;
  fone: string;
  is_public: boolean;
  image?: string;
  owner_id: string;
  addresses: Array<IContactAddress>;
}

const Contact: React.FC = () => {
  const classes = useStyles()
  const { contactId } = useParams<{ contactId: string | undefined }>();
  const { addToast } = useToast();
  const { 
    register, handleSubmit, reset, getValues, setValue, errors, control, setError
  } = useForm();
  const {fields, append, remove } = useFieldArray({
    control,
    name: 'addresses'
  })
  const [contact, setContact] = useState<IContact | null>(null)
  
  useEffect(() => {
    if (contactId){
      api.get(`contact/${contactId}/`).then((response) => {
        const contactParsed = response.data;
        setContact(contactParsed);
        reset(response.data)
      })

    }
  }, [contactId, reset]);

  const saveContact = useCallback((params) => 
    contact?.pk ? api.put(`/contact/${contact.pk}/`, params) :api.post('/contact/', params), 
    [contact]
  )
  
  const onSubmit = useCallback(
    async data => {
      try {
        const { data: response } = await saveContact(data);
        setContact( response );
        reset( response );
        addToast({
          type: 'success',
          title: 'Contato salvo com sucesso',
        });
      } catch (err) {
        Object.entries(err.response.data).forEach(
          ([key, value]) => {
            const optionError = {message: (value as Array<string>)[0]}
            setError(key as keyof IContact, optionError);
          }
        )

        addToast({
          type: 'error',
          title: 'Erro ao salvar perfil',
          description: 'Ocorreu um erro ao tentar salvar perfil.',
        });
      }
    },
    [saveContact, reset, addToast, setError],
  );

  const handleZipCode = useCallback(async (addressIndex) => {
    try {
      const { data } = await axios.get(
        `http://viacep.com.br/ws/${getValues(`addresses[${addressIndex}].zip_code`)}/json/`
      );
      setValue(`addresses[${addressIndex}].zip_code`, data.cep)
      setValue(`addresses[${addressIndex}].street`, data.logradouro)
      setValue(`addresses[${addressIndex}].district`, data.bairro)
      setValue(`addresses[${addressIndex}].city`, data.localidade)
      setValue(`addresses[${addressIndex}].state`, data.uf)
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao buscar cep',
      })
    }
  }, [addToast, getValues, setValue]);

  return (
    <>
      <Header arrow/>
      <Container component="main" maxWidth="sm">
        <div className={classes.paper}>
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
            />
            <TextField
              variant="outlined"
              margin="normal"
              required
              fullWidth
              id="fone"
              label="Telefone"
              name="fone"
              autoComplete="fone"
              inputRef={ register }
            />
            <FormControlLabel
              control={<Checkbox />}
              label="Tornar público"
              name="is_public"
              inputRef={register}
            />
            { fields.map((item, index) => {
              return (
                <Box key={item.id}>
                  <input 
                    type="hidden" 
                    ref={ register } 
                    name={`addresses[${index}].pk`}
                    defaultValue={item.pk || ''}
                  />
                  <Divider />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].zip_code`}
                    label="CEP"
                    name={`addresses[${index}].zip_code`}
                    inputRef={ register }
                    defaultValue={item.zip_code || ''}
                    InputProps={{
                      endAdornment: (
                        <InputAdornment position="end">
                          <Tooltip title="Pesquisar CEP">
                            <IconButton
                              aria-label="Pesquisar CEP"
                              onClick={() => handleZipCode(index)}
                            >
                              <Search />
                            </IconButton>
                          </Tooltip>
                          <Tooltip title="Remover endereço">
                            <IconButton
                              aria-label="Remover endereço"
                              onClick={() => remove()}
                            >
                              <DeleteForever />
                            </IconButton>
                          </Tooltip>
                        </InputAdornment>
                      ),
                    }}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].street`}
                    label="Rua"
                    name={`addresses[${index}].street`}
                    autoComplete="street"
                    inputRef={ register }
                    defaultValue={item.street || ''}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].number`}
                    label="Número"
                    name={`addresses[${index}].number`}
                    autoComplete="street"
                    inputRef={ register }
                    defaultValue={item.number || ''}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].complement`}
                    label="Complemento"
                    name={`addresses[${index}].complement`}
                    autoComplete="complement"
                    inputRef={ register }
                    defaultValue={item.complement || ''}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].district`}
                    label="Bairro"
                    name={`addresses[${index}].district`}
                    autoComplete="district"
                    inputRef={ register }
                    defaultValue={item.district || ''}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].city`}
                    label="Cidade"
                    name={`addresses[${index}].city`}
                    autoComplete="city"
                    inputRef={ register }
                    defaultValue={item.city || ''}
                  />
                  <TextField
                    variant="outlined"
                    margin="normal"
                    required
                    fullWidth
                    id={`addresses[${index}].state`}
                    label="Estado"
                    name={`addresses[${index}].state`}
                    autoComplete="state"
                    inputRef={ register }
                    defaultValue={item.state || ''}
                  />
                </Box>
              )
            })}
            <Divider />
            <Box mt={2} mb={2}>
              <Button 
                type="button"
                fullWidth
                variant="contained"
                onClick={() => {
                  append({pk:'', zip_code:'', street:''})
                }}
              >
                Adicionar endereço
              </Button>
            </Box>
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
      </Container>
    </>
  );
};

export default Contact;