const mongoose = require('mongoose');
const connect = async () => {
  try {
    const options = {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      serverSelectionTimeoutMS: 15000,
      connectTimeoutMS: 15000, // give up initial connection after 15 seconds
      socketTimeoutMS: 30000, //default 0 (never disconnect)
    }
    mongoose.set('bufferTimeoutMS', 2000);

    let db_url = `mongodb://${process.env.MONGO_USER}:${process.env.MONGO_PASS}@${process.env.MONGO_HOST}:${process.env.MONGO_PORT}/${process.env.MONGO_DB_NAME}`; 
    const connection = await mongoose.connect(db_url, options)

    mongoose.connection.on('error', (err) => {
      console.log(err);
    });
  
  } catch (err){
    console.log(err);
  };
};


module.exports = connect;