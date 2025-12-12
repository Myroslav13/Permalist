import express from 'express';

const app = express();
const port = 3000;

const notes = ["Buy milk", "Finish homework"];

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

app.get("/", (req, res) => {
  res.render("index.ejs", {notes: notes});
});

app.post("/add", (req, res) => {
  const newtItem = req.body.new_item;
  
  if (newtItem) {
    notes.push(req.body.new_item);
  }
  
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});