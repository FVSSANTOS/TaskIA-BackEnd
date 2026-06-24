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

// func para salvar no arquivo
async function saveColumn(newColumn) {
  const data = await fs.readFile(columnFilePath, "utf-8");
  const columns = JSON.parse(data);
  columns.push(newColumn);
  await fs.writeFile(columnFilePath, JSON.stringify(columns, null, 2));
}

// func para atualizar task
async function updateColumn(id, updateData) {
  const column = await getColumns();
  const columnIndex = column.findIndex((t) => t.id == id);

  if (columnIndex === -1) throw new Error("Colunas não encontrada");

  column[columnIndex] = { ...column[columnIndex], ...updateData };
  await saveColumn(column);
  return column[columnIndex];
}

// func para deletar task
async function deleteColumn(id) {
  const column = await getColumns();
  const filteredColumn = column.filter((t) => t.id != id);
  await saveColumn(filteredColumn);
}

module.exports = {
  getColumns,
  getColumnById,
  saveColumn,
  updateColumn,
  deleteColumn,
};
