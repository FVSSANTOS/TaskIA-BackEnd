const taskService = require("../services/tasksServices");
const { estimateTask } = require("../controllers/aiController");

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getTasks();
    console.log("getAllTasks tasks:", tasks);
    res.status(200).json(tasks);

  } catch (error) {
    res.status(500).json({ error: "Erro ao ler tarefas" });
  }
}

async function createTask(req, res) {
  try {
    console.log("createTask body:", req.body);
    const { id, title, description, columnID } = req.body;

    if (!title) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }

    const { priority, effort } = await estimateTask(title, description);
    console.log(priority)

    const newTask = await taskService.saveTask({
      id,
      columnID,
      title,
      description,
      priority,
      effort,
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

async function getTaskById(req, res) {
  try {
    const { id } = req.params;
    const task = await taskService.getTaskById(id);
    res.status(200).json(task);
  } catch (error) {
    if (error.message === "Tarefa não encontrada") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Erro ao buscar tarefa" });
  }
}

module.exports = {
  getAllTasks,
  createTask,
  updateTask,
  deleteTask,
  getTaskById,
};
