//DEPENDENCIES
const express = require("express");
const path = require("path");
const fs = require("fs");
const { v4: uuidv4 } = require('uuid');



//EXPRESS CONFIGURATION
const app = express();
const PORT = process.env.PORT || 8080;
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(express.static("public"));

//LISTENER
app.listen(PORT, function () {
  console.log("App listening on PORT: " + PORT);
});

//HTML ROUTES
app.get("/notes", function(req,res) {
    res.sendFile(path.join(__dirname, "./public/notes.html"));
});

app.get("*", function(req, res) {
    res.sendFile(path.join(__dirname, "./public/index.html"));
});

//API ROUTES



app.get("/api/notes", function (req, res) {
    fs.readFile("./db/db.json", "utf8", function (err, data) {
      if (err) {
        console.log("An error occured");
        return console.log(err)
    }
    res.json(JSON.parse(data))
    console.log("not what you're looking");
  
    
});
});


// // POST /api/notes - Should receive a new note to save on the request body, add it to the db.json file, and then return the 
// // new note to the client.

  app.post("/api/notes", function (req, res) {
    // fs.readFile("./db/db.json", "utf8", function (err, data) {
    //   if (err) {
    //     console.log("An error occured");
    //     return console.log(err)
    // }
    let savedNotes = JSON.parse(fs.readFileSync("./db/db.json", "utf8"));
    let noteID = uuidv4();
    let addNote = {
      id: noteID,
      title: req.body.title,
      text: req.body.text
    }
 
    fs.writeFile("./db/db.json", JSON.stringify(addNote), "utf8", function (err) {
      if (err) throw err;
      console.log("The file has been saved");
      res.json(addNote);
      });
    });
  
    


// // DELETE /api/notes/:id - Should receive a query parameter containing the id of a note to delete. 
// // This means you'll need to find a way to give each note a unique id when it's saved. In order to delete a note, 
// // you'll need to read all notes from the db.json file, remove the note with the given id property, and then rewrite 
// // the notes to the db.json file.

app.delete("/api/notes/:id", (req, res) => {
  let noteID = req.params.id;
  fs.readFile("./db/db.json", "utf8", (err, data) => {
    if (err) throw err;

    const allNotes = JSON.parse(data);
    const newAllNotes = allNotes.filter(note => note.id != noteID);

  fs.writeFile("./db/db.json", JSON.stringify(newAllNotes, null, 2), err => {
    if (err) throw err;
    res.send(dbJSON);
    console.log("Note has been deleted")
  });
  });
});
