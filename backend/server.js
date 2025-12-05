
import { sqlInstance as sql, config } from "./db.js";
import router from "./routes/designMasterRoute.js";
import express from "express";
import cors from "cors";
import dotenv from 'dotenv'
dotenv.config()

const app = express();
app.use(cors());
app.use(express.json());
app.use("/api/users", router);

const PORT = process.env.PORT||5000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

/* --- DATABASE CONNECTION CHECK --- */
sql.connect(config)
    .then(pool => {
        if (pool.connected) console.log("✅ Database Connected Successfully");
        return pool;
    })
    .catch(err => {
        console.error("❌ Database Connection Failed:", err);
    });
