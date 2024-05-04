const numResults = 10;
//stessa cosa cambia solo il modo in cui vuole essere chiama L'API
function onJson_pet(json) {
	console.log('JSON Pet ricevuto');
	console.log(json);
	// Svuotiamo la libreria
	const library = document.querySelector('#album-view');
	library.innerHTML = '';
	if (json.status == 400) {
		const errore = document.createElement("h1");
		const messaggio = document.createTextNode(json.detail);
		errore.appendChild(messaggio);
		library.appendChild(errore);
		return
	}

	// Leggi il numero di risultati
	const results = json.animals

	if (results.length == 0) {
		const errore = document.createElement("h1");
		const messaggio = document.createTextNode("Nessun risultato!");
		errore.appendChild(messaggio);
		library.appendChild(errore);
	}

	// Processa ciascun risultato
	for (result of results) {
		// Leggiamo info
		console.log(result);
		if (result.primary_photo_cropped != null) {
			const immagine = result.primary_photo_cropped.medium;
			const album = document.createElement('div');
			album.classList.add('album');
			const img = document.createElement('img');
			img.src = immagine;
			const breed = document.createElement('h2');
			breed.textContent = result.breeds.primary;

			img.addEventListener('click', apriModale);

			// Aggiungiamo immagine e didascalia al div
			album.appendChild(img);
			album.appendChild(breed);
			// Aggiungiamo il div alla libreria
			library.appendChild(album);
		}
	}
}

function onJson_img(json) {
	console.log('JSON Img ricevuto');
	// Stampiamo il JSON per capire quali attributi ci servono
	console.log(json);
	// Svuotiamo la libreria
	const library = document.querySelector('#album-view');
	library.innerHTML = '';
	// Leggi il numero di risultati
	const results = json.hits
	for (result of results) {
		console.log(result + ' questo e un result');
	}

	if (results.length == 0) {
		const errore = document.createElement("h1");
		const messaggio = document.createTextNode("Nessun risultato!");
		errore.appendChild(messaggio);
		library.appendChild(errore);
	}

	// Processa ciascun risultato
	for (result of results) {
		// Leggiamo info
		const immagine = result.largeImageURL;

		const album = document.createElement('div');
		album.classList.add('album');
		const img = document.createElement('img');
		img.src = immagine;

		img.addEventListener('click', apriModale);

		// Aggiungiamo immagine e didascalia al div
		album.appendChild(img);

		// Aggiungiamo il div alla libreria
		library.appendChild(album);
	}
}

function onJson_gif(json) {
	console.log('JSON GIF ricevuto');
	console.log(json);
	// Svuotiamo la libreria
	const library = document.querySelector('#album-view');
	library.innerHTML = '';
	// Leggi il numero di risultati
	const results = json.data
	for (result of results) {
		console.log(result + 'questo e un result');
	}

	if (results.length == 0) {
		const errore = document.createElement("h1");
		const messaggio = document.createTextNode("Nessun risultato!");
		errore.appendChild(messaggio);
		library.appendChild(errore);
	}

	// Processa ciascun risultato
	for (result of results) {
		console.log(result);
		// Leggiamo info
		const immagine = result.images.downsized_medium.url;
		//console.log('questa e una ' +immagine);
		const album = document.createElement('div');
		album.classList.add('album');
		const img = document.createElement('img');
		img.src = immagine;

		//associo l'handler che apre la modale 
		img.addEventListener('click', apriModale);

		// Aggiungiamo immagine e didascalia al div
		album.appendChild(img);

		// Aggiungiamo il div alla libreria
		library.appendChild(album);
	}
}

function onResponse(response) {
	console.log('Risposta ricevuta');
	return response.json();
}
//qui stiamo salvando il token
function getToken(json) {
	token_data = json;
	console.log(json);
}
//qui trasformiamo la nostra risposta(risorsa) in JSON
function onTokenResponse(response) {
	return response.json();
}

