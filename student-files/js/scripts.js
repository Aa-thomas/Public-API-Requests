//fetches data frmo randomuser API
function fetchData(url) {
    return fetch(url)
              .then(checkStatus)
              .then( response => response.json() )
              .then(data => showdata(data.results ) )
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




function showdata(data) {
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
        document.getElementById('gallery').insertAdjacentHTML('beforeend', gallery)        }
}

// function showModal() {
//     const modal = <div class="modal-container">
//         <div class="modal">
//         <button type="button" id="modal-close-btn" class="modal-close-btn"><strong>X</strong></button>
//         <div class="modal-info-container">
//             <img class="modal-img" src="https://placehold.it/125x125" alt="profile picture">
//             <h3 id="name" class="modal-name cap">name</h3>
//             <p class="modal-text">email</p>
//             <p class="modal-text cap">city</p>
//             <hr>
//             <p class="modal-text">(555) 555-5555</p>
//             <p class="modal-text">123 Portland Ave., Portland, OR 97204</p>
//             <p class="modal-text">Birthday: 10/21/2015</p>
//         </div>
//         </div>
// }

function fetchModalData(url) {
         fetch(url)
              .then(checkStatus)
              .then( response => response.json() )
       return .then(data => data.results ) 
              .catch( error => console.log('There was a problem with your request', error) );
}
