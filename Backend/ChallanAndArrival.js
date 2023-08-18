const axios = require('axios');
const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.mongourl;; // Your MongoDB URI
const dbName = 'SIEMENS_GC'; // Your database name

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

const currentDate = new Date();
const currentMonth = currentDate.toLocaleString('default', { month: 'short' });
const currentYear = currentDate.getFullYear();

let pageNumber = 1;
let ArrivalpageNumber = 1;
const AllChallanData = [];
const AllArrivalData = [];

async function makeRequest(pageNumber) {
  const monthString = `${currentMonth} ${currentYear}`;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://api.apml.in/Reports.svc/ChallanDetailReport?THCStartDate=1 ${monthString}&THCEndDate=30 ${monthString}&PageLimit=500&PageNumber=${pageNumber}`,
    headers: {
      'Authorization': 'Basic UmVwb3J0czpSZVAwcnRT',
      'Cookie': 'ASP.NET_SessionId=yycjmmo2ym2djfwhn41gyae5'
    }
  };

  axios.request(config)
    .then((response) => {
      console.log(`Page ${pageNumber} `);
      if (response.data.Response.length === 0) {
        console.log('Response is null. Stopping.');
        deleteAndInsertData();
      } else { 
        // Accumulate data from each page into AllChallanData
        const mappedData = response.data.Response.map(res => ({
          date: monthString,
          ChallanData: res
        }));
        AllChallanData.push(...mappedData);
        console.log(AllChallanData.length ,"---Challan");
        pageNumber++;
        makeRequest(pageNumber);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function deleteAndInsertData() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('challanData'); // Replace with your collection name
    const monthString = `${currentMonth} ${currentYear}`;

    const deleteResult = await collection.deleteMany({
      date: monthString // Assuming 'date' field holds the month information
    });


    console.log(`${deleteResult.deletedCount} documents deleted for ${monthString}.`);

    // Insert new data
    const insertResult = await collection.insertMany(AllChallanData);
    console.log(`${insertResult.insertedCount} documents inserted into MongoDB.`);
  } catch (err) {
    console.error('Error deleting or inserting data:', err);
  } finally {
    client.close();
  }
}

makeRequest(pageNumber);

// Arrival Issues


async function makeRequestArrival(ArrivalpageNumber) {
  const monthString = `${currentMonth} ${currentYear}`;
  let config = {
    method: 'get',
    maxBodyLength: Infinity,
    url: `http://api.apml.in/Reports.svc/THCArrivalReport?StartDocketDate=1 ${monthString}&EndDocketDate=30 ${monthString}&PageLimit=500&PageNumber=${pageNumber}`,
    headers: { 
      'Authorization': 'Basic UmVwb3J0czpSZVAwcnRT', 
      'Cookie': 'ASP.NET_SessionId=wczdd42313tmoz24ah4vqktf'
    }
  };

  axios.request(config)
    .then((response) => {
      console.log(`Page ${pageNumber} `);
      if (response.data.Response.length === 0) {
        console.log('Response is null. Stopping.');
        ArrivaldeleteAndInsertData();
      } else { 
        // Accumulate data from each page into AllChallanData
        const mappedData = response.data.Response.map(res => ({
          date: monthString,
          ArrivalData: res
        }));
        AllArrivalData.push(...mappedData);
        console.log(AllArrivalData.length,"---ArrivalData---");
        pageNumber++;
        makeRequestArrival(ArrivalpageNumber);
      }
    })
    .catch((error) => {
      console.log(error);
    });
}

async function ArrivaldeleteAndInsertData() {
  try {
    await client.connect();
    const db = client.db(dbName);
    const collection = db.collection('ArrivalData'); // Replace with your collection name
    const monthString = `${currentMonth} ${currentYear}`;

    const deleteResult = await collection.deleteMany({
      date: monthString // Assuming 'date' field holds the month information
    });


    console.log(`${deleteResult.deletedCount} documents deleted for ${monthString}.`);

    // Insert new data
    const insertResult = await collection.insertMany(AllArrivalData);
    console.log(`${insertResult.insertedCount} documents inserted into MongoDB.`);
  } catch (err) {
    console.error('Error deleting or inserting data:', err);
  } finally {
    client.close();
  }
}

makeRequestArrival(ArrivalpageNumber);





