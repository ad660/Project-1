const titleInput = document.getElementById('title');
const recipeInput = document.getElementById('ingredients');
const output = document.getElementById('output');
const appId2 = '4130d60b';
const apiKey2 = '9676bf3430144b40f123de464a5abf50';


function noMatch(){
    output.innerHTML = "<p>No result found.</p>"
}

function fetchDetails(){
 
  var ingr = recipeInput.value.split('\n');

  return fetch(`https://api.edamam.com/api/nutrition-details?app_id=${appId2}&app_key=${apiKey2}`,{
    method: 'POST',
    cache: 'no-cache',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ingr})

  }).then(response => response.json());

}


function init (){
document.getElementById('check-form').addEventListener('submit',function(e){ 
  e.preventDefault();

  fetchDetails().then(data => {

    var elements = [];

    Object.keys(data.totalDaily).forEach(key => {
      var obj = data.totalDaily[key];
      elements.push(`<dt>${obj.label}</dt><dd>${Math.round(obj.quantity)}${obj.unit}</dd>`);
    })
    
    var html = `
    <dl>
    <dt>Calories</dt>
    <dd>${data.calories}</dd>
    ${elements.join('')}
    </dl>;   
    `
    output.innerHTML = html;
  });
})
,fetchDetails}
 init();
