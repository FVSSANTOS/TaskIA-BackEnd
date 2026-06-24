const fs = require("fs").promises;
const path = require("path");

const tasksFilePath = path.join(__dirname, "../task.json");

// func para ler o arquivo task.json

async function getTasks() {
  try {
    const data = await fs.readFile(tasksFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// func para buscar task por id
async function getTaskById(id) {
  const tasks = await getTasks();
  const task = tasks.find((t) => t.id == id);
  if (!task) throw new Error("Tarefa não encontrada");
  return task;
}


async function saveTasks(newTask) {
  const data = await fs.readFile(tasksFilePath, "utf-8");
  const tasks = JSON.parse(data);
  tasks.push(newTask);
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

// func para atualizar task
async function updateTask(id, updateData) {
  const tasks = await getTasks();
  const taskIndex = tasks.findIndex((t) => t.id === id);

  if (taskIndex === -1) throw new Error("Tarefa não encontrada");

  tasks[taskIndex] = { ...tasks[taskIndex], ...updateData };
  await saveTasks(tasks);
  return tasks[taskIndex];
}

// func para deletar task
async function deleteTask(id) {
  const tasks = await getTasks();
  const filteredTasks = tasks.filter((t) => t.id !== id);
  await saveTasks(filteredTasks);
}

module.exports = {
  getTasks,
  getTaskById,
  saveTasks,
  updateTask,
  deleteTask,
};
