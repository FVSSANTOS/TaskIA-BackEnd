const express = require("express");
const cors = require("cors");
const taskRoutes = require("./routes/tasksRoutes");
const userRoutes = require("./routes/userRoutes");
const columnRoutes = require("./routes/columnRoutes");

const app = express();
const PORT = process.env.PORT || 3000;

// Habilitar CORS
app.use(cors());
app.use(express.json());
app.use(cors({
  origin: true
}));

// middleware para ler  o json vindo do front-end



// acessar a api nos tasks routes
app.use("/api/tasks", taskRoutes);
app.use("/users", userRoutes);
app.use("/api/columns", columnRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
