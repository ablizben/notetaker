//DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require("uuid");

//EXPRESS CONFIGURATION
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//API ROUTES
  app.get("/api/notes", (req, res) => {
    fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) {
      console.log("An error occured");
      return console.log(err);
    }
    res.json(JSON.parse(data));
  });
});

  app.post("/api/notes", (req, res) => {
  let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
  let noteID = uuidv4();
  let addNote = {
    id: noteID,
    title: req.body.title,
    text: req.body.text,
  };

  savedNotes.push(addNote);

  fs.writeFile("./db/db.json", JSON.stringify(savedNotes), "utf8", (err) => {
    if (err) throw err;
    res.json(addNote);
  });
})


//DELETE
app.delete("/api/notes/:id", (req, res) => {
  let noteID = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const allNotes = JSON.parse(data);
    const newAllNotes = allNotes.filter((note) => note.id != noteID)

    fs.writeFile(
      "./db/db.json",
      JSON.stringify(newAllNotes, null, 2),
      (err) => {
        if (err) throw err;
        res.json(newAllNotes);
      }
    );
  });
});

//HTML ROUTES
  app.get("/notes", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/notes.html"));
});

  app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "./public/index.html"));
});

//LISTENER
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});