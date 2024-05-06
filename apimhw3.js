function esercizioCorrisponde(ex, text) {
	return ex.name.toLowerCase().includes(text.toLowerCase()) && ex.language === 13;
}

function esercizioFiltrato(exercise, text) {
	for (let i = 0; i < exercise.exercises.length; i++) {
		if (esercizioCorrisponde(exercise.exercises[i], text)) {
			return true;
		}
	}
	return false;
}
async function search(event) {
    event.preventDefault();

    const text = document.querySelector('#content').value.toLowerCase();

    if (text) {
        console.log('Eseguo ricerca elementi riguardanti: ' + text);

        try {
            // Ottieni tutti i dati degli esercizi
            const allExercises = await fetchAllExerciseBaseData();

            // Filtra gli esercizi in base al nome
            let filteredExercises = [];
            for (let i = 0; i < allExercises.length; i++) {
                if (esercizioFiltrato(allExercises[i], text)) {
                    filteredExercises.push(allExercises[i]);
                }
            }

            // Processa i dati degli esercizi filtrati
            processExerciseData(filteredExercises);
        } catch (error) {
            onError(error);
        }
    }
}

function prevent(event) {
	event.preventDefault();
}

function onInsert(response) {
	console.log('risposta ricevuta');
	return response.text();
}

//Key
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
	const resultsDiv = document.querySelector('#album-view');

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

				let h2 = document.createElement('h2');
				h2.textContent = italianExercise.name;
				exerciseDiv.appendChild(h2);

				let p = document.createElement('p');
				p.textContent = italianExercise.description;
				exerciseDiv.appendChild(p);

				if (exercise.images && exercise.images.length > 0) {
					let img = document.createElement('img');
					img.src = exercise.images[0].image;
					img.alt = italianExercise.name;
					exerciseDiv.appendChild(img);
				}

				resultsDiv.appendChild(exerciseDiv);
			}
		}
	}
}


function onError(error) {
	console.log('There was a problem with the fetch operation: ' + error.message);
}

// Aggiungo event listener al form1 per la RICERCA
const form = document.querySelector('#search_content');
form.addEventListener('submit', search)
