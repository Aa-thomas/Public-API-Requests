//fetches data from randomuser API
function fetchData(url) {
    return fetch(url)
              .then(checkStatus)
              .then( response => response.json() )
              .then(data => {
                  generateEmployees(data.results);
                  generateModal(data.results);
                  generateSearchBar(data.results); 
            })
              .catch( error => console.log('There was a problem with your request', error) );
}

//checks status and handles errors
function checkStatus(response) {
    if (response.ok === true) {
      return Promise.resolve(response) 
    } else {
      return Promise.reject( new Error(response.statusText) )
    }
}

const userData = fetchData('https://randomuser.me/api/?results=12&nat=us');




function generateEmployees(data) {
    for(let i = 0; i < data.length; i++) {
        const gallery = `<div class="card">
            <div class="card-img-container">
            <img class="card-img" src="${data[i].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
            <p class="card-text">${data[i].email}</p>
            <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
            </div>
            </div>`
        document.getElementById('gallery').insertAdjacentHTML('beforeend', gallery)    
    }
    document.querySelectorAll('div.card')
        .forEach( card => card.addEventListener('click', (event) => showModal(event)))
}

function generateModal(data) {
    for(let i = 0; i < data.length; i++) {
    const modal = `<div class="modal-container">
        <div class="modal">
        <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
        <div class="modal-info-container">
        <img class="modal-img" src="${data[i].picture.large}" alt="profile picture">
        <h3 id="name" class="modal-name cap">${data[i].name.first} ${data[i].name.last}</h3>
        <p class="modal-text">${data[i].email}</p>
        <p class="modal-text cap">${data[i].location.city}</p>
        <hr>
        <p class="modal-text">${data[i].phone}</p>
        <p class="modal-text">${data[i].location.street.number} ${data[i].location.street.name}, ${data[i].location.city}, ${data[i].location.state} ${data[i].location.postcode}</p>
        <p class="modal-text">Birthday: birthday</p>
        </div>
        </div>`;
    document.querySelector('body').insertAdjacentHTML('beforeend', modal);
    }
    document.querySelectorAll('#modal-close-btn')
        .forEach( button => button.addEventListener('click', () => closeModal() ) );
    
    closeModal();
    
}

function generateSearchBar(data) {
    const searchBar = `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>`;
    document.querySelector('div.search-container').insertAdjacentHTML('beforeend', searchBar);
    
    const searchButton = document.getElementById('search-submit');
    let searchInput = document.getElementById('search-input');
    
    searchButton.addEventListener('click', () => {
        searchFilter(data, searchInput.value );
        searchInput.value = '';
     });

     searchInput.addEventListener('keyup', (e) => {
        e.preventDefault();
        searchFilter(data, searchInput.value);
        // //Search when enter key(13) is pressed
        // if (e.keycode === 13) {
        //    searchButton.click();
        // }
     });
}


function searchFilter(data, searchQuery) {
        // An empty array where search results will be pushed to
        const searchResults = [];
        
        //Convert users search query to lowercase so that search can be case insensitive
        
        searchQuery.toLowerCase();
        
        //Reset items on page
        document.getElementById('gallery').innerHTML = '';
        
        //Loop through 'data'
        for (let i = 0; i < data.length; i++) {
           //Create string containing the employees first and last names and convert to lowercase
           const employeeFullName = `${data[i].name.first.toLowerCase()} ${data[i].name.last.toLowerCase()}`;
           
           //Push results into searchResults array
           if (employeeFullName.includes(searchQuery)) {
              searchResults.push(data[i]);
           }
        }
    generateEmployees(searchResults);
}
function getIndex(e) {
    const  employeeArray = Array.from(document.querySelectorAll('div.card'));
    const employeeIndex = employeeArray.indexOf(e.target.closest('div.card'));
    return employeeIndex;
}

function showModal(e) {
   const modal =  document.querySelectorAll('div.modal-container')[getIndex(e)];
   modal.style.display = 'block';
   
}

function closeModal() {
    document.querySelectorAll('div.modal-container')
        .forEach( modal => modal.style.display = 'none');
}