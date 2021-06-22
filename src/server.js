import express from "express";
import cors from "cors";
import listEndpoints from "express-list-endpoints";
import mongoose from "mongoose";
import cookieParser from "cookie-parser";


import threeDRouter from "./services/case/index.js";
import router from "./services/users/index.js"

var corsOptions = {
  origin: true,
  credentials: true,
};

import {
  notFoundErrorHandler,
  badRequestErrorHandler,
  catchAllErrorHandler,
} from "./errorHandlers.js";


const server = express();

const port = process.env.PORT;

server.use(express.json());
server.use(cors(corsOptions));
server.use(cookieParser())
server.use("/3D", threeDRouter);
server.use("/users", router);

// ERROR HANDLERS MIDDLEWARES

server.use(badRequestErrorHandler);
server.use(notFoundErrorHandler);
server.use(catchAllErrorHandler);

console.log(listEndpoints(server));

mongoose.connect(process.env.MONGO_CONNECTION, { useNewUrlParser: true, useUnifiedTopology: true })

mongoose.connection.on("connected", () => {
  console.log("Successfully connected to Mongo!")
  server.listen(port, () => {
    console.table(listEndpoints(server))
    console.log("Server is running on port: ", port)
  })
})

mongoose.connection.on("error", err => {
  console.log(err)
})
