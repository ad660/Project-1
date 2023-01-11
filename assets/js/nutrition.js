//declaring the constants and variable we are going to use for the call

const recipeInput = document.getElementById('ingredients');
const output = document.getElementById('output');
const appId2 = 'd9735d53';
const apiKey2 = 'a61170603a92f4152e4e7d175e72b1f3';
var tableBody = document.querySelector('.table-body');
var totalCalories = document.querySelector('.total-calories');
//this will reset the form

var reset = document.getElementById('reset')
    reset.addEventListener('click', ()=> {
      tableBody.innerHTML = " "
})

// this function retrieves the data from the API
async function fetchDetails(){
 
  //the API expects the ingredients as an array called ingr with each ingredient listed on a separate line  
  var ingr = recipeInput.value.split('\n');

  const response = await fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appId2}&app_key=${apiKey2}`, {
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ ingr }) //we are going to stringify an object having one property
  });
  //error handling
  if (response.ok) {
    return await response.json(); // when we get the correct response, this will be converted to an object
  } else if(response.status == 555){
    throw new SyntaxError("Incomplete or incorrect data");
  }
   else {
    throw Error(response.statusText);
  }
  

}

function init (){
//gets the information from the form and makes the request once we click submit. We also need to prevent the default action on the form
document.getElementById('check-form').addEventListener('submit',function(e){ 
  e.preventDefault();

  //the fetchDetails function runs and then we need to use the data which comes back in JSON format
  fetchDetails().then(data => {

    //the API returns an array totalDaily and we are using the elements array to get all keys of the totalDaily.
    // The properties for the keys will be stored into obj
    var elements = [];
    var nutritionsArray = [];
    totalCalories.insertAdjacentHTML('beforeend',
     `<th>${data.calories}</th>`)
    Object.keys(data.totalDaily).forEach(key => {
        strToArray = `${data.totalDaily[key].label} ${Math.round(data.totalDaily[key].quantity)}%`;
        nutritionsArray.push(strToArray);

    });
    var sortedArray = nutritionsArray.sort();
    console.log(sortedArray)
    sortedArray.forEach(function(item) {
        var nameAndValue = item.split(' ');
        tableBody.insertAdjacentHTML('beforeend',
            `<tr>
                <td>${nameAndValue.splice(0,nameAndValue.length-1).join(' ')}</td>
                <td>${nameAndValue.splice(-1)}</td>
            </tr>`
        );
    })

    //we inject our html with the data stored in elements
    // var html = `
    // <dl>
    // <dt>Calories</dt>
    // <dd>${data.calories}</dd>
    // ${elements.join('')}
    // </dl> 
    // `
    // output.innerHTML = html;
  }) //catching the errors, if any
  .catch((error =>{
    if (error instanceof ReferenceError) {
            
        output.innerHTML = "<p>Please enter the quantity and ingredients to check</p>";
    }
    else if (error instanceof SyntaxError){
      output.innerHTML = "<p>Incomplete or incorrect data. Please try again, adding the quantity and the ingredients</p>";
    }
    else{
      output.innerHTML = error + " " +"<p>There was an error, please try again</p>";
    }
   }
   ));
})
,fetchDetails
}
 init();