import { MongoClient } from "mongodb";
import { config } from "dotenv";

config();

const uri = process.env.MONGODB_URI as string;
const client = new MongoClient(uri);
const dbName = process.env.DB_NAME as string;
let db;

async function connectToDatabase() {
  try {
    await client.connect();
    db = client.db(dbName);
    console.log("Connected to MongoDB");
    return db;
  } catch (error) {
    console.error("Failed to connect to MongoDB:", error);
    throw error;
  }
}

const dbPromise = connectToDatabase();

// Collection references
export const getCollection = async (collectionName: string) => {
  const database = await dbPromise;
  return database.collection(collectionName);
};

export const collections = {
  users: () => getCollection("users"),
  cards: () => getCollection("cards"),
  cardCount: () => getCollection("card_count"),
  tradeList: () => getCollection("trade_list"),
  cardList: () => getCollection("card_list")
};

export default { getCollection, collections };