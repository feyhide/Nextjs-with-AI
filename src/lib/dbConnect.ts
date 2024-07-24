import mongoose from "mongoose";

type ConnectionObject = {
    isConnected?: number;
}

const connection: ConnectionObject = {};

async function dbConnect(): Promise<void> {
    console.log(process.env.MONGODB_URI)
    if (connection.isConnected) {
        console.log("Already connected to database");
        return;
    }
    try {
        // Connection options updated to remove deprecated ones
        const db = await mongoose.connect(process.env.MONGODB_URI || '');
        connection.isConnected = db.connections[0].readyState;
        console.log("db connected successfully");
    } catch (error) {
        // Type assertion for better error handling
        console.error("db connection failed:", (error as Error).message);
        process.exit(1);
    }
}

export default dbConnect;
