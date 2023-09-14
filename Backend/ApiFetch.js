const express = require("express");
const mongodb = require("mongodb");
const MongoClient = mongodb.MongoClient;
const cors = require("cors");
const { Client, LocalAuth } = require('whatsapp-web.js');
const qrcode = require('qrcode-terminal');
const bodyParser = require('body-parser');
require('dotenv').config();

const mongouri = process.env.mongourl;
const app = express();
const port = process.env.PORT || 8500;

// Enable CORS for all routes
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// MongoDB Connection
let db;

MongoClient.connect(mongouri)
  .then((client) => {
    db = client.db("SIEMENS_GC");
  })
  .catch((err) => {
    console.error(err);
  });

// WhatsApp Client
const client = new Client({
  authStrategy: new LocalAuth(),
});

let isWhatsAppReady = false;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.get("/qrcode", async (req, res) => {
  if (!isWhatsAppReady) {
    // Generate and display the QR code in the terminal
    client.on('qr', (qr) => {
      console.log(qr);
      qrcode.generate(qr, { small: true });
    });

    // Listen for the 'authenticated' event to know when WhatsApp is ready
    client.on('authenticated', (session) => {
      console.log('WhatsApp authenticated');
      isWhatsAppReady = true;
    });

    // Initialize the WhatsApp client
    client.initialize();
    
    res.send(`
      <p>Scan the QR code with WhatsApp to continue.</p>
    `);
  } else {
    res.send(`
      <div class="flex gap-5">
        <input
          type="text"
          className="w-60 border-2 border-black h-10 p-2 rounded-lg"
          placeholder="Send WhatsApp Message.."
          id="messageInput"
        />
        <button
          className="bg-green-600 p-2 rounded-lg text-white font-bold"
          id="sendMessageButton"
        >
          💬 Send Message
        </button>
      </div>
    `);
  }
});

app.post("/send-message", async (req, res) => {
  const { message, DriverNumber } = req.body;
  const targetContact = `91${DriverNumber}@c.us`; // Replace with the recipient's phone number
  console.log(req.body);
  if (isWhatsAppReady) {
    try {
      await client.sendMessage(targetContact, message);
      res.send('Message sent successfully!');
    } catch (error) {
      console.error('Error sending message:', error);
      res.status(500).send('Error sending message.');
    }
  } else {
    res.status(400).send('WhatsApp is not yet ready.');
  }
});
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
app.get("/VehicleStatus/get", async (req, res) => {

      MongoClient.connect(mongouri)
        .then(async (client) => {
          // DATABASE CONNECTION
          const db = client.db("SIEMENS_GC");
          // COLLECTION CONNECTION
          const collection = db.collection("VehicleStatusMergedData");
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


  app.put("/gc/update/:id", async (req, res) => {
    const id = req.params.id; // Get the ID of the document to update
    const updatedData = req.body; // The updated data to be saved
  
    try {
      // Update the document in the "MergedData" collection
      const updateResult = await db.collection("MergedData").updateOne(
        { _id:new mongodb.ObjectId(id) },
        { $set: updatedData }
      );
  
      if (updateResult.modifiedCount === 1) {
        // Document updated successfully
        // Now, insert the updated data into the "VehicleStatusMergedData" collection
        const insertResult = await db.collection("VehicleStatusMergedData").insertOne(updatedData);
  
        if (insertResult.insertedId) {
          // Data inserted into "VehicleStatusMergedData" collection
          res.status(200).json({ message: "Data updated and inserted successfully" });
        } else {
          res.status(500).json({ message: "Error inserting data into VehicleStatusMergedData" });
        }
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
  });
  

  app.put("/Vehicle/update/:id", async (req, res) => {
    const id = req.params.id; // Get the ID of the document to update
    const updatedData = req.body; // The updated data to be saved
  
    try {
      // Update the document in the "MergedData" collection
      const updateResult = await db.collection("VehicleStatusMergedData").updateOne(
        { _id:new mongodb.ObjectId(id) },
        { $set: updatedData }
      );
  
      if (updateResult.modifiedCount === 1) {
        // Document updated successfully
        // Now, insert the updated data into the "VehicleStatusMergedData" collection
       
          // Data inserted into "VehicleStatusMergedData" collection
          res.status(200).json({ message: "Data updated and inserted successfully" });
       
      } else {
        res.status(404).json({ message: "Data not found" });
      }
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: error.message });
    }
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

// WhatsApp Client Event Handlers
client.on('ready', () => {
  console.log('WhatsApp Client is ready!');
  isWhatsAppReady = true;
});

client.initialize();

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});