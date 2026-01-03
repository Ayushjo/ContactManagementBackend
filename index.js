import express from "express";
import connectDB from "./db/index.js";
import dotenv from "dotenv";
import morgan from "morgan";
import logger from "./logger.js";
import cors from "cors";
dotenv.config({
  path: "./.env",
});
const app = express();
app.use(
  cors({
    origin: [
      "https://contactmanagement.iayush.com/",
      "http://localhost:5173",
      "https://contact-management-frontend-mocha.vercel.app/",
    ],
    credentials: true,
  })
);
app.use(
  express.json({
    limit: "16kb",
  })
);

app.use(
  express.urlencoded({
    extended: true,
    limit: "16kb",
  })
);
const morganFormat = ":method :url :status :response-time ms";
app.use(
  morgan(morganFormat, {
    stream: {
      write: (message) => {
        const logObject = {
          method: message.split(" ")[0],
          url: message.split(" ")[1],
          status: message.split(" ")[2],
          responseTime: message.split(" ")[3],
        };
        logger.info(JSON.stringify(logObject));
      },
    },
  })
);

import ContactRouter from "./routes/ContactRoutes.js";
app.use("/api/contacts", ContactRouter);

const PORT = process.env.PORT || 3030;
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      logger.warn("HUHUHU");
      logger.info(`Port ${PORT} running`);
    });
  })
  .catch(() => {
    logger.error("Error connecting DB", err);
  });
