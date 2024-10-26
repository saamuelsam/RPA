// models/User.js
const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');
const sequelize = require('../config/db'); // Conexão com o banco de dados

// Definição do modelo de usuário
const User = sequelize.define('User', {
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true, // Validação para garantir que o email é válido
    },
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    // Não permitir que a senha seja retornada em consultas
    get() {
      return () => this.getDataValue('password');
    },
  },
  role: {
    type: DataTypes.STRING,
    allowNull: false,
    defaultValue: 'user', // Valor padrão do papel do usuário
  },
  createdAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
  updatedAt: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW,
  },
});

// Função para encontrar um usuário pelo email
User.findByEmail = async (email) => {
  return await User.findOne({ where: { email } });
};

// Função para comparar a senha enviada com a senha armazenada no banco
User.prototype.comparePassword = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Função estática para criar um usuário com senha criptografada
User.createUser = async (email, password, role = 'user') => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return await User.create({ email, password: hashedPassword, role });
};

// Hook Sequelize para criptografar a senha antes de criar no banco
User.beforeCreate(async (user) => {
  if (user.password) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

// Hook para atualizar a senha criptografada em atualizações de usuário
User.beforeUpdate(async (user) => {
  if (user.changed('password')) {
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(user.password, salt);
  }
});

module.exports = User;
