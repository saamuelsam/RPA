import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { FaUser, FaLock } from 'react-icons/fa';
import { TextField, Button, Box, Typography, Container, CircularProgress, Link as MuiLink } from '@mui/material';
import { AuthContext } from '../../contexts/authContext';
import logo from '../assets/image.png'; // Certifique-se de ajustar o caminho da imagem corretamente

function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const { setAuthData } = useContext(AuthContext);

  useEffect(() => {
    if (localStorage.getItem('sessionExpired')) {
      setErrorMessage('Sessão expirada. Faça login novamente.');
      localStorage.removeItem('sessionExpired');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post('/api/auth/login', { username, password });
      if (response.data.token) {
        localStorage.setItem('authToken', response.data.token);
        setAuthData(response.data.token);
        window.location.href = '/dashboard';
      } else {
        setErrorMessage('Usuário ou senha incorretos');
      }
    } catch (error) {
      setErrorMessage('Erro de conexão com a API ou credenciais inválidas');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          backgroundColor: '#f1f1f1',
          padding: '30px',
          borderRadius: '8px',
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)',
        }}
      >
        {/* Logo da empresa */}
        <img src={logo} alt="Orgânicos da Fátima" style={{ width: '150px', marginBottom: '20px' }} />
        
        <Typography component="h1" variant="h5">
          Bem-vindo ao RPA OF!
        </Typography>
        {errorMessage && <Typography color="error">{errorMessage}</Typography>}
        {loading && <CircularProgress sx={{ my: 2 }} />}
        <Box component="form" onSubmit={handleSubmit} sx={{ mt: 1 }}>
          {/* Campo de Usuário */}
          <TextField
            margin="normal"
            fullWidth
            id="username"
            label="Usuário"
            name="username"
            autoComplete="username"
            autoFocus
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            InputProps={{
              startAdornment: <FaUser style={{ marginRight: 8 }} />,
            }}
          />
          {/* Campo de Senha */}
          <TextField
            margin="normal"
            fullWidth
            name="password"
            label="Senha"
            type="password"
            id="password"
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            InputProps={{
              startAdornment: <FaLock style={{ marginRight: 8 }} />,
            }}
          />

          {/* Botão de Login */}
          <Button
            type="submit"
            fullWidth
            variant="contained"
            sx={{ mt: 3, mb: 2, backgroundColor: '#336636', '&:hover': { backgroundColor: '#285228' } }}
            disabled={loading}
          >
            {loading ? 'Entrando...' : 'Entrar'}
          </Button>

          {/* Opções adicionais */}
          <Box display="flex" justifyContent="space-between">
            <MuiLink href="/forgot-password" variant="body2">
              Esqueceu a senha?
            </MuiLink>
            <MuiLink href="/register" variant="body2">
              Criar conta
            </MuiLink>
          </Box>
        </Box>
      </Box>
    </Container>
  );
}

export default Login;
