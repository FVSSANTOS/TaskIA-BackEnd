const userServices = require('../services/userServices');

exports.registerUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const newUser = await userServices.register(username, password);
    res.status(201).json({ message: 'Usuário registrado com sucesso!', user: newUser });
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await userServices.login(username, password);
    res.status(200).json({ message: 'Login realizado com sucesso!', user });
  } catch (error) {
    res.status(401).json({ error: error.message });
  }
};
