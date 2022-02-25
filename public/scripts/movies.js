const movieContainer = document.querySelector('.search-results-container')
const searchBtn = document.querySelector('.search-btn')
const loadMoviesbtn = document.querySelector('.load-saved-movies')
const searchInput = document.querySelector('.searchbox')

// Create the card (HTML structure) for each movie
const createCard = (movie) => {
  let movieCard = `
  <section id="${movie.imdbID}" class="card">
      <div class="card-main-image-container">
          <img src="${movie.Poster}" alt="Poster of ${movie.Title}" class="card-main-image">
          <div class="card-main-image-layer"></div>
      </div>
      <button class="btn tag-btn add-to-db card-action"></button>
      <div class="card-content">
          <h2 class="card-title" title="${movie.Title}">${movie.Title.length > 30 ? movie.Title.substring(0,30) + '...' : movie.Title}</h2>
          <div class="card-tags">
              <div class="card-year">${movie.Year}</div>
              <div class="card-genre">${movie.Genre}</div>
          </div>
          <div class="card-description">${movie.Plot}</div>
          <div class="card-infos">
              <div class="card-director"><strong>Directed by:</strong> ${movie.Director}</div>
              <div class="card-writer"><strong>Scenario by:</strong> ${movie.Writer}</div>
              <div class="card-actors"><strong>Main actors:</strong> ${movie.Actors}</div>
          </div>
      </div>
  </section>`

    movieContainer.insertAdjacentHTML('beforeend', movieCard)
}

// Prepares an object movieEntry to pass to the DB & adds an event listener on the button to Add to the DB
const allowMovieEntry = (movie) => {
  const movieEntry = {
    title: movie.Title,
    year: movie.Year,
    released: movie.Released,
    runtime: movie.Runtime,
    genre: movie.Genre,
    director: movie.Director,
    writer: movie.Writer,
    actors: movie.Actors,
    plot: movie.Plot,
    language: movie.Language,
    country: movie.Country,
    awards: movie.Awards,
    poster: movie.Poster,
    imdb_rating: movie.imdbRating,
    imdb_id: movie.imdbID,
    type: movie.Type,
  }
  const cardActionBtns = document.querySelectorAll('.card-action')
  const cardActionBtn = cardActionBtns[cardActionBtns.length - 1] // select the last button created
  cardActionBtn.textContent = 'Add to my list'
  addEventListenerOnActionBtn(cardActionBtn, 'add', movieEntry)
}

/**
 * API fetch done in the backend to protect the API key
 * @param {object} movie - object {search: ...} to call the API
 * @returns {array} data - array of objects
 */
const fetchFromOMDB = async (movie) => {
  const response = await fetch('api/fetchfromomdb', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(movie),
  })
  const data = await response.json()
  return await data
}

// Launch the search
const searchMovies = async (movie) => {
  movieContainer.innerHTML = ""

  const moviesInfos = await fetchFromOMDB({search: movie})
  moviesInfos.forEach(movieInfos => {
    createCard(movieInfos)
    allowMovieEntry(movieInfos)
  })
}

// Prepare the element container, inserts the cards fetched from the DB, add an event listener on the button of each card & adds the content of the button  
const getFromDB = () => {
  fetch('api/movie', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
    }
  })
  .then(response => response.json())
  .then(data => {
    movieContainer.innerHTML = ''

    data.forEach(movie => {
      createCard(movie)
      
      const cardActionBtns = movieContainer.querySelectorAll('.card-action')
      const cardActionBtn = cardActionBtns[cardActionBtns.length - 1] // select the last button created
      cardActionBtn.textContent = 'Delete from my list'
      addEventListenerOnActionBtn(cardActionBtn, 'delete', movie)
    })
  })
  .catch((error) => {
    console.error('Error:', error);
  })
}

// Add an object to the DB
const addToDB = (infos) => {
  fetch('api/addmovie', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(infos),
  })
  .then(response => response.json())
  .then(data => {
    // console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}

// Deletes an object from the DB
const deleteFromDB = (infos) => {
  fetch('api/deletemovie', {
    method: 'POST', // or 'PUT'
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(infos),
  })
  .then(response => response.json())
  .then(data => {
    // console.log('Success:', data);
  })
  .catch((error) => {
    console.error('Error:', error);
  });
}


// ENTRY POINTS
searchBtn.addEventListener('click', (event) => {
  searchMovies(searchInput.value)
})

searchInput.addEventListener('keyup', (e) => {
  if (e.key === 'Enter') {
      searchMovies(e.target.value)
  }
})

// action is a string: either 'add' or 'delete'
const addEventListenerOnActionBtn = (btn, action, objectItem) => {
  const dbAction = action === 'add' ? addToDB : deleteFromDB
  const classAddedToBtn = action === 'add' ? 'added' : 'deleted'
  const innerText = action === 'add' ? 'Added to my list' : 'Deleted from my list'

  btn.addEventListener('click', () => {
      dbAction(objectItem)
      btn.classList.add(classAddedToBtn)
      btn.textContent = innerText
  })
}

loadMoviesbtn.addEventListener('click', (event) => {
  getFromDB()
})