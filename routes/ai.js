const express = require("express");
const router = express.Router();
const { estimateTask } = require("../controllers/aiController");

router.post("/estimate", estimateTask);

module.exports = router;