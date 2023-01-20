/**
 * Fetches random user data from the randomuser API
 * @param {string} randomUserAPI - The url being requested
 * @returns - A Promise object containing data from randomUserAPI that is used to generate employee information
 */
function getRandomUsers(randomUserAPI) {
	return fetch(randomUserAPI)
		.then((response) => checkStatus(response))
		.then((response) => response.json())
		.then((data) => {
			console.log(data);
			generateEmployees(data.results);
			generateModal(data.results);
			generateSearchBar(data.results);
		})
		.catch((error) =>
			console.log('There was a problem with your request', error)
		);
}

//checks status and handles errors
function checkStatus(response) {
	return response.ok
		? Promise.resolve(response)
		: Promise.reject(new Error(response.statusText));
}

getRandomUsers('https://randomuser.me/api/?results=12&nat=us');

/**
 * Generates employee cards that will display employee information and adds avent listeners
 * @param {Array} data - An array of objects containing employee information
 */
function generateEmployees(data) {
	for (let i = 0; i < data.length; i++) {
		const gallery = `<div class="card">
            <div class="card-img-container">
            <img class="card-img" src="${data[i].picture.large}" alt="profile picture">
            </div>
            <div class="card-info-container">
            <h3 id="name" class="card-name cap">${data[i].name.first} ${data[i].name.last}</h3>
            <p class="card-text">${data[i].email}</p>
            <p class="card-text cap">${data[i].location.city}, ${data[i].location.state}</p>
            </div>
            </div>`;
		document
			.getElementById('gallery')
			.insertAdjacentHTML('beforeend', gallery);
	}
	document
		.querySelectorAll('div.card')
		.forEach((card) =>
			card.addEventListener('click', (event) => showModalOnClick(event))
		);
}

/**
 * Generates Modal for each employee and adds event listeners
 * @param {Array} data - An array of objects containing employee information
 */
function generateModal(data) {
	for (let i = 0; i < data.length; i++) {
		const birthdayTimestamp = data[i].dob.date;
		const birthday = new Date(birthdayTimestamp);
		const birthdayFormatted = birthday.toLocaleDateString('en-US', {
			day: 'numeric',
			month: 'short',
			year: 'numeric',
		});
		console.log(birthdayFormatted);
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
            <p class="modal-text">Birthday: ${birthdayFormatted}</p>
            </div>
            </div>
            <div class="modal-btn-container">
            <button type="button" id="modal-prev" class="modal-prev btn">Prev</button>
            <button type="button" id="modal-next" class="modal-next btn">Next</button>
            </div>
            </div>`;
		document.querySelector('body').insertAdjacentHTML('beforeend', modal);
	}
	// Event listener: Close Modal Button
	document
		.querySelectorAll('#modal-close-btn')
		.forEach((button) =>
			button.addEventListener('click', () => closeActiveModal())
		);

	// Event listener: Next Modal Button
	document.querySelectorAll('#modal-next').forEach((button) => {
		button.addEventListener('click', () => nextModal());
	});

	// Event listener: Previous Modal Button
	document.querySelectorAll('#modal-prev').forEach((button) => {
		button.addEventListener('click', () => prevModal());
	});

	// Event listener: Arrow Keys
	document.addEventListener('keyup', (e) => {
		if (document.getElementById('active-modal') !== null) {
			if (e.key === 'ArrowRight') {
				nextModal();
			}
			if (e.key === 'ArrowLeft') {
				prevModal();
			}
		}
	});

	//Hide all modals
	document
		.querySelectorAll('div.modal-container')
		.forEach((modal) => (modal.style.display = 'none'));
}

/**
 * Generates a searchbar
 * @param {*} data - An array of objects containing employee information
 */
function generateSearchBar(data) {
	const searchBar = `<form action="#" method="get">
        <input type="search" id="search-input" class="search-input" placeholder="Search...">
        <input type="submit" value="&#x1F50D;" id="search-submit" class="search-submit">
        </form>`;
	document
		.querySelector('div.search-container')
		.insertAdjacentHTML('beforeend', searchBar);

	// Event Listener: Search Button
	const searchButton = document.getElementById('search-submit');
	searchButton.addEventListener('click', () => {
		searchFilter(data, searchInput.value);
		searchInput.value = '';
	});

	// Event Listener: Search Input
	let searchInput = document.getElementById('search-input');
	searchInput.addEventListener('keyup', () => {
		searchFilter(data, searchInput.value);
	});
}

/**
 * Employee search function
 * @param {Array} employeeList - An array of objects that the search will be performed on
 * @param {string} searchQuery - The search term
 */
function searchFilter(employeeList, searchQuery) {
	const searchResults = [];
	searchQuery = searchQuery.toLowerCase();

	document.getElementById('gallery').innerHTML = '';
	document
		.querySelectorAll('div.modal-container')
		.forEach((modal) => modal.remove());

	employeeList.forEach((employee) => {
		const employeeFullName = `${employee.name.first.toLowerCase()} ${employee.name.last.toLowerCase()}`;
		if (employeeFullName.includes(searchQuery)) {
			searchResults.push(employee);
		}
	});
	generateEmployees(searchResults);
	generateModal(searchResults);
}

/**
 * Modal Navigation and manipulation
 */

// Returns the index of employee card when clicked
function getCardIndex(e) {
	const employeeCardArray = Array.from(document.querySelectorAll('div.card'));
	const cardIndex = employeeCardArray.indexOf(e.target.closest('div.card'));
	return cardIndex;
}

// Returns index of the modal that is currently being displayed
function getModalIndex() {
	const modalArray = Array.from(
		document.querySelectorAll('div.modal-container')
	);
	const modalIndex = modalArray.indexOf(
		document.getElementById('active-modal')
	);
	return modalIndex;
}

// Display modal window and set id attribute
function showModal(modal) {
	modal.style.display = 'block';
	modal.setAttribute('id', 'active-modal');
}

// Show modal when clicked
function showModalOnClick(e) {
	const modal = document.querySelectorAll('div.modal-container')[
		getCardIndex(e)
	];
	showModal(modal);
}

// Close Modal and remove id attribute
function closeActiveModal() {
	const activeModal = document.getElementById('active-modal');
	activeModal.style.display = 'none';
	activeModal.removeAttribute('id');
}

// Display the next modal
function nextModal() {
	const next = document.querySelectorAll('div.modal-container')[
		getModalIndex() + 1
	];
	closeActiveModal();
	showModal(next);
}

// Display the previous modal
function prevModal() {
	const prev = document.querySelectorAll('div.modal-container')[
		getModalIndex() - 1
	];
	closeActiveModal();
	showModal(prev);
}
