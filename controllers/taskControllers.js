const taskService = require("../services/tasksServices");

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getTasks();
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler tarefas" });
  }
}

async function createTask(req, res) {
  try {
    const { titulo, descricao, prioridade, esforco } = req.body;
    if (!titulo)
      return res.status(400).json({ error: "O título é obrigatório" });

    const newTask = await taskService.createTask({
      titulo,
      descricao,
      prioridade,
      esforco,
    });
    res.status(201).json(newTask);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateTask = await taskService.updateTask(id, updateData);
    res.status(200).json(updateTask);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function deleteTask(req, res) {
  try {
    const { id } = req.params;
    await taskService.deleteTask(id);
    res.status(200).json({ message: "tarefa deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar a tarefa" });
  }
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
};
