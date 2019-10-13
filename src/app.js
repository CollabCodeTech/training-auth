import restify from "restify";
import dotenv from "dotenv";

dotenv.config();

const app = restify.createServer();
const { PORT } = process.env;

app.get("/", (req, res) => res.send({ hello: "world" }));

app.listen(PORT, () => {
  console.log(`Listening at http://localhost:${PORT}`);
  console.log("Turn off server: ctrl + c");
});
