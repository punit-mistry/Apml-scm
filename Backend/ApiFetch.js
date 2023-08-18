// IMPORT PACKAGES
const express = require("express");
const mongodb = require("mongodb");
const cors = require("cors"); // Import the cors package
require('dotenv').config();

var MongoClient = mongodb.MongoClient;

const mongouri = process.env.mongourl;
const app = express();
app.use(cors());

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const port = process.env.PORT||8500;




app.get("/gc/get", async (req, res) => {

      MongoClient.connect(mongouri)
        .then(async (client) => {
          // DATABASE CONNECTION
          const db = client.db("SIEMENS_GC");
          // COLLECTION CONNECTION
          const collection = db.collection("MergedData");
            const Filter = JSON.parse(req.query.filter)
          const limit = 5000; // Limit to 1000 documents per request
          const data = await collection.find(Filter).limit(limit).toArray();
  
          res.status(200).json({
            data,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: err });
        });
  });
app.get("/Vehicle/get", async (req, res) => {

      MongoClient.connect(mongouri)
        .then(async (client) => {
          // DATABASE CONNECTION
          const db = client.db("SIEMENS_GC");
          // COLLECTION CONNECTION
          const collection = db.collection("VehicleWiseMergedData");
          const limit = 5000; // Limit to 1000 documents per request
          const data = await collection.find().limit(limit).toArray();
  
          res.status(200).json({
            data,
          });
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({ error: err });
        });
  });


 app.post("/placeandroutes",async(req, res) => {
  const body = req.body;
  try {
    MongoClient.connect(mongouri).then(async(client) => {
      const db = client.db("PlacesAndRoutes");
      const collection = db.collection("Manual_PlacesAndRoutes");
      const result = await collection.insertOne(body);
    
      client.close();
      
      res.status(201).json({ message: "Data inserted successfully", insertedId: result.insertedId });
    })
  } catch (error) {
    console.log(error);
    res.status(404).json({message:error.message});
  }
 }) 

  app.listen(port, function () {
    console.log(mongouri)
    console.log("Server running on port: ", port);
  });
  