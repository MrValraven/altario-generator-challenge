import express from "express";
import bodyParser from "body-parser";
const cors = require("cors");
import { router } from "./routes";

const app = express();

app.use(cors());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

app.listen("8000", () => {
  console.log("Listening on port 8000");
});
