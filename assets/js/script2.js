function getStringWithIngredients(data) {
    if (data) {
        var strToNutritionsApi = ``;
        $.each(data, function (index, first) {
            if (first.measurements.length > 1) {
                $.each(first.measurements, function (index, value) {
                    if (value.unit.system === 'metric') {
                        strToNutritionsApi += `${value.quantity} ${value.unit.name} ${first.ingredient.name}\n`;
                    }
                })
            } else {
                strToNutritionsApi += `${first.raw_text}\n`;
            };
        });
    }
    return strToNutritionsApi;
}

function accordionWithInstructions(name, data) {
    var str = `
        <div class="card">
            <div class="card-header" id="headingOne">
                <h6 class="mb-0" data-toggle="collapse" data-target="#collapseOne" aria-expanded="true" aria-controls="collapseOne">
                    ${name}
                </h6>
            </div>
  
        <div id="collapseOne" class="collapse" aria-labelledby="headingOne" data-parent="#accordionExample">
            <div class="card-body">
                ${displayInstructionsInsideModal(data)}
            </div>
        </div>
    `
    return str;
}

function accordionWithIngredients(name, data) {
    var str = `
    <div class="card">
        <div class="card-header" id="headingTwo">
            <h6 class="mb-0 " data-toggle="collapse" data-target="#collapseTwo" aria-expanded="true" aria-controls="collapseTwo">
                ${name}
            </h6>
        </div>

    <div id="collapseTwo" class="collapse" aria-labelledby="headingTwo" data-parent="#accordionExample">
        <div class="card-body">
            ${displayRecipeIngredientsInsideModal(data)}
        </div>
    </div>`;
    
    return str;
}

function displayRecipeNutritions(data, numberOfServings) {
    var str = ``;
    str += `<p>Total servings: ${numberOfServings}</p>`
    str += `<p>Calories: ${data.calories} cal per serving</p>`
    str += `<p>Total Daily per serving</p>`
    if (data) {
        var arrNutritions = [];
        for (key in data) {
            var obj = '';
            obj = `${[key]}: ${data[key]}`;
            arrNutritions.push(obj);
        }
        var sortedNutritions = arrNutritions.filter(function (item) {
            return !item.includes('updated') && !item.includes('calories');
        }).sort();
        $.each(sortedNutritions, function (index, value) {
            str += `<p>${value}%</p>`;
        });

        return str;
    }
}

function accordionWithNutritions(name, data, numberOfServings) {
    var str = `
    <div class="card">
        <div class="card-header" id="headingThree">
            <h6 class="mb-0 " data-toggle="collapse" data-target="#collapseThree" aria-expanded="true" aria-controls="collapseThree">
                ${name}
            </h6>
        </div>

    <div id="collapseThree" class="collapse" aria-labelledby="headingThree" data-parent="#accordionExample">
        <div class="card-body">
            ${displayRecipeNutritions(data, numberOfServings)}
        </div>
    </div>`
    return str;
}


function displayInstructionsInsideModal(data) {
    if (data) {
        var str = ``;
        $.each(data, function (index, value) {
            str += `<p>${index + 1}. ${value.display_text}</p>`
        });
    }
    return str;
}


function getDataFromLocalStorage(name) {
    return JSON.parse(localStorage.getItem(name)) || [];
}

function saveDataToLocalStorage(name, data, formName) {

    var arrayOfObjectsFromLocalStorage = getDataFromLocalStorage(formName);
    // push new object to local storage name recipes object should looke like 

    var objectToLocalStorage = {};
    objectToLocalStorage[name] = data;
    arrayOfObjectsFromLocalStorage.push(objectToLocalStorage);
    localStorage.setItem('recipes', JSON.stringify(arrayOfObjectsFromLocalStorage));

}

function getRecipesFromApi(apiUrl, name, formName) {
    const settings = {
        "async": true,
        "crossDomain": true,
        "url": `${apiUrl}`,
        "method": "GET",
        "headers": {
            "X-RapidAPI-Key": "8923304c83msh3ab4a5c0cca5f63p13f4e1jsn0b238341c2a5",
            "X-RapidAPI-Host": "tasty.p.rapidapi.com"
        }
    };

    $.ajax(settings)
        .done(function (response) {
            // displayRecipes(response);
            saveDataToLocalStorage(name, response, formName);
            console.log('data from API saved in localStorage', response);
            displayRecipes(response)
        })
        .fail(function (err) {
            console.log(err);
        });
}

