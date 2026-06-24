const express = require("express");
const router = express.Router();
const columnController = require("../controllers/columnControllers");

// mapeamento as requisições do controller

router.get("/", columnController.getAllColumn);
router.get("/:id", columnController.getColumnById);
router.post("/", columnController.createColumn);
router.put("/:id", columnController.updateColumn);
router.delete("/:id", columnController.deleteColumn);

module.exports = router;
