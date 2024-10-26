import React, { useState, useEffect } from 'react';
import { Box, Container, Typography, Button, IconButton, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, TextField } from '@mui/material';
import { FaTrash, FaEdit, FaUserPlus } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const UserManagement = () => {
  const [users, setUsers] = useState([]); // Estado para armazenar a lista de usuários
  const [open, setOpen] = useState(false); // Estado para controlar o diálogo de edição
  const [editUser, setEditUser] = useState(null); // Estado para o usuário a ser editado

  // Buscar todos os usuários ao carregar o componente
  useEffect(() => {
    fetchUsers();
  }, []);

  // Função para buscar usuários da API
  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/users', {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
    }
  };

  // Função para excluir um usuário
  const handleDelete = async (id) => {
    try {
      await fetch(`http://localhost:5000/api/users/${id}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      });
      fetchUsers(); // Atualizar a lista de usuários após a exclusão
    } catch (error) {
      console.error('Erro ao excluir usuário:', error);
    }
  };

  // Função para abrir o diálogo de edição e definir o usuário a ser editado
  const handleEditClick = (user) => {
    setEditUser(user);
    setOpen(true);
  };

  // Função para atualizar um usuário
  const handleUpdateUser = async () => {
    try {
      await fetch(`http://localhost:5000/api/users/${editUser.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify(editUser),
      });
      setOpen(false);
      fetchUsers(); // Atualizar a lista de usuários após a edição
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
    }
  };

  return (
    <Container component="main" maxWidth="lg">
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 2 }}>
        <Typography component="h1" variant="h4">
          Gerenciamento de Usuários
        </Typography>
        <Button component={Link} to="/create-user" variant="contained" startIcon={<FaUserPlus />} sx={{ backgroundColor: '#A1BA30', '&:hover': { backgroundColor: '#336636' } }}>
          Criar Novo Usuário
        </Button>
      </Box>

      {/* Tabela de usuários */}
      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>ID</TableCell>
              <TableCell>Nome de Usuário</TableCell>
              <TableCell>Papel</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map((user) => (
              <TableRow key={user.id}>
                <TableCell>{user.id}</TableCell>
                <TableCell>{user.username}</TableCell>
                <TableCell>{user.role}</TableCell>
                <TableCell>
                  <IconButton onClick={() => handleEditClick(user)}>
                    <FaEdit color="#A1BA30" />
                  </IconButton>
                  <IconButton onClick={() => handleDelete(user.id)}>
                    <FaTrash color="#FF0000" />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Diálogo de edição de usuário */}
      {editUser && (
        <Dialog open={open} onClose={() => setOpen(false)}>
          <DialogTitle>Editar Usuário</DialogTitle>
          <DialogContent>
            <DialogContentText>Edite as informações do usuário abaixo.</DialogContentText>
            <TextField
              autoFocus
              margin="dense"
              label="Nome de Usuário"
              fullWidth
              value={editUser.username}
              onChange={(e) => setEditUser({ ...editUser, username: e.target.value })}
            />
            <TextField
              margin="dense"
              label="Papel"
              fullWidth
              value={editUser.role}
              onChange={(e) => setEditUser({ ...editUser, role: e.target.value })}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setOpen(false)}>Cancelar</Button>
            <Button onClick={handleUpdateUser} variant="contained" sx={{ backgroundColor: '#A1BA30', '&:hover': { backgroundColor: '#336636' } }}>
              Atualizar
            </Button>
          </DialogActions>
        </Dialog>
      )}
    </Container>
  );
};

export default UserManagement;
