const mongoose = require("mongoose");

mongoose.set("strictQuery", false);

const URL = process.env.MONGODB_URI;

console.log("conectando a", URL);

mongoose
  .connect(URL)
  .then((result) => {
    console.log("se conecto a mongoDB");
  })
  .catch((error) => {
    console.log("error de conexion", error.message);
  });

const noteSchema = new mongoose.Schema({
  content: String,
  important: Boolean,
});

noteSchema.set("toJSON", {
  transform: (document, returnedObject) => {
    returnedObject.id = returnedObject._id.toString();
    delete returnedObject._id;
    delete returnedObject.__v;
  },
});

module.exports = mongoose.model("Note", noteSchema);
