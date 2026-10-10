// lib/mongodb.js
import { Db, MongoClient, ServerApiVersion } from 'mongodb';

// const uri = String(process.env.MONGODB_URI);
// const uri = "mongodb+srv://terandina_official:W1I4LC=ruw8!3pevaS0!@terandinacore.rf6bv.mongodb.net/?retryWrites=true&w=majority&appName=TerandinaCore";

// const uri = "mongodb://127.0.0.1/"
const uri = String(process.env.PRODUCTION_DATABASE_URL);

class Mongo {
  private static instance: Mongo | null;
  private client: MongoClient;
  public clientPromise: MongoClient;

  private constructor() {
    this.client = new MongoClient(uri, {
      readPreference: 'primary',
      serverApi: {
        version: ServerApiVersion.v1,
        strict: process.env.NODE_ENV == 'production',
        deprecationErrors: true,
      },
      ssl: process.env.NODE_ENV != 'production',
      tls: process.env.NODE_ENV != 'production',
      connectTimeoutMS: 10000,
      serverSelectionTimeoutMS: 15000,
    });

    (global as any)._mongoClientPromise = this.client;
    this.clientPromise = this.client;
  }

  public static async getInstance(): Promise<Mongo> {
    if (!Mongo.instance) {
      try {
        Mongo.instance = new Mongo();
        await Mongo.instance.connect();
      } catch (err) {
        Mongo.instance = null;
        throw Error('Cannot connect to Mongo');
      }
    }
    return Mongo.instance;
  }

  private async connect(): Promise<void> {
    try {
      await this.client.connect();
    } catch (err) {
      console.log(err);
      throw Error('Cannot connect to Mongo');
    }
  }

  public async disconnect(): Promise<void> {
    try {
      await this.client.close();
      console.log('Disconnected from Mongo.');
    } catch (err) {
      console.error('Disconnection error');
    }
  }
}


export default Mongo;


