$('form').submit(function(event) {
    event.preventDefault();
    if(!($('input').val())){
        // console.log('no input');
        return;
    }
    // console.log($('input').val())
    var userInput = $('input').text('');
    // console.log(userInput.val());
    var findRecipes = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes&q=" + userInput.val();
    console.log('data from localStorages');
    displayRecipes();
    // getRecipesFromApi(findRecipes);
});

function saveRecipesToLocalStorage(data) {
    localStorage.setItem('recipes', JSON.stringify(data));
}

function getRecipesFromLocalStorage() {
    return JSON.parse(localStorage.getItem('recipes')) || [];
}


function displayRecipes() {
    var recipes = getRecipesFromLocalStorage();
    console.log(recipes);
    var cardNumber = 0;
    while(cardNumber <= 5) {
        $('.output').append(`
            <div class="col">
                <div class="card w-40 margin-class" style="width: 18rem;">
                    <img src="${recipes.results[cardNumber].thumbnail_url}" class="card-img-top" alt="...">
                    <div class="card-body">
                        <h5 class="card-title">${recipes.results[cardNumber].name}</h5>
                        <p class="card-text">${recipes.results[cardNumber].description}</p>
                        <a href="#" class="btn btn-primary">Instructions</a>
                    </div>
                </div>
            </div>`);   
        cardNumber++
    }
}

// tasty API call
function getRecipesFromApi(findRecipes) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${findRecipes}`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "8923304c83msh3ab4a5c0cca5f63p13f4e1jsn0b238341c2a5",
            "X-RapidAPI-Host": "tasty.p.rapidapi.com"
        }
    };
    
    $.ajax(settings).done(function (response) {
        // displayRecipes(response);
        saveRecipesToLocalStorage(response);
    });
}