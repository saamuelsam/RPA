import React, { useState } from 'react';
import { Box, TextField, Button, Typography, Container, Alert } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const CreateUser = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Função para lidar com a submissão do formulário
  const handleCreateUser = async () => {
    // Validação dos campos
    if (!username || !password || !role) {
      setError('Todos os campos são obrigatórios.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
        body: JSON.stringify({ username, password, role }),
      });

      if (!response.ok) {
        throw new Error('Erro ao criar o usuário.');
      }

      setSuccess('Usuário criado com sucesso!');
      setTimeout(() => {
        navigate('/users');
      }, 2000);
    } catch (error) {
      setError(error.message);
    }
  };

  return (
    <Container component="main" maxWidth="sm">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Typography component="h1" variant="h5" sx={{ mb: 2 }}>
          Criar Novo Usuário
        </Typography>

        {/* Mensagem de erro */}
        {error && <Alert severity="error">{error}</Alert>}

        {/* Mensagem de sucesso */}
        {success && <Alert severity="success">{success}</Alert>}

        {/* Formulário para criação de usuários */}
        <Box
          component="form"
          sx={{
            display: 'flex',
            flexDirection: 'column',
            gap: 2,
            width: '100%',
            mt: 1,
          }}
        >
          {/* Campo de Nome de Usuário */}
          <TextField
            required
            fullWidth
            label="Nome de Usuário"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            autoFocus
          />

          {/* Campo de Senha */}
          <TextField
            required
            fullWidth
            label="Senha"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          {/* Campo de Papel */}
          <TextField
            required
            fullWidth
            label="Papel"
            select
            SelectProps={{ native: true }}
            value={role}
            onChange={(e) => setRole(e.target.value)}
          >
            <option value="user">Usuário</option>
            <option value="admin">Admin</option>
            <option value="editor">Editor</option>
            <option value="viewer">Visualizador</option>
          </TextField>

          {/* Botão para criar o usuário */}
          <Button
            type="button"
            fullWidth
            variant="contained"
            onClick={handleCreateUser}
            sx={{ mt: 3, mb: 2, backgroundColor: '#A1BA30', '&:hover': { backgroundColor: '#336636' } }}
          >
            Criar Usuário
          </Button>

          {/* Botão para voltar */}
          <Button
            type="button"
            fullWidth
            variant="outlined"
            onClick={() => navigate('/users')}
            sx={{ mb: 2 }}
          >
            Voltar
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default CreateUser;
