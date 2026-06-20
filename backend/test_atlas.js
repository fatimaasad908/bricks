import mongoose from 'mongoose';

const standardUri = "mongodb://asadfatima93_db_user:wPxFxphNYqyr0HED@ac-ic38spu-shard-00-00.kmqmamv.mongodb.net:27017,ac-ic38spu-shard-00-01.kmqmamv.mongodb.net:27017,ac-ic38spu-shard-00-02.kmqmamv.mongodb.net:27017/bricks_auth?ssl=true&replicaSet=atlas-gga88v-shard-0&authSource=admin&retryWrites=true&w=majority";

console.log("Attempting to connect to Atlas using standard URI...");
mongoose.connect(standardUri)
  .then(() => {
    console.log("SUCCESS: Connected to Atlas using standard connection string!");
    process.exit(0);
  })
  .catch(err => {
    console.error("FAILURE:", err);
    process.exit(1);
  });
