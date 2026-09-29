import app from "./src/app.js";
import { connectDB } from "./src/config/db.js";
import config from "./src/config/config.js";

async function startServer() {
    try {
        await connectDB();

        app.listen(config.PORT, () => {
            console.log(`Server running on http://localhost:${config.PORT}`);
        });
    } catch (error) {
        console.error("Failed to start server:", error.message);
        process.exit(1);
    }
}

startServer();