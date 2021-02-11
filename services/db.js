import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const dbPassword = process.env.db_password;
const dbName = process.env.db_name;
const dbUsername = process.env.db_username

const uri = `mongodb+srv://${dbUsername}:${dbPassword}@productmanager.gys9l.mongodb.net/${dbName}?retryWrites=true&w=majority`;
export const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true });
