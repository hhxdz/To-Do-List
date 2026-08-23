const { Long } = require('mongodb');
const { mongoose } = require('mongoose');
require('dotenv').config();

const MONGODB_URL = process.env.MONGODB_URL;

const connectDB = async() =>{
    try{
        await mongoose.connect(process.env.MONGODB_URL);
        console.log('Successfully connected to database');
        
    }catch(error){
        console.error('Error connecting to database', error.message);
        process.exit(1);
    }
}

module.exports =  connectDB;