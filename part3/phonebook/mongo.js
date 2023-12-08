const mongoose = require("mongoose");
const Person = require("./models/person");
const url = process.env.MONGODB_URI;
console.log("connecting to", url);

const initialData = [
  {
    name: "Arto Hellas",
    number: 040123456,
  },
  {
    name: "Ada Lovelace",
    number: 39445323523,
  },
  {
    name: "Dan Abramov",
    number: 1243234345,
  },
  {
    name: "Mary Poppendieck",
    number: 39236423122,
  },
];

const db = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected to MongoDB");

    const personCount = await Person.countDocuments({});

    if (personCount === 0) {
      await Person.insertMany(initialData);
      console.log("Initial data inserted into Person collection");
    }
  } catch (error) {
    console.log("error connecting to MongoDB:", error.message);
  }
};

module.exports = db;
