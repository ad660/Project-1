//declaring the constants and variable we are going to use for the call

const recipeInput = document.getElementById('ingredients');
const output = document.getElementById('output');
const appId2 = '4130d60b';
const apiKey2 = '9676bf3430144b40f123de464a5abf50';


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
  return await response.json(); // when we get the response, this will be converted to an object

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

    Object.keys(data.totalDaily).forEach(key => {
      var obj = data.totalDaily[key];
      elements.push(`<dt>${obj.label}</dt><dd>${Math.round(obj.quantity)}${obj.unit}</dd>`);
    })

    //we inject our html with the data stored in elements
    var html = `
    <dl>
    <dt>Calories</dt>
    <dd>${data.calories}</dd>
    ${elements.join('')}
    </dl> 
    `
    output.innerHTML = html;
  });
})
,fetchDetails
}
 init();
