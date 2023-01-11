var randomRecipies = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=3&tags=under_30_minutes";


const options = {
	method: 'GET',
	headers: {'X-RapidAPI-Key': 'fe96bdb19dmshe4b8c86e4fdcf01p13d7b4jsn3cfdcad9eda3', 'X-RapidAPI-Host': 'tasty.p.rapidapi.com'}
};

fetch('https://tasty.p.rapidapi.com/recipes/list?from=0&size=3&tags=under_30_minutes', options)
	.then(response => response.json())
    .then(response => console.log(response.results[1].name))
	.catch(err => console.error(err));
    console.log(response.results[0].name)


function getRecipes() {
    var request;
    event.preventDefault();

    request = $.ajax({

    })
}

function showRecipies() {

  var cardNumber = 0;
  while (cardNumber <= 2) {
    $(".output").append(`    
<div class="card" style="width: 18rem;">
<img src="..." class="card-img-top" alt="...">
<div class="card-body">
  <h5 class="card-title">${response.results[0].name}</h5>
  <p class="card-text">Some quick example text to build on the card title and make up the bulk of the card's content.</p>
  <a href="#" class="btn btn-primary">Go somewhere</a>
</div>
</div>`);
    cardNumber++;
  }
}
showRecipies();

function getRecipiesAPI(randomRecipies) {
  const settings = {
    async: true,
    crossDomain: true,
    url: "https://tasty.p.rapidapi.com/recipes/list?from=0&size=3&tags=under_30_minutes",
    method: "GET",
    headers: {
      "X-RapidAPI-Key": "fe96bdb19dmshe4b8c86e4fdcf01p13d7b4jsn3cfdcad9eda3",
      "X-RapidAPI-Host": "tasty.p.rapidapi.com",
    },
  };

  $.ajax(settings).done(function (response) {
    console.log(response);
  });
}

