// Modulo API
var ClientID = 'ab44cf466d404c1194e90a7b7cd56e2f';
var secretKey = 'c9fe4d2f6b8d433e8f25294f86b26c2c';

async function ottieniToken() {
    const risultato = await fetch('https://accounts.spotify.com/api/token', {
        method: 'POST',
        headers: {
            'Content-Type' : 'application/x-www-form-urlencoded', 
            'Authorization' : 'Basic ' + btoa(ClientID + ':' + secretKey)
        },
        body: 'grant_type=client_credentials'
    });

    const dati = await risultato.json();
    return dati.access_token;
}

async function ottieniGeneri(token) {
    const risultato = await fetch(`https://api.spotify.com/v1/browse/categories`, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const dati = await risultato.json();
    return dati.categories.items;
}

async function ottieniPlaylistPerGenere(token, idGenere) {
    const limite = 10;
    const risultato = await fetch('https://api.spotify.com/v1/browse/categories/' + idGenere + '/playlists?limit=' + limite, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const dati = await risultato.json();
    return dati.playlists.items;
}


async function ottieniBrani(token, endPointBrani) {
    const limite = 10;
    const risultato = await fetch(endPointBrani + '?limit=' + limite, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const dati = await risultato.json();
    return dati.items;
}

async function ottieniBrano(token, endPointBrano) {
    const risultato = await fetch(endPointBrano, {
        method: 'GET',
        headers: { 'Authorization' : 'Bearer ' + token}
    });

    const dati = await risultato.json();
    return dati;
}

// Modulo UI
var elementiDOM = {
    selectGenere: '#select_genre',
    selectPlaylist: '#select_playlist',
    pulsanteInvia: '#btn_submit',
    divDettaglioCanzone: '#song-detail',
    hfToken: '#hidden_token',
    divListaCanzoni: '.song-list'
};

function ottieniCampiInput() {
    return {
        genere: document.querySelector(elementiDOM.selectGenere),
        playlist: document.querySelector(elementiDOM.selectPlaylist),
        brani: document.querySelector(elementiDOM.divListaCanzoni),
        invia: document.querySelector(elementiDOM.pulsanteInvia),
        dettaglioCanzone: document.querySelector(elementiDOM.divDettaglioCanzone)
    }
}

function creaGenere(testo, valore) {
    const html = '<option value="' + valore + '">' + testo + '</option>';
    document.querySelector(elementiDOM.selectGenere).insertAdjacentHTML('beforeend', html);
}

function creaPlaylist(testo, valore) {
    const html = '<option value="' + valore + '">' + testo + '</option>';
    document.querySelector(elementiDOM.selectPlaylist).insertAdjacentHTML('beforeend', html);
}


function creaBrano(id, nome) {
    const divListaCanzoni = document.querySelector(elementiDOM.divListaCanzoni);

    // Crea l'elemento 'a'
    const aElement = document.createElement('a');
    aElement.href = "#";
    aElement.id = id;
    aElement.textContent = nome;

    // Crea l'elemento 'br'
    const brElement = document.createElement('br');

    // Aggiungi l'elemento 'a' e 'br' a divListaCanzoni
    divListaCanzoni.appendChild(aElement);
    divListaCanzoni.appendChild(brElement);
}



function creaDettaglioBrano(img, titolo, artista) {
    const divDettaglio = document.querySelector(elementiDOM.divDettaglioCanzone);
    divDettaglio.textContent = '';

    // Crea l'elemento img
    const imgElement = document.createElement('img');
    imgElement.src = img;
    divDettaglio.appendChild(imgElement);

    // Crea l'elemento per il titolo
    const titoloElement = document.createElement('p');
    titoloElement.textContent = "Titolo: " + titolo;
    divDettaglio.appendChild(titoloElement);

    // Crea l'elemento per l'artista
    const artistaElement = document.createElement('p');
    artistaElement.textContent = "Artista: " + artista;
    divDettaglio.appendChild(artistaElement);
}



function resettaDettaglioBrano() {
    ottieniCampiInput().dettaglioCanzone.textContent = '';
}

function resettaBrani() {
    ottieniCampiInput().brani.textContent = '';
    resettaDettaglioBrano();
}

function resettaPlaylist() {
    ottieniCampiInput().playlist.textContent = '';
    resettaBrani();
}


function memorizzaToken(valore) {
    document.querySelector(elementiDOM.hfToken).value = valore;
}

function ottieniTokenMemorizzato() {
    return {
        token: document.querySelector(elementiDOM.hfToken).value
    }
}

// Modulo App
async function caricaGeneri() {
    const token = await ottieniToken();           
    memorizzaToken(token);
    const generi = await ottieniGeneri(token);
    generi.forEach(function(elemento) {
        creaGenere(elemento.name, elemento.id);
    });
}

var campiInputDOM = ottieniCampiInput();

campiInputDOM.genere.addEventListener('change', async function() {
    resettaPlaylist();
    const token = ottieniTokenMemorizzato().token;        
    const selectGenere = ottieniCampiInput().genere;       
    const idGenere = selectGenere.options[selectGenere.selectedIndex].value;             
    const playlist = await ottieniPlaylistPerGenere(token, idGenere);       
    playlist.forEach(function(p) {
        creaPlaylist(p.name, p.tracks.href);
    });
});

campiInputDOM.invia.addEventListener('click', async function(e) {
    e.preventDefault();
    resettaBrani();
    const token = ottieniTokenMemorizzato().token;        
    const selectPlaylist = ottieniCampiInput().playlist;
    const endPointBrani = selectPlaylist.options[selectPlaylist.selectedIndex].value;
    const brani = await ottieniBrani(token, endPointBrani);
    brani.forEach(function(el) {
        creaBrano(el.track.href, el.track.name)
    });
});

campiInputDOM.brani.addEventListener('click', async function(e) {
    e.preventDefault();
    resettaDettaglioBrano();
    const token = ottieniTokenMemorizzato().token;
    const endPointBrano = e.target.id;
    const brano = await ottieniBrano(token, endPointBrano);
    creaDettaglioBrano(brano.album.images[2].url, brano.name, brano.artists[0].name);
});

function inizia() {
    console.log('L\'applicazione sta iniziando');
    caricaGeneri();
}

inizia();
