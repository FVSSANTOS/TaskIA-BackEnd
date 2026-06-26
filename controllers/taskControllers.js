const taskService = require("../services/tasksServices");
const { estimateTask } = require("../controllers/aiController");

// Converte os campos do JSON interno (português) para o formato do frontend (inglês)
function toFrontend(task) {
  return {
    id: task.id,
    columnID: task.columnID,
    title: task.title || task.titulo || "",
    description: task.description || task.descricao || "",
    priority: task.priority || task.prioridade || "Baixa",
    effort: task.effort || task.esforco || "",
    createdAt: task.createdAt,
    createdBy: task.createdBy,
    assignedTo: task.assignedTo,
    updatedAt: task.updatedAt,
  };
}

async function getAllTasks(req, res) {
  try {
    const tasks = await taskService.getTasks();
    res.status(200).json(tasks.map(toFrontend));
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler tarefas" });
  }
}

async function createTask(req, res) {
  try {
    console.log("createTask body:", req.body);
    const {
      id,
      title, titulo,
      description, descricao,
      columnID,
      createdAt,
      createdBy,
      assignedTo,
    } = req.body;

    const tituloFinal = title || titulo;
    const descricaoFinal = description || descricao;

    if (!tituloFinal) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }

    const estimativa = await estimateTask(tituloFinal, descricaoFinal);

    const prioridade = estimativa?.prioridade || "Baixa";
    const esforco = estimativa?.esforco || "";

    const newTask = await taskService.saveTask({
      id,
      columnID,
      title: tituloFinal,
      description: descricaoFinal,
      priority: prioridade,
      effort: esforco,
      createdAt: createdAt || new Date().toISOString(),
      createdBy: createdBy || "Current User",
      assignedTo: assignedTo || "Current User",
    });
    res.status(201).json(toFrontend(newTask));
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateTask(req, res) {
  try {
    const { id } = req.params;
    const {
      title, titulo,
      description, descricao,
      priority, prioridade,
      effort, esforco,
      ...rest
    } = req.body;

    const updateData = {
      ...rest,
      title: title || titulo,
      description: description || descricao,
      priority: priority || prioridade,
      effort: effort || esforco,
    };

    const updated = await taskService.updateTask(id, updateData);
    res.status(200).json(toFrontend(updated));
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
    res.status(200).json(toFrontend(task));
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
