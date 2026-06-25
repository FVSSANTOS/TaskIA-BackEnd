const fs = require('fs');
const path = require('path');
const usersFile = path.join(__dirname, '../user.json');

// ler usuários
function readUsers() {
  if (!fs.existsSync(usersFile)) return [];
  const data = fs.readFileSync(usersFile);
  return JSON.parse(data);
}

// salvar usuários
function saveUsers(users) {
  fs.writeFileSync(usersFile, JSON.stringify(users, null, 2));
}

// registrar usuário
exports.register = (username, password, email) => {
  const users = readUsers();
  const userExists = users.find(u => u.username === username);

  if (userExists) {
    throw new Error('Usuário já existe!');
  }

  const newUser = { id: Date.now(), username, password, email };
  users.push(newUser);
  saveUsers(users);

  return newUser;
};

// login de usuário
exports.login = (username, password) => {
  const users = readUsers();
  const user = users.find(u => u.username === username && u.password === password);

  if (!user) {
    throw new Error('Credenciais inválidas!');
  }

  return user;
};