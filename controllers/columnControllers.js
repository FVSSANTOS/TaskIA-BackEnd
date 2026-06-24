const columnService = require("../services/columnServices");

async function getAllColumn(req, res) {
  try {
    const column = await columnService.getColumns();
    res.status(200).json(column);
  } catch (error) {
    res.status(500).json({ error: "Erro ao ler colunas" });
  }
}

async function createColumn(req, res) {
  try {
    const titulo = req.body;
    if (!titulo) {
      return res.status(400).json({ error: "O título é obrigatório" });
    }
    const newColumn = await columnService.saveColumn(req.body);
    res.status(201).json(newColumn);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function updateColumn(req, res) {
  try {
    const { id } = req.params;
    const updateData = req.body;
    const updateColumn = await columnService.updateColumn(id, updateData);
    res.status(200).json(updateColumn);
  } catch (error) {
    res.status(404).json({ error: error.message });
  }
}

async function deleteColumn(req, res) {
  try {
    const { id } = req.params;
    await columnService.deleteColumn(id);
    res.status(200).json({ message: "coluna deletada com sucesso" });
  } catch (error) {
    res.status(500).json({ error: "Erro ao deletar a coluna" });
  }
}

async function getColumnById(req, res) {
  try {
    const { id } = req.params;
    const column = await columnService.getColumnById(id);
    res.status(200).json(column)
  } catch (error) {
    if (error.message === "Coluna não encontrada") {
      return res.status(404).json({ error: error.message });
    }
    res.status(500).json({ error: "Erro ao buscar coluna" });
  }
}

module.exports = {
  getAllColumn,
  createColumn,
  updateColumn,
  deleteColumn,
  getColumnById,
};