async function search(event) {
	event.preventDefault();

	const content = document.querySelector('#content').value;

	if (content) {
		const text = encodeURIComponent(content);
		console.log('Eseguo ricerca elementi riguardanti: ' + text);

		try {
			// Ottieni tutti i dati degli esercizi
			const allExercises = await fetchAllExerciseBaseData();

			// Filtra gli esercizi in base al nome
			const filteredExercises = allExercises.filter(exercise => {
				return exercise.exercises.some(ex => ex.name.toLowerCase().includes(text.toLowerCase()) && ex.language === 13);
			});

			// Processa i dati degli esercizi filtrati
			processExerciseData(filteredExercises);
		} catch (error) {
			handleError(error);
		}
	}
}


//al click di uno dei contenuti trovati
function apriModale(event) {
	//creo un nuovo elemento img
	const image = document.createElement('img');
	//setto l'ID di questo img come immagine_post, a cui attribuisco alcune caratteristiche CSS
	image.id = 'immagine_post';
	//associo all'attributo src, l'src cliccato
	image.src = event.currentTarget.src;
	//appendo quest'immagine alla view modale
	modale.appendChild(image);
	//rendo la modale visibile
	modale.classList.remove('hidden');
	//blocco lo scroll della pagina
	document.body.classList.add('no-scroll');
}

function chiudiModale(event) {
	console.log(event);
	if (event.key === 'Escape') {
		//aggiungo la classe hidden 
		console.log(modale);
		modale.classList.add('hidden');
		//prendo il riferimento dell'immagine dentro la modale
		img = modale.querySelector('img');
		//e la rimuovo 
		img.remove();
		//riabilito lo scroll
		document.body.classList.remove('no-scroll');
	}
}

function prevent(event) {
	event.preventDefault();
}

function onInsert(response) {
	console.log('risposta ricevuta');
	return response.text();
}

//Keys and endpoints,(token) da mettere per ogni richiesa (ricevuto dopo la registrazione al sito)

//Key and secret for Unsplash OAuth2.0 
const API_URL = 'https://wger.de/api/v2/';
const TOKEN = '62e95f2d76b4aefd161d1f16cd487a5bb3ad3db0';

async function fetchAllExerciseBaseData() {
	let url = API_URL + 'exercisebaseinfo/?language=13';
	let allResults = [];

	while (url) {
		const response = await fetch(url, {
			method: 'GET',
			headers: {
				'Authorization': 'Token ' + TOKEN,
				'Accept': 'application/json'
			}
		});

		if (!response.ok) {
			throw new Error('HTTP error! status: ' + response.status);
		}

		const data = await response.json();
		allResults = allResults.concat(data.results);

		// Imposta l'URL per la prossima pagina di risultati
		url = data.next;
	}

	return allResults;
}

function processExerciseData(data) {
	const resultsDiv = document.querySelector('#album-view'); // Supponendo che ci sia un div con id 'results' dove inserire i risultati

	for (let i = 0; i < data.length; i++) {
		let exercise = data[i];
		if (exercise.exercises && exercise.exercises.length > 0) {
			let italianExercises = [];
			for (let j = 0; j < exercise.exercises.length; j++) {
				if (exercise.exercises[j].language === 13) {
					italianExercises.push(exercise.exercises[j]);
				}
			}
			for (let k = 0; k < italianExercises.length; k++) {
				let italianExercise = italianExercises[k];

				// Crea un nuovo div per ogni esercizio
				let exerciseDiv = document.createElement('div');
				exerciseDiv.innerHTML = `
                    <h2>${italianExercise.name}</h2>
                    <p>${italianExercise.description}</p>
                    ${exercise.images && exercise.images.length > 0 ? `<img src="${exercise.images[0].image}" alt="${italianExercise.name}">` : ''}
                `;
				resultsDiv.appendChild(exerciseDiv);
			}
		}
	}
}


function handleError(error) {
	console.log('There was a problem with the fetch operation: ' + error.message);
}

// Aggiungo event listener al form1 per la RICERCA
const form = document.querySelector('#search_content');
form.addEventListener('submit', search)

const modale = document.querySelector('#modale');
//creo il pulsante per la chiusura del post 
window.addEventListener('keydown', chiudiModale);

//ESEMPIO DOMANDA ESAME: RICHIESTA DA SINCRONA A ASINCRONA O VICEVERSA. SAPERE OGNI COSA DEL CODICE NON SI POSSO USARE COMMENTI.