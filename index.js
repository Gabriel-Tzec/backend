const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method);
  console.log('URL:', request.path);
  console.log('Body:', request.body);
  console.log('---');
  next();
}

const generateId = () => {
  const maxId = notes.length > 0 ? Math.max(...notes.map((n) => n.id)) : 0;
  return maxId + 1;
}

const PORT = process.env.PORT || 3001;

let notes = [
  {
    id: 1,
    content: "HTML is easy",
    important: true,
  },
  {
    id: 2,
    content: "Browser can execute only JavaScript",
    important: false,
  },
  {
    id: 3,
    content: "GET and POST are the most important methods of HTTP protocol",
    important: true,
  },
];

const app = express();
app.use(bodyParser.json());
app.use(requestLogger);
app.use(cors());
app.use(express.static('dist'));


app.get("/api/notes", (request, response) => {
  response.json(notes);
});

app.get("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  console.log(id);
  const note = notes.find((note) => note.id === id);

  if (note) {
    response.json(note);
  } else {
    response.status(404).end();
  }
});

app.delete("/api/notes/:id", (request, response) => {
  const id = Number(request.params.id);
  notes = notes.filter((notes) => notes.id !== id);
  response.status(204).end();
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if(!body.content) {
    return response.status(400),json({
        error: 'content missing'
    })
  }

  const note = {
    content: body.content,
    important: Boolean(body.importamt) || false,
    id: generateId()
  }

  const notes = notes.concat(note)

  response.json(note);
});

app.listen(PORT, () => {
  console.log(`El sevidor esta corriendo en el puerto ${PORT}`);
});


const unKnownEndpoint = (request, response) => {
  response.status(404).send({Error: 'Unknown endpoint'});
}