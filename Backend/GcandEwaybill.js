const axios = require("axios");
const { MongoClient } = require("mongodb");
require('dotenv').config();
function startFetchingData() {
  return new Promise((resolve, reject) => {
    // Define a route to fetch and return the data

    // Get current month and year
    const currentDate = new Date();
    const currentMonth = currentDate.getUTCMonth() + 1; // Adding 1 because months are zero-based
    const currentYear = currentDate.getFullYear();
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    const currentMonthAbbreviation = months[currentMonth - 1];
    console.log(currentMonthAbbreviation, currentYear);

    const allResponses = [];
    let pageNumber = 1;

    function fetchData() {
      const config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `http://api.apml.in/Reports.svc/BookingSalesRegisterReport?StartDocketDate=1 ${currentMonthAbbreviation} ${currentYear}&EndDocketDate=30 ${currentMonthAbbreviation} ${currentYear}&PageLimit=500&PageNumber=${pageNumber}`,
        headers: {
          Authorization: "Basic UmVwb3J0czpSZVAwcnRT",
          Cookie: "ASP.NET_SessionId=ao5mketixmpsrfxjbvg0svmh",
        },
      };

      axios
      .request(config)
      .then((response) => {
          var CurrentDate_year =`${currentMonthAbbreviation}-${currentYear}`
          // Push response data into the array
          for (let i = 0; i < response.data.Response.length; i++) {
            const gcStatus = response.data.Response[i].GCStatus;
            var obj = {
                Data: response.data.Response[i],
                FetchDate: `${currentMonthAbbreviation}-${currentYear}`,
                Status: "", // Initialize the status property
                ChallanNumber:"", // Initialize the challenge number
              };
             
              if(gcStatus!=null){
                const intransit = /In Transit/i; // Case-insensitive search
                const statusMatch = gcStatus.match(intransit);
                const Pod = /POD Uploaded/i;
                const PodMatch = gcStatus.match(Pod);
                const gc_completion = /GC completion/i;
                const gcCompleted = gcStatus.match(gc_completion);
                const Stock = /Stock/i;
                const Available = gcStatus.match(Stock);
                if (statusMatch) {
                    obj.Status ="Intransit" ;
                    const regex = /via\s+(\w+)/;
                    const match = gcStatus.match(regex);
                    if (match && match[1]) {
                      const numberAfterVia = match[1];
                      obj.ChallanNumber=numberAfterVia; // Output: LCMDDVIJ24111979
                    } else {
                      obj.ChallanNumber= "";
                    }
                  } else if (PodMatch) {
                    obj.Status = "Pod Uploaded";
                  } else if (gcCompleted) {
                    obj.Status = "GC completed Available ";
                  } else if (Available) {
                    obj.Status = "Available";
                  } else {
                    obj.Status = gcStatus;
                  }  
            }
              else{
                obj.Status="Gc Status Null";
              }
              console.log(obj.Status)
            allResponses.push(obj);
          }

          // Check if there are more pages to fetch
          if (response.data.Response.length > 0) {
            pageNumber++;
            console.log(pageNumber);
            fetchData(); // Fetch next page
          } else {
            // All responses have been fetched
            console.log(
              allResponses.length,
              "this is the final response we want"
            );
            console.log(allResponses[0]);
            DataPush(allResponses,CurrentDate_year)
            resolve(allResponses);
          }
        })
        .catch((error) => {
          console.log(error);
          reject(error);
        });
    }

    // Start fetching data
    fetchData();
  });
}

function DataPush(_a,_b) {
  const uri = process.env.mongourl;
const dbName = "SIEMENS_GC";
const collectionName = "GC";
  return new Promise((resolve, reject) => {
    MongoClient.connect(uri, { useUnifiedTopology: true })
      .then((client) => {
        console.log("Connected to the MongoDB database");
        const db = client.db(dbName);
        const collection = db.collection(collectionName);

        const filter = { FetchDate: _b };

        // Delete documents with FetchDate as "Jun-2023"
        collection
          .deleteMany(filter)
          .then(() => {
            console.log("Existing data deleted");

            // Insert the new dataArray into the collection
            collection
              .insertMany(_a)
              .then(() => {
                console.log("New data inserted into the database");
                client.close();
                console.log("Connection to the database closed");
                resolve();
              })
              .catch((error) => {
                console.error(
                  "Error inserting new data into the database:",
                  error
                );
                client.close();
                console.log("Connection to the database closed");
                reject(error);
              });
          })
          .catch((error) => {
            console.error("Error deleting existing data:", error);
            client.close();
            console.log("Connection to the database closed");
            reject(error);
          });
      })
      .catch((error) => {
        console.error("Error connecting to the database:", error);
        reject(error);
      });
  });
}

const Ewaybill =()=>{

  
  
const config = {
  method: "get",
  maxBodyLength: Infinity,
  url: "https://api-gateway.cxipl.com/api/v1/eway-bill/?skip=0",
  headers: {
    authkey: "HQ9DFJ7KTJVNS28JP61DTKD5XHX22Z26",
  },
};
resultlimit = [];
axios
.request(config)
.then((response) => {
  resultlimit.push(response.data.data.resultSize);
  const maxResults = resultlimit[0];
  // const maxResults = 80;
    const resultsPerPage = 20;
    let skip = 0;
    let allResults = [];
    let ewaynumber = [];
    async function fetchData() {
      while (skip < maxResults) {
        console.log(skip, maxResults);
        try {
          const response = await axios(config);
          allResults = allResults.concat(response.data.data.data);
          skip += resultsPerPage;
          config.url = `https://api-gateway.cxipl.com/api/v1/eway-bill/?skip=${skip}`;
        } catch (error) {
          console.error(error);
          break;
        }
      }
      console.log(allResults.length);
      for (var i = 0; i < allResults.length; i++) {
        var alldata = {
          data: allResults[i],
        };
        ewaynumber.push(alldata);
      }
      console.log(ewaynumber[0]);
      
      const mongoURI = 'mongodb+srv://data_IT:data_IT@apml.6w5pyjg.mongodb.net/test'; // Replace with your MongoDB connection string
      const dbName = 'SIEMENS_GC'; // Replace with your MongoDB database name
      const collectionName = 'Ewaybill'; 
      insertDataToMongoDB()
      
      
      
      
      
      async function insertDataToMongoDB() {
        try {
          const client = await MongoClient.connect(mongoURI);
          const db = client.db(dbName);

           // Drop the collection before inserting new data
          await db.collection(collectionName).drop();

          // Insert the ewaynumber data array into the specified collection
          const result = await db.collection(collectionName).insertMany(ewaynumber);
          
          console.log(`${result.insertedCount} documents inserted successfully.`);
          client.close(); // Close the MongoDB connection after insertion
        } catch (error) {
          console.error('Error inserting data into MongoDB:', error);
        } finally {
        }
      }
      
    }

    
    
    
    
    
    fetchData();
  })
  .catch((error) => {
    console.log(error);
  });
}
 startFetchingData() // this is one for the gc 
// Ewaybill()   // this is one for the ewaybill

setInterval(()=>{
    console.log(new Date().toLocaleString())
 
},14400000)

// 
