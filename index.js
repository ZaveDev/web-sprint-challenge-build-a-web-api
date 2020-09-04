const express = require("express")
const actionsRouter = require("./actions/actionsRouter")
const projectsRouter = require("./projects/projectsRouter")
const server = express()

server.use(express.json())
server.use("/actions", actionsRouter)
server.use("/projects", projectsRouter)

server.get("/", (req, res) => {
  res.status(200).json({ Victor_Frankenstein: "It's ALIVEEEE" });
});

const port = process.env.PORT || 7892
server.listen(port, () => {
  console.log(`>> [PORT ${port}] Hey there, I'm listening...`);
})
