// lib and imports
// require('dotenv').config()
const express = require("express");
const app = express();
const movie = require("./controllers/movies")

// app setup
app.use(express.json())

app.use("/static", express.static("public"))
app.set("view engine", "ejs");


// pages and api
app.get('/',(req, res) => {
  res.render('movies.ejs');
});

app.post('/api/addmovie', (req, res) => {
  movie.addmovie(req.body)
})
app.post('/api/deletemovie', (req, res) => {
  movie.deletemovie(req.body)
  console.log("deletemovie called")
})
app.get('/api/movie', movie.fetchdb)


app.listen(3000, () => console.log("Server Up and running"));
