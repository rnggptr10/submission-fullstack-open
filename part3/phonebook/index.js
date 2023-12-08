require("dotenv").config();
const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const db = require("./mongo");
const Person = require("./models/person");
const app = express();
let persons = [
  {
    id: 1,
    name: "Arto Hellas",
    number: "040-123456",
  },
  {
    id: 2,
    name: "Ada Lovelace",
    number: "39-44-5323523",
  },
  {
    id: 3,
    name: "Dan Abramov",
    number: "12-43-234345",
  },
  {
    id: 4,
    name: "Mary Poppendieck",
    number: "39-23-6423122",
  },
];

app.use(cors());
app.use(express.json());
app.use(morgan("tiny"));
db;

app.get("/api/persons", async (request, response) => {
  const person = await Person.find({});
  response.json(person);
});

app.get("/info", (request, response) => {
  response.send(
    "<p>Phonebook has info for 2 people</p><p>Sat Jan 22 2022 22:27 GMT+0200 (Eastern European Standard Time)</p>"
  );
});

app.get("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  const person = await Person.findById(id).exec();
  if (person) {
    response.json(person);
  } else {
    response.status(400).end();
  }
});

app.delete("/api/persons/:id", async (request, response) => {
  const id = request.params.id;
  await Person.findByIdAndDelete(id);

  response.status(204).end();
});

app.post("/api/persons", async (request, response) => {
  const body = request.body;

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: "name and number are required",
    });
  }

  const existingPerson = await Person.findOne({
    name: body.name.toUpperCase(),
  });

  if (existingPerson) {
    const person = await Person.findOneAndUpdate(
      { name: body.name.toUpperCase() },
      { number: body.number }
    );
    return response.json(person);
  }

  const person = new Person({
    name: body.name.toUpperCase(),
    number: body.number,
  });

  person.save().then((savePerson) => {
    response.json(savePerson);
  });
});

const PORT = process.env.PORT;
db().then(() => {
  app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
