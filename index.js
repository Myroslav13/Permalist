import express from 'express';
import pg from 'pg';

const app = express();
const port = 3000;

const notes = [];

app.use(express.urlencoded({extended: true}));
app.use(express.static("public"));

const db = new pg.Client({
  user: "postgres",
  host: "localhost",
  database: "Udemy",
  password: "myroslav13",
  port: 5432,
});

db.connect();

async function getAllData(db, notes) {
  const result = await db.query("SELECT * FROM todotasks");
  const data = result.rows;

  data.forEach(element => {
    notes.push(element);
  });
}

app.get("/", async (req, res) => {
  notes.length = 0;
  await getAllData(db, notes);
  res.render("index.ejs", {notes: notes});
});

app.post("/add", async (req, res) => {
  const newItem = req.body.new_item;
  
  if (newItem) {
    await db.query("INSERT INTO todotasks (task) VALUES ($1)", [newItem]);
    res.redirect("/");
  } else {
    res.render("index.ejs", {notes: notes, error: "Enter something"});
  }
});

app.post("/edit/:id", async (req, res) => {
  const id = req.params.id;
  const updatedItem = req.body.edited_item;
  
  if (updatedItem) {
    await db.query("UPDATE todotasks SET task = $1 WHERE id = $2", [updatedItem, id]);
    res.redirect("/");
  } else {
    res.render("index.ejs", {notes: notes, error: "Enter something"});
  }
});

app.post("/delete/:id", async (req, res) => {
  const id = req.params.id;
  await db.query("DELETE FROM todotasks WHERE id = $1", [id]);
  res.redirect("/");
});

app.listen(port, () => {
  console.log(`Successfully listening to port ${port}`);
});