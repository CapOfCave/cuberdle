import { Handler } from '@netlify/functions';
import { Db, MongoClient } from 'mongodb';

const DB_CONNECTION_STRING = process.env.DB_CONNECTION_STRING || 'mongodb://localhost:27017';

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
  if (cachedDb) {
    return cachedDb;
  }

  // Connect to our MongoDB database hosted on MongoDB Atlas
  const client = await MongoClient.connect(DB_CONNECTION_STRING);
  // Specify which database we want to use
  const db = client.db("cuberdle-db");

  cachedDb = db;
  return db;
}

export const handler: Handler = async (event, context) => {
  
  const headers = process.env.NODE_ENV === "production" ? undefined : {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET'
  };


  /* By default, the callback waits until the runtime event loop is empty before freezing the process and returning the results to the caller. Setting this property to false requests that AWS Lambda freeze the process soon after the callback is invoked, even if there are events in the event loop. AWS Lambda will freeze the process, any state data, and the events in the event loop. Any remaining events in the event loop are processed when the Lambda function is next invoked, if AWS Lambda chooses to use the frozen process. */
  context.callbackWaitsForEmptyEventLoop = false;

  // Get an instance of our database
  const db = await connectToDatabase();

  const today = new Date();
  let yesterday = new Date();
  yesterday.setDate(yesterday.getDate() - 1);

  const challenges = await db.collection("daily-challenges").findOne({
    date: {
      $gt: yesterday,
      $lte: today,
    }
  });

  if (!challenges || !challenges.normal) {
    return {
      statusCode: 404,
      headers,
      body: JSON.stringify({
        message: `No data found for this date.`,
      }),
    }
  }

  return {
    statusCode: 200,
    headers,
    body: JSON.stringify({
      id: challenges.id,
      normal: challenges.normal && {
        id: `normal-${challenges.id}`,
        solution: challenges.normal,
      },
      easy: challenges.easy && {
        solution: challenges.easy,
      },
      medium: challenges.medium && {
        solution: challenges.medium,
      },
      hard: challenges.hard && {
        solution: challenges.hard,
      }
    }),
  }
}
