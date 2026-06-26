const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasksRoutes");
const columnRoutes = require("./routes/columnRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());

// middleware para ler  o json vindo do front-end
app.use(express.json());

app.use(cors({
  origin: true
}));



//acesar a api nos tasks routtes
app.use("/api/tasks", taskRoutes);

app.use("/api/columns", columnRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
