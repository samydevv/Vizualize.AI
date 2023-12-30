//Custom Modules
import createServer from "./util/createServer.js";

// Third Party Modules
import dotenv from "dotenv";

//Config
dotenv.config();
const app = createServer();
const port = process.env.PORT || 3000;

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
