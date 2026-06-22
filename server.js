const express = require("express");
const taskRoutes = require("./routes/tasksRoutes");
const iaRoutes = require("./routes/ai")


const app = express();
const PORT = 3000;

// middleware para ler  o json vindo do front-end
app.use(express.json());

//acesar a api nos tasks routtes
app.use("/api/tasks", taskRoutes);

app.use("/ia", iaRoutes);

app.listen(PORT, () => {
  console.log(`Servidor rodando na http://localhost:${PORT}`);
});