function getDataFromNutritionsApi(data) {
    const appId2 = 'd9735d53';
    const apiKey2 = 'a61170603a92f4152e4e7d175e72b1f3';
    var ingr = data.split('\n');
    return fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appId2}&app_key=${apiKey2}`, {
        method: 'POST',
        cache: 'no-cache',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ingr })

    }).then(response => response.json());
}

function handleNutritionsSubmit(formName) {
    var totalCalories = $('.total-calories');
    var tableBody = $('.table-body');
    var nutritionsToFind = $('input').val();
    if (!nutritionsToFind) {
        nutritionsOutput.html('');
        nutritionsOutput.append('<h1>Empty input</h1>');
        return;
    }
    // nutritionsOutput.append();
    getDataFromNutritionsApi(nutritionsToFind).then(
        function(data) {
            if(data.error === 'low_quality') {
                // console.clear();
                nutritionsOutput.append('<p>Please put more details</p>')
            } else {
                console.log(data);
                totalCalories.append(`${data.calories}cal`);
                if (data) {
                    var arrNutritions = [];
                    for (key in data.totalDaily) {
                        obj = `${data.totalDaily[key].label} ${Math.round(data.totalDaily[key].quantity)}%`;
                        console.log(obj);
                        arrNutritions.push(obj);
                    }
                    var sortedNutritions = arrNutritions.sort();
                    $.each(sortedNutritions, function (index, value) {
                        var nameAndValue = value.split(' ');
                        tableBody.append(`<tr><td>${nameAndValue.splice(0,nameAndValue.length-1).join(' ')}</td><td>${nameAndValue.splice(-1)}</td></tr>`);
                    });
            
                    // return str;
                }
            };
        }
    );
}

function displayRecipeIngredientsInsideModal(data) {
    if (data) {
        var strToModal = ``;
        $.each(data, function (index, first) {
            if (first.measurements.length > 1) {
                $.each(first.measurements, function (index, value) {
                    if (value.unit.system === 'metric') {
                        strToModal += `<p>${value.quantity} ${value.unit.name} ${first.ingredient.name}</p>`;
                    }
                })
            } else {
                strToModal += `<p>${first.raw_text}</p>`;
            };
        });
        return strToModal;
    }
}
// display Modal

function displayModal(recipeDetails, isntr, cardNumber, ingredientsNeddedGrams, recipeNutritions) {
    var numberOfServings = recipeDetails.num_servings;
    return `<div class="modal fade" id="staticBackdrop${cardNumber}" data-backdrop="static" data-keyboard="false" tabindex="-1" aria-labelledby="staticBackdropLabel" aria-hidden="true">
                <div class="modal-dialog">
                    <div class="modal-content">
                        <div class="modal-header">
                            <h5 class="modal-title" id="staticBackdropLabel">${recipeDetails.name}</h5>
                            <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                            <span aria-hidden="true">&times;</span>
                            </button>
                        </div>
                    <div class="modal-body">
                        <p>${recipeDetails.description}</p>
                        <div class="accordion" id="accordionExample">
                            ${accordionWithIngredients('Ingredients', ingredientsNeddedGrams)}
                            ${accordionWithInstructions('Instructions', isntr)}
                            ${accordionWithNutritions('Nutritions', recipeNutritions, numberOfServings)}
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal">Close</button>
                    </div>
                </div>
            </div>
        </div>`;
}

function displayCard(recipeDetails, cardNumber) {
    return `<div class="col card-size card-style-main">
                <div class="card">
                    <img src="${recipeDetails.thumbnail_url}" class="card-img-top" alt="...">
                    <div class="card-body d-flex flex-column">
                        <h5 class="card-title">${recipeDetails.name}</h5>
                        <button type="button" class="btn mt-auto button-style" data-toggle="modal" data-target="#staticBackdrop${cardNumber}">See more</button>
                    </div>
                </div>
            </div>`
}

function displayRecipes(data, recipeToFind) {
    var toDisplay = recipeToFind ? data[recipeToFind].results : data.results;
    var recipeIngredientsArray = [];
    var cardNumber = 0;
    if(!toDisplay.length) {
        $('.recipes-output').append('<h3>Recipes not found</h3>')
        return;
    }
    var maxValue = toDisplay.length > 5 ? 5 : toDisplay.length - 1;
    while (cardNumber <= maxValue) {

        // cooking instructions
        var isntr = toDisplay[cardNumber].instructions;
        // var ingredientsNeddedGrams = toDisplay[cardNumber].sections[0].components;
        if(toDisplay[cardNumber].sections) {
            recipeIngredientsArray.push(toDisplay[cardNumber].sections[0].components);
            var recipeNutritions = toDisplay[cardNumber].nutrition;
            var recipeDetails = toDisplay[cardNumber];
        }

        $('.recipes-output').append(`${displayCard(recipeDetails, cardNumber)} ${displayModal(recipeDetails, isntr, cardNumber, recipeIngredientsArray[cardNumber], recipeNutritions)}`);
        // $('.output').append(`${displayCard(recipesDetails)} ${displayInstructionModal(recipes,isntr, cardNumber)}`)
        cardNumber++;
    }
}

function handleRecipesSubmit(formName) {
    var recipeToFind = $('input').val();
    // check if input is empty
    if (!recipeToFind) {
        $('.recipes-output').append('<p>No results found</p>');
        return;
    }

    
    // if data in local storage get data from local storage
    var arrayOfObjectsFromLocalStorage = getDataFromLocalStorage(formName);
    
    var isUserSerchBefore = arrayOfObjectsFromLocalStorage.some(function (obj) {
        return obj[recipeToFind]
    });
    
    $('.recipes-output').html('');
    if (isUserSerchBefore) {
        var dataToDisplay = arrayOfObjectsFromLocalStorage.find(function (obj) {
            return obj[recipeToFind]
        });
        displayRecipes(dataToDisplay, recipeToFind);
    } else {
        var apiUrl = "https://tasty.p.rapidapi.com/recipes/list?from=0&size=20&tags=under_30_minutes&q=" + recipeToFind;
        console.log('user did not look for this before');
        getRecipesFromApi(apiUrl, recipeToFind, formName);
    }
}

function handleSubmit(formName) {
    $(`.${formName}`).submit(function (event) {
        event.preventDefault();

        if (formName === 'recipes') {
            handleRecipesSubmit(formName);
        } else if (formName === 'nutritions') {
            handleNutritionsSubmit(formName);
        }
    });
};



function init() {
    handleSubmit('recipes');
    handleSubmit('nutritions');
}

init();
