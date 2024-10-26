import React, { useState, useEffect, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  AppBar,
  Box,
  Toolbar,
  Typography,
  Button,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from '@mui/material';
import { FaUsers, FaChartLine, FaCogs, FaFileAlt, FaSignOutAlt, FaUserCircle } from 'react-icons/fa';
import Chart from 'chart.js/auto';
import { AuthContext } from '../contexts/authContext'; // Importar o contexto de autenticação
import './css/Dashboard.css';

function Dashboard() {
  const [userRole, setUserRole] = useState('admin');
  const [username, setUsername] = useState('');
  const [open, setOpen] = useState(false); // Estado para controlar o menu lateral
  const [dialogOpen, setDialogOpen] = useState(false); // Estado para controlar o diálogo de logout
  const { setAuthData } = useContext(AuthContext); // Acessar o contexto de autenticação
  const navigate = useNavigate();

  useEffect(() => {
    // Obter informações do usuário a partir do token armazenado
    const token = localStorage.getItem('authToken');
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split('.')[1]));
        setUsername(decodedToken.username);
        setUserRole(decodedToken.role);
      } catch (error) {
        console.error('Erro ao decodificar o token:', error);
      }
    }
  }, []);

  useEffect(() => {
    // Exemplo de configuração do gráfico
    const ctx = document.getElementById('myChart').getContext('2d');
    
    let chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Usuários Ativos',
            data: [30, 50, 80, 60, 90],
            borderColor: '#336636',
            borderWidth: 2,
            fill: false,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: true,
          },
        },
      },
    });

    // Cleanup: destruir o gráfico ao desmontar ou recriar
    return () => {
      chartInstance.destroy();
    };
  }, []);

  // Função para lidar com logout e redirecionar para a página de login
  const handleLogout = () => {
    localStorage.removeItem('authToken');
    setAuthData(null); // Limpa o contexto de autenticação
    setDialogOpen(false);
    navigate('/login');
  };

  return (
    <Box sx={{ display: 'flex' }}>
      {/* Barra de navegação superior */}
      <AppBar position="fixed" sx={{ zIndex: 1201 }}>
        <Toolbar>
          <Typography variant="h6" noWrap sx={{ flexGrow: 1 }}>
            Dashboard
          </Typography>
          <Button color="inherit" onClick={() => setOpen(!open)}>
            <FaUserCircle /> {username}
          </Button>
          <Button color="inherit" onClick={() => setDialogOpen(true)}>
            <FaSignOutAlt /> Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* Menu lateral (Drawer) */}
      <Drawer
        variant="persistent"
        anchor="left"
        open={open}
        sx={{
          width: 250,
          flexShrink: 0,
          '& .MuiDrawer-paper': {
            width: 250,
            boxSizing: 'border-box',
            backgroundColor: '#336636',
            color: 'white',
          },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
              <ListItem component={Link} to="/overview" button>
          <ListItemIcon>
            <FaChartLine style={{ color: 'white' }} />
          </ListItemIcon>
          <ListItemText primary="Visão Geral" />
        </ListItem>

        {['admin', 'editor'].includes(userRole) && (
          <ListItem component={Link} to="/reports" button>
            <ListItemIcon>
              <FaFileAlt style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Relatórios" />
          </ListItem>
        )}

        {userRole === 'admin' && (
          <ListItem component={Link} to="/settings" button>
            <ListItemIcon>
              <FaCogs style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Configurações" />
          </ListItem>
        )}

        {userRole === 'admin' && (
          <ListItem component={Link} to="/users" button>
            <ListItemIcon>
              <FaUsers style={{ color: 'white' }} />
            </ListItemIcon>
            <ListItemText primary="Usuários" />
          </ListItem>
        )}
          </List>
        </Box>
      </Drawer>

      {/* Diálogo de confirmação de logout */}
      <Dialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">Confirmar Logout</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Tem certeza de que deseja sair?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} color="primary">
            Cancelar
          </Button>
          <Button onClick={handleLogout} color="secondary" autoFocus>
            Sair
          </Button>
        </DialogActions>
      </Dialog>

      {/* Conteúdo principal */}
      <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
        <Toolbar />
        <Typography variant="h4">Bem-vindo ao painel de controle!</Typography>
        <Typography variant="body1">
          Aqui você pode ver as informações mais relevantes do sistema.
        </Typography>

        {/* Cards com estatísticas */}
        <Box sx={{ display: 'flex', justifyContent: 'space-around', my: 3 }}>
          <Box sx={{ p: 2, backgroundColor: '#336636', color: 'white', borderRadius: '10px' }}>
            <Typography variant="h6">Usuários Ativos</Typography>
            <Typography variant="h4">150</Typography>
            <Button variant="contained" component={Link} to="/users" sx={{ mt: 2, backgroundColor: '#A1BA30' }}>
              Ver Mais
            </Button>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#336636', color: 'white', borderRadius: '10px' }}>
            <Typography variant="h6">Relatórios Criados</Typography>
            <Typography variant="h4">30</Typography>
            <Button variant="contained" component={Link} to="/reports" sx={{ mt: 2, backgroundColor: '#A1BA30' }}>
              Ver Mais
            </Button>
          </Box>
          <Box sx={{ p: 2, backgroundColor: '#336636', color: 'white', borderRadius: '10px' }}>
            <Typography variant="h6">Configurações</Typography>
            <Typography variant="h4">10</Typography>
            <Button variant="contained" component={Link} to="/settings" sx={{ mt: 2, backgroundColor: '#A1BA30' }}>
              Ver Mais
            </Button>
          </Box>
        </Box>

        {/* Gráfico de usuários */}
        <Box className="chart-container">
          <Typography variant="h6" sx={{ mb: 2 }}>
            Estatísticas de Usuários
          </Typography>
          <canvas id="myChart" style={{ height: '400px' }}></canvas>
        </Box>
      </Box>
    </Box>
  );
}

export default Dashboard;
