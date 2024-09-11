import express from "express";
import router from "../routes/busschedule.js";

const app = express();

app.use(express.json());
app.use(router);

app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header(
      "Access-Control-Allow-Headers",
      "Origin, X-Requested-With, Content-Type, Accept, Authorization"
    );
    res.header(
      "Access-Control-Allow-Methods",
      "POST, GET, PUT, DELETE, PATCH, OPTIONS"
    );
    res.header("Access-Control-Allow-Credentials", true);
    if ("OPTIONS" == req.method) {
      res.sendStatus(200);
    } else {
      next();
    }
  });

  // Define a simple route
app.get('/', (req, res) => {
  res.send({'status':'hello'})
});

export default app