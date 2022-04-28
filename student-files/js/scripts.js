fetchData('https://randomuser.me/api/?results=12&nat=us');

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
        .forEach( card => card.addEventListener('click', (event) => showModalOnClick(event)))
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
            </div>
            <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
            </div>`;
        document.querySelector('body').insertAdjacentHTML('beforeend', modal);
    }
    document.querySelectorAll('#modal-close-btn')
        .forEach( button => button.addEventListener('click', () => closeActiveModal() ) );
    
    document.querySelectorAll('#modal-next')
       .forEach( button => {button.addEventListener('click', () => nextModal() ) });

    document.querySelectorAll('#modal-prev')
       .forEach( button => {button.addEventListener('click', () => prevModal() ) });

    document.addEventListener('keyup', (e) => {
        if (document.getElementById('active-modal') !== null) {
            if (e.key === "ArrowRight") {
                document.querySelector('#modal-next').click()
            }
            if (e.key === "ArrowLeft") {
                document.querySelector('#modal-prev').click()
            }
        }
    })
    
    document.querySelectorAll('div.modal-container')
       .forEach( modal => modal.style.display = 'none');
    
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

function searchFilter(employeeList, searchQuery) {
        //Reset items on page
        document.getElementById('gallery').innerHTML = '';
        document.querySelectorAll('div.modal-container')
            .forEach( modal => modal.remove() )

        //Convert users search query to lowercase so that search can be case insensitive
        searchQuery = searchQuery.toLowerCase();

        // An empty array where search results will be pushed to
        const searchResults = [];
    
        employeeList.forEach( employee =>  {
            let employeeFullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`;

            if (employeeFullName.includes(searchQuery)) {
              searchResults.push(employee);
            }
        })
    generateEmployees(searchResults);
    generateModal(searchResults);
}

function getCardIndex(e) {
    const  employeeCardArray = Array.from(document.querySelectorAll('div.card'));
    const employeeCardIndex = employeeCardArray.indexOf(e.target.closest('div.card'));
    return employeeCardIndex;
}

function showModal(modal) {
    modal.style.display = 'block';
    modal.setAttribute('id', 'active-modal' );
}

function showModalOnClick(e) {
   const modal =  document.querySelectorAll('div.modal-container')[getCardIndex(e)];
   showModal(modal);   
}

function closeActiveModal() {
    const activeModal = document.getElementById('active-modal');
    activeModal.style.display = 'none';
    activeModal.removeAttribute('id');       
}

function getModalIndex() {
    const  modalArray = Array.from(document.querySelectorAll('div.modal-container'));
    const modalIndex = modalArray.indexOf(document.getElementById('active-modal'));
    return modalIndex;
}

function nextModal() {
    const nextModal =  document.querySelectorAll('div.modal-container')[getModalIndex() + 1];
    closeActiveModal();
    showModal(nextModal)
}

function prevModal() {
    const prevModal =  document.querySelectorAll('div.modal-container')[getModalIndex() - 1];
    closeActiveModal();
    showModal(prevModal)
}


