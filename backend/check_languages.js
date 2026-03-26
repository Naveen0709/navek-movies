import mongoose from "mongoose";

mongoose.connect("mongodb://127.0.0.1:27017/prime_clone", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(async () => {
  const db = mongoose.connection;
  const langs = await db.collection("movies").distinct("language");
  console.log("Distinct languages in DB:", langs);
  process.exit();
})
.catch(err => {
  console.error(err);
  process.exit(1);
});
