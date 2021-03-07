import { Box, Collapse, Divider, IconButton, TableCell, TableRow, Typography } from '@material-ui/core';
import React, { useCallback, useState } from 'react';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import EditIcon from '@material-ui/icons/Edit';
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';

import { IContactTableColumn } from '../../pages/Dashboard';
import { IContact } from '../../pages/Contact';
import api from '../../services/api';
import { useToast } from '../../hooks/toast';
import { useAuth } from '../../hooks/auth';

interface RowProps {
  row: IContact;
  columns: Array<IContactTableColumn>
}

function DashboardTableRow({ row, columns }: RowProps) {
  const [open, setOpen] = useState(false);
  const { addToast } = useToast();
  const { user } = useAuth()

  const handleDelete = useCallback(async (pk) => {
    try {
      await api.delete(`/contact/${row.pk}/`)
      addToast({
        type: 'info',
        title: 'Contato removido com sucesso',
      })
    } catch {
      addToast({
        type: 'error',
        title: 'Erro ao remover contato',
        description: 'Ocorreu um erro ao tentar remover contato.',
      });
    }
  }, [row, addToast])

  return (
    <>
      <TableRow>
        <TableCell>
          {row.addresses.length ? (
            <IconButton aria-label="expand row" size="small" onClick={() => setOpen(!open)}>
              {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
            </IconButton>
          ) : ''}
        </TableCell>
        {columns.map((column) => {
          const value = row[column.id];
          return (
            <TableCell key={`${row.pk}-${column.id}`} align={column.align}>
              {column.render ? column.render(row) : value}
            </TableCell>
          );
        })}
        <TableCell>
          { user && user.id === row.owner_id && (
            <>
              <IconButton href={`/contact/${row.pk}/`}><EditIcon /></IconButton>
              <IconButton onClick={handleDelete}><DeleteForeverIcon /></IconButton>
            </>
          )}
        </TableCell>
      </TableRow>
      {row.addresses.length ? (
        <TableRow>
          <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={7}>
            <Collapse in={open} timeout="auto" unmountOnExit>
              <Box margin={1}>
                <Typography variant="h6" gutterBottom component="div">
                  Endereços
                </Typography>
                {row.addresses.map(({zip_code, street, district, city, state }) => (
                  <>
                    <Divider />
                    <Typography>
                      {zip_code} - {street} - {district} - {city}/{state}
                    </Typography>
                  </>
                ))}
              </Box>
            </Collapse>
          </TableCell>
        </TableRow>
      ) : ''}
    </>
  );
}

export default DashboardTableRow;