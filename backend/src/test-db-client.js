import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';
dotenv.config();

const testConnection = async () => {
    const client = new MongoClient(process.env.MONGO_URI, {
        serverSelectionTimeoutMS: 5000,
    });

    try {
        console.log('Testing with MongoClient...');
        await client.connect();
        console.log('✅ Connected successfully with MongoClient!');
        const dbs = await client.db().admin().listDatabases();
        console.log('Databases:', dbs.databases.map(d => d.name));
        process.exit(0);
    } catch (err) {
        console.error('❌ MongoClient failed:', err);
        process.exit(1);
    } finally {
        await client.close();
    }
};

testConnection();
