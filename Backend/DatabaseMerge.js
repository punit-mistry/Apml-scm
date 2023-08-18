const { MongoClient } = require('mongodb');
require('dotenv').config();
const uri = process.env.mongourl; // Your MongoDB URI
const dbName = 'SIEMENS_GC';
const Collection1 = "GC";
const Collection2 = "Live_Tracking";
const MergedCollection = "MergedData"; // Collection for storing merged data
const VehicleWiseMergedCollection = "VehicleWiseMergedData"; // Collection for storing merged data

const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });

async function mergeAndInsert() {
  try {
    await client.connect();
    const db = client.db(dbName);
    // await db.collection(MergedCollection).drop()  
    // Aggregation pipeline to merge data from GC and ChallData collections
    const aggregationPipeline =  [
        {
            $match: {
              FetchDate: "Aug-2023",
            },
          },
          {
            $lookup: {
              from: "Ewaybill",
              localField: "Data.DocketNo",
              foreignField: "data.transDocNo",
              as: "ewaybillResult",
            },
          },
          {
            $lookup: {
              from: "challanData",
              localField: "Data.THCNO",
              foreignField: "ChallanData.THCNO",
              as: "challanDataResult",
            },
          },
          {
            $lookup: {
              from: "ArrivalData",
              localField: "Data.DocketNo",
              foreignField: "ArrivalData.DocketNo",
              as: "ArrivalDataResult",
            },
          },
        {
            $out: MergedCollection // Output the merged data to the MergedCollection
          }
      ]
    // Execute the aggregation pipeline
    await db.collection(Collection1).aggregate(aggregationPipeline).toArray();
    client.close();

    console.log('Data merged and inserted into', MergedCollection);

      SecondMergedCollection()

  } catch (err) {
    console.error('Error merging and inserting data:', err);
  } 
}
async function SecondMergedCollection(){
    try{
      await client.connect();
      const db = client.db(dbName);
      // await db.collection(VehicleWiseMergedCollection).drop()  
      const VehicleWiseAggregator =[
        {
          $lookup: {
            from: "MergedData",
            localField: "veh_reg",
            foreignField: "Data.VehicleNo",
            as: "FinallData",
          },
        },{
          $out: VehicleWiseMergedCollection // Output the merged data to the MergedCollection
        }
      ]

      await db.collection(Collection2).aggregate(VehicleWiseAggregator).toArray();
      client.close();
      console.log("VehicleWiseAggregator Completed");
    }
    catch (err) {
      console.error('Error merging and inserting data:', err);
    }
}
mergeAndInsert();
