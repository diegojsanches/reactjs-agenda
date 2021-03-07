import React, { useEffect, useState } from 'react';
import PermContactCalendarIcon from '@material-ui/icons/PermContactCalendar';
import { 
  Avatar,
  Container, IconButton, Paper, Table, TableBody, TableCell, TableContainer, 
  TableHead, TablePagination, TableRow, TextField, Typography 
} from '@material-ui/core';
import AddIcon from '@material-ui/icons/Add';

import api from '../../services/api';
import Header from '../../components/Header';
import DashboardTableRow from '../../components/DashboardTableRow';

import { IContact } from '../Contact';
import { Visibility, VisibilityOff } from '@material-ui/icons';
import { useAuth } from '../../hooks/auth';


export interface IContactTableColumn {
  id: 'image' | 'name' | 'email' | 'fone' | 'is_public';
  label: string;
  minWidth?: number;
  align?: 'right';
  invisible?: boolean;
  render?: (row: IContact) => JSX.Element
}

const columns: IContactTableColumn[] = [
  // { id: 'image', label: 'Image', invisible: true },
  { id: 'image', label: '', render: (row) => <Avatar alt={row.name} src={row.image || '/broken-image.jpg'} />},
  { id: 'name', label: 'Contato', minWidth: 170 },
  { id: 'email', label: 'E-mail', minWidth: 170 },
  { id: 'fone', label: 'Fone', minWidth: 170 },
  { id: 'is_public', label: '', render: (row) => row.is_public ? <Visibility /> : <VisibilityOff /> },
];

interface Data {
  count: number;
  results: Array<IContact>;
}

const Dashboard: React.FC = () => {
  const { user } = useAuth()
  const [search, setSearch] = useState('')
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [rows, setRows] = useState<Data>({count:0, results:[]})

  const handleChangePage = (event: unknown, newPage: number) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event: React.ChangeEvent<HTMLInputElement>) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };

  useEffect(() => {
    api.get('contact/', {
      params: {
        search,
        page: page+1,
        page_size: rowsPerPage,
      }
    }).then(({ data }) => {
      setRows(data)
    })
  }, [page, rowsPerPage, search])

  return (
    <>
      <Header />
      <Container>
        <Typography variant="h2" gutterBottom>
          <PermContactCalendarIcon fontSize="large" /> Agenda online
        </Typography>
        <Typography variant="body1">
          {!user ? (
            'Aqui você tem acesso aos contatos adicionados publicamente. Registre-se para criar a sua lista de contatos'
          ) : (
            `Todos seus contatos estão listados abaixo`
          )}
        </Typography>
        <form>
          <TextField
            label="Buscar Contato"
            name="search" 
            value={search} 
            onChange={(e) => setSearch(e.target.value)}
            fullWidth
            margin="normal"
            variant="outlined"
          />
        </form>
        <Paper >
          <TableContainer>
            <Table stickyHeader aria-label="sticky table">
              <TableHead>
                <TableRow>
                  <TableCell />                  
                  {columns.map((column) => (
                    <TableCell
                      key={column.id}
                      align={column.align}
                      style={{ minWidth: column.minWidth }}
                    >
                      {column.label}
                    </TableCell>
                  ))}
                  <TableCell>
                    { user && <IconButton href={`/contact/`}><AddIcon /></IconButton> }
                  </TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.results.map((row) => 
                  <DashboardTableRow row={row} columns={columns}/>
                )}
              </TableBody>
            </Table>
          </TableContainer>
          <TablePagination
            rowsPerPageOptions={[10, 25, 100]}
            component="div"
            count={rows.count}
            rowsPerPage={rowsPerPage}
            page={page}
            onChangePage={handleChangePage}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        </Paper>
      </Container>
    </>
  );
};

export default Dashboard;