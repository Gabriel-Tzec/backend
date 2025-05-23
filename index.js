require("dotenv").config();
const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const Note = require("./models/note");

const PORT = process.env.PORT || 3001;

const unKnownEndpoint = (request, response) => {
  response.status(404).send({ Error: "Unknown endpoint" });
};

const app = express();
app.use(bodyParser.json());
//app.use(requestLogger);
app.use(cors());
app.use(express.static("dist"));


app.get("/api/notes", (request, response) => {
  Note.find({}).then((notes) => {
    response.json(notes);
  });
});

app.get("/api/notes/:id", (request, response, next) => {
  Note.findById(request.params.id)
    .then((note) => {
      if (note) {
        response.json(note);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete("/api/notes/:id", (request, response, next) => {

  Note.findByIdAndDelete(request.params.id)
  .then(result => {
    response.status(204).end()
  }).catch(error => next(error));
});

app.post("/api/notes", (request, response) => {
  const body = request.body;

  if (!body.content) {
    return (
      response.status(400),
      json({
        error: "content missing",
      })
    );
  }

  const note = new Note({
    content: body.content,
    important: Boolean(body.importamt) || false,
  });

  note.save().then((savedNote) => {
    response.json(savedNote);
  });
});

app.put("/api/notes/:id", (request, response) => {
   const body = request.body;

   const note = {
     content: body.content,
     important: body.important,
   }

   Note.findByIdAndUpdate(request.params.id, note, { new: true}).then(updateNote => {
    response.json(updateNote)
   }).catch( error => next(error));

});

app.listen(PORT, () => {
  console.log(`El sevidor esta corriendo en el puerto ${PORT}`);
});

const errorHandler = (error, request, response, next) => {
  console.error(error.message);

  if (error.name === "CastError") {
    return response.status(400).send({ error: "malformatted id" });
  }
};

app.use(unKnownEndpoint);
app.use(errorHandler);
