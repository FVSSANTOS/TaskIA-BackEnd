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

// func para salvar no arquivo

async function saveTasks(tasks) {
  await fs.writeFile(tasksFilePath, JSON.stringify(tasks, null, 2));
}

//func para criar task
async function createTask(taskData) {
  const tasks = await getTasks();
  const newTask = {
    id: Date.now().toString(),
    status: "A Fazer", // Status inicial padrão
    ...taskData,
  };
  tasks.push(newTask);
  await saveTasks(tasks);
  return newTask;
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
  createTask,
  updateTask,
  deleteTask,
};
