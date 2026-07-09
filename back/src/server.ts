import app from "./app.js";
import { seedIfEmpty } from "./seed.js";

seedIfEmpty();

app.listen(3000, () => {
  console.log("epxress server is running");
});
