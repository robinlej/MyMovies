// CODE TO ADD MOVIE TO DATABASE

const sqlite3 = require('sqlite3').verbose();

const fetchdb = (req, res) => {

  let sendData = {data: []};

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
      console.log(row)
      sendData.data.push(row)

    });
  });

  db.close((err) => {
    if (err) {
      console.error(err.message);
    }
    // console.log(sendData)
    res.send(sendData)
    console.log('Close the database connection.');
  });

}

const addmovie = (data) => {
  const item = data.data
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

const deletemovie = (data) => {
  let db = new sqlite3.Database('db/db.moviedatabase');
  db.run(`DELETE FROM movies WHERE imdbID=(?)`, [data.data.imdbID], function(err) {
      if (err) {
        return console.log(err);
      }
      // get the last insert id
      console.log(`A row has been deleted with rowid ${data.data.id}`);
  });

  db.close();
}


exports.addmovie = addmovie;
exports.deletemovie = deletemovie;
exports.fetchdb = fetchdb;