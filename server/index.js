import express from 'express'
import  { MongoClient } from 'mongodb';

const app = express();
const port = 5000;
const url = 'mongodb://localhost:27017';
const dbName = 'data';
const collectionName = 'mycollection';
 
// Connect to MongoDB
MongoClient.connect(url, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if (err) {
    console.error('Error connecting to MongoDB:', err);
    return;
  }
  console.log('Connected to MongoDB');
  const db = client.db(dbName);s
  const collection = db.collection(collectionName);



  app.get ('/', async(req, res) => {
    res.send('Hello World!')
  })
 
  app.get('/data', async (req, res) => {
    try {
      const documents = await collection.find().toArray();
      res.json(documents);
    } catch (error) {
      console.error('Error fetching data:', error);
      res.status(500).json({ error: 'Failed to fetch data' });
    }
  });


});

// Start the Express server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
