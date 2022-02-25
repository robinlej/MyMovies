// lib and imports
const express = require("express");
const app = express();
const movie = require("./controllers/movies.js")

// app setup
app.use(express.json())

app.use("/static", express.static("public"))
app.set("view engine", "ejs");


// pages and api
app.get('/',(req, res) => {
  res.render('movies.ejs');
});

app.get('/api/movie', movie.fetchdb)
app.post('/api/addmovie', (req, res) => {
  console.log('request done')
  movie.addmovie(req.body)
})
app.post('/api/deletemovie', (req, res) => {
  movie.deletemovie(req.body)
  console.log('deletemovie called')
})
app.post('/api/fetchfromomdb', (req, res) => {
  movie.fetchfromomdb(req.body, res)
})


app.listen(3000, () => console.log("Server Up and running"));
