require('dotenv').config()
const fetch = (...args) => import('node-fetch').then(({default: fetch}) => fetch(...args));
const sqlite3 = require('sqlite3').verbose();
const omdbApiKey = process.env.OMDB_API_KEY

// Fetch the movies from the DB
const fetchdb = (req, res) => {

  let sendData = []

  let db = new sqlite3.Database('db/db.moviedatabase', (err) => {
    if (err) {
      console.error(err.message);
    }
    console.log('Connected to the movies database.');
  });
   db.serialize(() => {
    db.each(`SELECT * FROM movies`, (err, row) => {
      if (err) {
        console.error(err.message);
      }
      sendData.push(row)

    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    res.send(JSON.stringify(sendData))
    console.log('Close the database connection.');
  });

}

// Add a movie to the DB
const addmovie = (data) => {
  console.log(data)
  const item = data
  const { title, year, released, runtime, genre, director, writer, actors, plot, language, country, awards, poster, imdb_rating, imdb_id, type } = item

  let db = new sqlite3.Database('db/db.moviedatabase');
  db.run(`INSERT INTO movies (Title, Year, Released, Runtime, Genre, Director, Writer, Actors, Plot, Language, Country, Awards, Poster, imdbRating, imdbID, Type) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)`, [title, year, released, runtime, genre, director, writer, actors, plot, language, country, awards, poster, imdb_rating, imdb_id, type], function(err) {
    if (err) {
      return console.log(err);
    }
    // get the last insert id
    console.log(`A row has been inserted with title ${item.title} and rowid ${this.lastID}`);
  });

  db.close();
}

// Delete a movie from the DB
const deletemovie = (data) => {
  let db = new sqlite3.Database('db/db.moviedatabase');
  db.run(`DELETE FROM movies WHERE imdbID=(?)`, [data.imdbID], function(err) {
      if (err) {
        return console.log(err);
      }
      // get the last insert id
      console.log(`A row has been deleted with rowid ${data.id}`);
  });

  db.close();
}

// Call the OMDB API with a movie ID
const fetchfromomdbwithid = async (movieID, movies) => {
  const response = await fetch(`http://www.omdbapi.com/?i=${movieID}&apikey=${omdbApiKey}`)
  const movieInfos = await response.json()
  console.log('Second fetch (search each movie with its ID, to retrieve all the data) done, sending data')
  movies.push(movieInfos)
}

// Call the OMDB API with a string search
const fetchfromomdb = async (req, res) => {
  console.log('Fetch to OMDB API initialized')

  let movies = []

  const response = await fetch(`http://www.omdbapi.com/?s=${req.search}&apikey=${omdbApiKey}&`)
  const data = await response.json()
  
  console.log('First fetch (search through movie titles) done')

  for (const movie of data.Search) {
    if (movie.Type === 'movie') {
      const movieID = await movie.imdbID

      await fetchfromomdbwithid(movieID, movies)  
    }
  }
  res.send(JSON.stringify(movies))
}

exports.addmovie = addmovie;
exports.deletemovie = deletemovie;
exports.fetchdb = fetchdb;
exports.fetchfromomdb = fetchfromomdb;