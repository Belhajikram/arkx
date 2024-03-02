const { MongoClient } = require('mongodb');

const uri = 'mongodb://localhost:27017';

const dbName = 'mydb';

const client = new MongoClient(uri, { useUnifiedTopology: true });

async function main() {
    try {
        await client.connect();
        console.log('Connected to the MongoDB server');

        const db = client.db(dbName);

        const collection = db.collection('users');

        const users = [
            { name: 'John', age: 30 },
            { name: 'Alice', age: 25 },
            { name: 'Bob', age: 35 }
        ];
        const insertResult = await collection.insertMany(users);
        console.log(`${insertResult.insertedCount} users inserted`);

        const usersCollection = collection.find();
        await usersCollection.forEach(user => { console.log(user); });
    } catch (error) {
        console.error('Error:', error);
    } finally {
       await client.close();
        console.log('Connection closed');
    }
}

main();
