import { Handler } from '@netlify/functions';
import { Db, MongoClient } from 'mongodb';
import { generateScramble } from '../../src/generator';

const DB_CONNECTION_STRING_CREATOR = process.env.DB_CONNECTION_STRING_CREATOR || 'mongodb://localhost:27017';

const CHALLENGE_BUFFER = (process.env.CHALLENGE_BUFFER && parseInt(process.env.CHALLENGE_BUFFER)) || 10;

let cachedDb: Db | null = null;

async function connectToDatabase(): Promise<Db> {
    if (cachedDb) {
        return cachedDb;
    }

    // Connect to our MongoDB database hosted on MongoDB Atlas
    const client = await MongoClient.connect(DB_CONNECTION_STRING_CREATOR);
    // Specify which database we want to use
    const db = client.db("cuberdle-db");

    cachedDb = db;
    return db;
}

function addDays(date, days) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    return result;
}

export const handler: Handler = async (_event, _context) => {
    const db = await connectToDatabase();

    // find date of last challenge
    const newestChallenges = await db.collection("daily-challenges")
        .find()
        .sort({ date: -1 })
        .limit(1)
        .next();

    const lastChallengeDate = newestChallenges!.date as Date;
    const today = new Date();

    const diff = today.getTime() - lastChallengeDate.getTime();

    const newChallenges: any[] = [];
    for (let i = 1; i < Math.ceil(diff / 1000 / 60 / 60 / 24) + 1 + CHALLENGE_BUFFER; i++) {
        const date = addDays(lastChallengeDate, i);

        const easy = generateScramble(5, false);
        const medium = generateScramble(6, true);
        const hard = generateScramble(7, true);

        const infiniteNoDouble = generateScramble(50, false);
        const infiniteDouble = generateScramble(50, true);

        newChallenges.push({
            date,
            normal: easy,
            easy,
            medium,
            hard,
            infiniteDouble,
            infiniteNoDouble,
            id: newestChallenges!.id + i,
        })
    }

    if (newChallenges.length == 0) {
        console.log("Nothing to insert, generation completed successfully.")
    } else {
        const reply = await db.collection("daily-challenges").insertMany(newChallenges)
        console.log(reply)
    }

    return {
        statusCode: 200,
        body: JSON.stringify({
            count: 0
        }),
    }
}


