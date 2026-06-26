const fs = require("fs").promises;
const path = require("path");

const columnFilePath = path.join(__dirname, "../columns.json");

// func para ler o arquivo task.json
async function getColumns() {
  try {
    const data = await fs.readFile(columnFilePath, "utf8");
    return JSON.parse(data);
  } catch (error) {
    if (error.code === "ENOENT") return [];
    throw error;
  }
}

// func para buscar task por id
async function getColumnById(id) {
  const columns = await getColumns();
  const column = columns.find((t) => t.id == id);
  if (!column) throw new Error("Coluna não encontrada");
  return column;
}

async function saveAllColumns(columns) {
  await fs.writeFile(columnFilePath, JSON.stringify(columns, null, 2));
}

async function saveColumn(newColumn) {
  const columns = await getColumns();
  columns.push(newColumn);
  await saveAllColumns(columns);
  return newColumn;
}

// func para atualizar task
async function updateColumn(id, updateData) {
  const columns = await getColumns();
  const columnIndex = columns.findIndex((t) => t.id == id);

  if (columnIndex === -1) throw new Error("Coluna não encontrada");

  columns[columnIndex] = { ...columns[columnIndex], ...updateData };
  await saveAllColumns(columns);
  return columns[columnIndex];
}

// func para deletar task
async function deleteColumn(id) {
  const columns = await getColumns();
  const filteredColumn = columns.filter((t) => t.id != id);
  await saveAllColumns(filteredColumn);
}

module.exports = {
  getColumns,
  getColumnById,
  addColumn,
  saveColumns,
  updateColumn,
  deleteColumn,
};
