const express = require('express');
const { MongoClient } = require('mongodb');
const path = require('path');

const app = express();
app.use(express.json());
app.use(express.static('public'));

const uri = "mongodb+srv://anshadrazakk:Asdrzkknt%40123@cluster0.qyxtmlr.mongodb.net/cluster0?retryWrites=true&w=majority&appName=Cluster0";
const client = new MongoClient(uri);

async function connectToDb() {
    if (!client.topology || !client.topology.isConnected()) {
        await client.connect();
    }
}

app.post('/send', async (req, res) => {
    try {
        console.log('Received request at /send:', req.body);
        await connectToDb();
        const { uname, theirid, amount } = req.body;

        const currentu = await client.db("Transactions").collection("All").findOne({ name: uname });
        const newumoney = parseInt(currentu.money, 10) - parseInt(amount, 10);
        await client.db("Transactions").collection("All").updateOne({ name: uname }, { $set: { money: newumoney } });
        const currentr = await client.db("Transactions").collection("All").findOne({ name: theirid });
        const newpending = parseInt(currentr.pending, 10) + parseInt(amount, 10);
        await client.db("Transactions").collection("All").updateOne({ name: theirid }, { $set: { pending: newpending } });
        console.log('Transaction completed successfully.');
        res.send("Transaction completed successfully.");
    } catch (e) {
        console.log('Error at /send:', e.message);
        res.status(500).send(e.message);
    }
});

app.post('/receive', async (req, res) => {
    try {
        console.log('Received request at /receive:', req.body);
        await connectToDb();
        const { uname } = req.body;

        const currentu = await client.db("Transactions").collection("All").findOne({ name: uname });
        const newumoney = parseInt(currentu.money, 10) + parseInt(currentu.pending, 10);
        await client.db("Transactions").collection("All").updateOne({ name: uname }, { $set: { money: newumoney, pending: 0 } });
        console.log('Pending money accepted successfully.');
        res.send("Pending money accepted successfully.");
    } catch (e) {
        console.log('Error at /receive:', e.message);
        res.status(500).send(e.message);
    }
});

app.get('/balance', async (req, res) => {
    try {
        console.log('Received request at /balance:', req.query);
        await connectToDb();
        const { uname } = req.query;
        const currentu = await client.db("Transactions").collection("All").findOne({ name: uname });
        console.log(`Balance for ${uname}: ${currentu.money}`);
        res.send(`Your balance is: ${currentu.money}`);
    } catch (e) {
        console.log('Error at /balance:', e.message);
        res.status(500).send(e.message);
    }
});

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});
