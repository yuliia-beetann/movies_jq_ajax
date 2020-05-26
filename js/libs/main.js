'use strict';

const API_KEY = '29bb47b7552ec502eb87cebfbc77f766';
const API_URL = 'https://api.themoviedb.org/3';
const IMG_URL = 'https://image.tmdb.org/t/p/w185_and_h278_bestv2';

$(document).ready(function() {

  //EVENTS
  $('.search__btn').click(() => {
    getMovie()
  })

  $('.search__field').keypress((e) => {
    if (e.keyCode === 13) {
      getMovie()
    }
  })

  $('.reviews__close').click(()=>{
    closeReview()
  })

  $('.window').mouseup(function (e){ 
    let div = $('.reviews')
    if (!div.is(e.target) 
        && div.has(e.target).length === 0) { 
      closeReview() 
    }
  })


  //FUNCTIONS
  function getMovie() {
    let query = $('.search__field').val()

    $('body').addClass('loading')

    if (query !== '') {

      $('.movie').remove()

      $.ajax({
        url: `${API_URL}/search/movie`,
        type: 'GET',
        dataType: 'json',
        data: {
          api_key: API_KEY,
          query: query
        }
      }).then((res) => {
        if (res.results.length === 0) {
          alert('No movies found')
        } else {
          res.results.forEach((movie) => {
            if (movie.poster_path !== null)
            $('.movies').append(drawMovie(movie))
            let $movie = $('.movies').find(`.${movie.id}`)
            $movie.click(()=>getReviews(movie.id))
          })
        }
        $('body').removeClass('loading')
      })
    }
  }


  function drawMovie(movie) {
    let movieDOM = `<div class="movie ${movie.id}">
                      <img class="movie__poster" src="${IMG_URL + movie.poster_path}" alt="">
                      <h2 class="movie__title">${movie.title}</h2>
                      <div class="movie__info">
                        <h3><b>Release date: </b>${movie.release_date}</h3>
                        <h3><b>Rating: </b>${movie.vote_average}</h3>
                        <p>${movie.overview}</p>
                      </div>
                    </div>`
    return movieDOM
  }

  function getReviews(id) {
    $.ajax({
      url: `${API_URL}/movie/${id}`, // дописать после ид /review or /reviews
      type: 'GET',
      dataType: 'json',
      data: {
        api_key: API_KEY
      }
    }).then((res) => {
        drawReview(res)
      })
  }

  function drawReview(movie) {
    console.log(movie.overview)
    $('.window').addClass('hide--off')
    $('.reviews__title').text(movie.title)
    $('.reviews__content').text(movie.overview)
  }

  function closeReview() {
    $('.window').remove('hide--off')
  }

})
    
