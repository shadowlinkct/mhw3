// DEFINIZIONE DELLE COSTANTI PER LE IMMAGINI
const RIGHT_ARROW = 'img/forward-arrow.png';
const DOWN_ARROW = 'img/down-arrow.png';
const BOOKMARKPINNED = 'img/bookmark.png';
const BOOKMARKNOTPINNED = 'img/bookmarkno.png';
const CLOSEIMG = 'img/closeX.png';
// FUNZIONE PER VERIFICARE L'ESISTENZA DI UN DIV
function existingDiv(selector) {
    let existingDiv = document.querySelector(selector);
    if (existingDiv) {
        return true;
    }
    return false;
}
// FUNZIONE PER VERIFICARE L'ESISTENZA DI UN DIV FINE

// FUNZIONE PER MOSTRARE/NASCONDERE LA BARRA SUPERIORE (MENU)
function toggleTopbar() {
    const activeDiv = document.querySelector('#active');
    activeDiv.classList.toggle('hidden');
}

const menubutt = document.querySelector('#menu');
menubutt.addEventListener('click', toggleTopbar);
// FUNZIONE PER MOSTRARE/NASCONDERE LA BARRA SUPERIORE FINE

// GESTIONE DEI LINK AL CENTRO DELLA FINESTRA
let ultimoElementoCliccato = null;
let ultimoElementoCliccatoIMG = null;
let isVisible = false;

// Funzione per mostrare/nascondere gli elementi al click
function toggle(event) {
    const targetId = event.currentTarget.id + "Content";
    const content = document.querySelector('#' + targetId);
    const targetIdIMG = event.currentTarget.id;
    const contentimg = document.querySelector('#' + targetIdIMG);

    // Se c'è un elemento precedentemente cliccato, nascondilo
    if (ultimoElementoCliccato !== null) {
        ultimoElementoCliccato.classList.add('hidden');
        ultimoElementoCliccatoIMG.querySelector('img').src = RIGHT_ARROW;
    }

    // Se l'elemento corrente è già visibile, nascondilo
    if (isVisible && ultimoElementoCliccato === content) {
        content.classList.add('hidden');
        event.currentTarget.querySelector('img').src = RIGHT_ARROW;
        isVisible = false;
    } else {
        // Altrimenti, mostra l'elemento corrente
        content.classList.remove('hidden');
        event.currentTarget.querySelector('img').src = DOWN_ARROW;
        isVisible = true;
    }

    // Aggiorna l'ultimo elemento cliccato
    ultimoElementoCliccato = content;
    ultimoElementoCliccatoIMG = contentimg;
}
// Aggiunta dell'evento click a tutti gli elementi toggle
const toggleItems = document.querySelectorAll('.centerlink-item');
for (let i = 0; i < toggleItems.length; i++) {
    toggleItems[i].addEventListener('click', toggle);
}
// FUNZIONE PER IL CLICK ESTERNO CENTERLINK
function clickesterno(event) {
    // Verifica se l'elemento cliccato non è uno dei toggleItems
    let esternocliccato = true;
    for (let i = 0; i < toggleItems.length; i++) {
        if (toggleItems[i].contains(event.target)) {
            esternocliccato = false;
            console.log("esternocliccato:", esternocliccato);
            break;
        }
    }

    // Se il click è esterno e isVisible è true, nascondi tutti gli elementi
    if (esternocliccato && isVisible) {
        for (let i = 0; i < toggleItems.length; i++) {
            const targetId = toggleItems[i].id + "Content";
            const content = document.querySelector('#' + targetId);
            content.classList.add('hidden');
            toggleItems[i].querySelector('img').src = RIGHT_ARROW;
        }
        isVisible = false;
        console.log("isVisible:", isVisible);
    }
}
document.addEventListener("click", clickesterno);
// FUNZIONE PER IL CLICK ESTERNO CENTERLINK FINE
//GESTIONE DEI LINK AL CENTRO DELLA FINESTRA FINE
// FUNZIONE PER GESTIRE IL PULSANTE DI ASSISTENZA
function assistenzabtn() {
    // Verifica se esiste già un div con className 'divassist'
    if (existingDiv('.divassist')) {
        return;
    }
    let dataAttributes = this.dataset;
    let divassist = document.createElement('div');
    divassist.className = 'divassist';
    let divassistcontent = document.createElement('div');
    divassistcontent.className = 'divassistcontent';
    let assistHeader = document.createElement('div');
    assistHeader.className = 'DivCloseAssist';
    let assisth1 = document.createElement('h1');
    let img = document.createElement('img');
    img.src = CLOSEIMG;
    document.body.appendChild(divassist);
    divassist.appendChild(assistHeader);
    assistHeader.appendChild(assisth1);
    assistHeader.appendChild(img);
    divassist.appendChild(divassistcontent);

    // Creazione dei contenuti dell'assistenza
    let classNames = ['assistcontentitem', 'assistcontentitem2', 'assistcontentitem3', 'assistcontentitem4'];
    let titles = ['Chiamata con tutor', 'WhatsApp', 'Spedizioni, ordini, resi', 'Alimentazione e palestra'];
    let texts = ['Lun-Ven: 10.00-13.00', 'Lun-Ven: 15.00-18.00 ', 'Invia una mail', 'DM Instagram'];
    let images = ['img/phone.svg', 'img/whatsapp.svg', 'img/mail.svg', 'img/instagram.svg'];
    let h3Class = 'myH3Class';
    let pClass = 'myPClass';
    let imgClass = 'myImgClass';

    for (let i = 0; i < classNames.length; i++) {
        let element = document.createElement('div');
        element.className = classNames[i];

        let contentDiv = document.createElement('div');

        // Crea un tag h3, aggiungi la classe e aggiungilo al contentDiv
        let h3 = document.createElement('h3');
        h3.textContent = titles[i];
        h3.className = h3Class;
        contentDiv.appendChild(h3);

        // Crea un tag p, aggiungi la classe e aggiungilo al contentDiv
        let p = document.createElement('p');
        p.textContent = texts[i];
        p.className = pClass;
        contentDiv.appendChild(p);

        element.appendChild(contentDiv);

        // Crea un'immagine, impostala allineata a destra, aggiungi la classe e aggiungila all'elemento
        let img = document.createElement('img');
        img.src = images[i];
        img.className = imgClass;
        element.appendChild(img);

        divassistcontent.appendChild(element);
    }
    assisth1.textContent = "Assistenza";

    // Funzione per rimuovere il div
    function rimuoviDiv() {
        divassist.remove();
        overlay.remove();
    }
    img.addEventListener('click', rimuoviDiv);

    // Creazione dell'overlay
    let overlay = document.createElement('div');
    overlay.classList.add('overlay');
    document.body.appendChild(overlay);
}

// Aggiunta dell'evento click al pulsante di assistenza
const assistbtn = document.querySelector('.fixed-button');
assistbtn.addEventListener('click', assistenzabtn);
//FUNZIONE PER GESTIRE IL PULSANTE DI ASSISTENZA FINE