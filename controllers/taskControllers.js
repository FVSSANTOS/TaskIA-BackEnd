const taskService = require("../services/tasksServices");
const { estimateTask } = require("../controllers/aiController");

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
    console.log("createTask body:", req.body);
    const {
      id,
      title,
      description,
      columnId,
      titulo,
      descricao,
      columnID,
      priority,
      prioridade,
    } = req.body;

    const taskTitle = title || titulo;
    if (!taskTitle) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }

    const taskDescription = description || descricao || "";
    const taskColumnId = columnId || columnID || "todo";
    const providedPriority = priority || prioridade;

    const evaluation = await estimateTask(taskTitle, taskDescription);
    const aiPriority = evaluation?.priority || evaluation?.prioridade;
    const aiEffort = evaluation?.effort || evaluation?.esforco || "";

    const priorityValue = normalizePriority(providedPriority || aiPriority);
    const newTask = {
      id: id || String(Date.now()),
      title: taskTitle,
      description: taskDescription,
      columnId: taskColumnId,
      priority: priorityValue,
      effort: aiEffort,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    await taskService.addTask(newTask);
    res.status(201).json(newTask);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
}

function normalizePriority(value) {
  if (!value) return "low";
  const str = String(value).toLowerCase();
  if (str.includes("alta") || str.includes("high")) return "high";
  if (str.includes("média") || str.includes("media") || str.includes("medium"))
    return "medium";
  return "low";
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
