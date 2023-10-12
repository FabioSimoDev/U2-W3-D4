const FETCH_REQUEST_URL = "https://api.pexels.com/v1/search?query=";
const PARAMETER_ORIENTATION = "orientation=landscape";
const PARAMETER_LOCALES = "locale=it-IT";

let query = undefined;
const defaultPrimaryQuery = "ocean";
const defaultSecondaryQuery = "gaming";

const cardImgs = document.querySelectorAll(".card img");

const initSearch = function (btn) {
  const inputField = btn.previousElementSibling;
  query = inputField.value || defaultPrimaryQuery;
  searchAndLoad();
};

//questa funzione si occupa di riempire ogni singola card
const fillCards = function (data) {
  let photo = undefined;
  Array.from(cardImgs).forEach((img, index) => {
    if (index < data.photos.length && data.photos.length > 0) {
      photo = data.photos[index];
      const cardBody = img.parentElement;
      const cardTitle = cardBody.querySelector(".card-title");

      img.src = photo.src.landscape;

      applyId(photo.id, cardBody.querySelector("small.text-muted"));

      applyAuthor(
        photo.photographer,
        photo.photographer_id,
        cardBody.querySelector(".card-subtitle")
      );

      applyTitle(photo.alt, cardTitle, photo.src);

      viewBtnClick(cardBody, photo.src, cardTitle);

      detailRedirect(cardTitle, img, photo);

      hideSpinner(false, img.nextElementSibling); //lo spinner. alla fine di questa funzione il caricamento sarà completo, quindi lo nascondo
    } else {
      hideSpinner(false, img.nextElementSibling);
      return;
    }
  });
};

//renderizza alla pagina dei dettagli passando i queryParameters dell'immagine
const detailRedirect = function (cardTitle, cardImg, photoData) {
  const photoSrc = photoData.src.original;
  const photoTitle = photoData.alt;
  const photoAuthor = photoData.photographer;
  const photoAuthorId = photoData.photographer_id;
  const photoAuthorUrl = photoData.photographer_url;
  const imgAvgColor = photoData.avg_color.replace("#", "");
  console.log(imgAvgColor);
  cardTitle.addEventListener("click", () => {
    location.assign(
      `./detail.html?photoSrc=${photoSrc}&photoTitle=${photoTitle}&photoAuthor=${photoAuthor}&photoAuthorId=${photoAuthorId}&photoAuthorUrl=${photoAuthorUrl}&avgColor=${imgAvgColor}`
    );
  });
  cardImg.addEventListener("click", () => {
    location.assign(
      `./detail.html?photoSrc=${photoSrc}&photoTitle=${photoTitle}&photoAuthor=${photoAuthor}&photoAuthorId=${photoAuthorId}&photoAuthorUrl=${photoAuthorUrl}&avgColor=${imgAvgColor}`
    );
  });
};

//mostra l'id nell'apposito span
const applyId = function (id, span) {
  span.textContent = "ID: " + id;
};

//mostra il fotografo nell'apposito elemento
const applyAuthor = function (photographer, photographerId, cardSub) {
  cardSub.textContent = `${photographer} - ${photographerId}`;
};

//applica il titolo dell'immagine alla card
const applyTitle = function (title, cardTitle, img) {
  cardTitle.textContent = title;
};

//quando clicca sui bottoni "View"
const viewBtnClick = function (card, img, title) {
  const viewButton = card.querySelector(".viewBtn");
  viewButton.addEventListener("click", () => {
    showSpinner(true);
    openImageInModal(img, title);
  });
};

// const hideSpinnerModalAfterImgLoaded = async function (image) {
//   console.log("dentro la funzione");
//   if (image.complete) {
//     console.log("immagine già caricata!");
//   } else {
//     await new Promise((resolve) => {
//       console.log("sto caricando");
//       image.onload = () => {
//         image.onload = null;
//         resolve();
//       };
//     });
//     console.log("immagine caricata!");
//   }
//   hideSpinner(true);
// };

//si occupa di caricare l'immagine nel modale quando clicchi si "View"
const openImageInModal = function (img, title) {
  console.log("photo src ", img);
  const modal = document.querySelector(".modal");
  const modalBody = modal.querySelector(".modal-body");
  const modalImg = modalBody.querySelector("img");
  const modalTitle = modal.querySelector(".modal-title");
  modalImg.src = "";
  console.log(modalTitle);
  modalImg.src = img.original;
  // hideSpinnerModalAfterImgLoaded(modalImg); funzione inutile, rimpiazzata dalla singola riga sotto
  modalImg.addEventListener("load", hideSpinner, true);
  modalTitle.textContent = title.textContent;
};

//funzione universale per mostrare gli spinner, se modal è true vuol dire che
//deve mostrare lo spinner nel modale, quindi lo prende appositamente con un querySelector
const showSpinner = function (modal = false) {
  if (!modal) {
    Array.from(cardImgs).forEach((img) => {
      img.nextElementSibling.classList.remove("d-none");
      //img.nextElementSibling ottiene l'elemento successivo all'immagine, in questo caso lo spinner
    });
  } else {
    document.querySelector(".spinner-border").classList.remove("d-none");
    console.log("spinner mostrato");
  }
};

//funzione universale per nascondere lo spinner,
//come prima, se modal è true vuol dire che deve nascondere lo spinner nel modale.
//qui ho aggiunto anche il parametro spinner, in modo da poter gestire anche un singolo spinner separatamente anzichè ciclarli tutti
const hideSpinner = function (modal = false, spinner = undefined) {
  if (!modal) {
    if (!spinner) {
      Array.from(cardImgs).forEach((img) => {
        img.nextElementSibling.classList.add("d-none");
      });
    } else {
      spinner.classList.add("d-none");
    }
  } else {
    document.querySelector(".spinner-border").classList.add("d-none");
  }
};

//cerca quando clicca sul pulsante cerca usando la query inserita nell'input
const searchAndLoad = function () {
  showSpinner();
  fetch(
    `${FETCH_REQUEST_URL}${query}&${PARAMETER_ORIENTATION}&${PARAMETER_LOCALES}`,
    {
      headers: {
        Authorization:
          "u5xjFALnII1Jk76ltclcoRMJ9cO7muo2NCIdXBWOtOlE6WPmUMjfJfzS"
      }
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error");
      }
    })
    .then((data) => {
      console.log(data);
      fillCards(data);
    })
    .catch((err) => {
      console.log("errore: ", err);
    });
};

//carica le immagini principali con la query di default (definita all'inizio del file JS)
const loadImages = function () {
  showSpinner();
  fetch(
    `${FETCH_REQUEST_URL}${defaultPrimaryQuery}&${PARAMETER_ORIENTATION}&${PARAMETER_LOCALES}`,
    {
      headers: {
        Authorization:
          "u5xjFALnII1Jk76ltclcoRMJ9cO7muo2NCIdXBWOtOlE6WPmUMjfJfzS"
      }
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error");
      }
    })
    .then((data) => {
      console.log(data);
      fillCards(data);
    })
    .catch((err) => {
      console.log("errore: ", err);
    });
};

//carica le immagini secondarie usando la query di default per le immagini secondarie (sempre definita all'inizio del file)
const loadSecondaryImages = function () {
  showSpinner();
  fetch(
    `${FETCH_REQUEST_URL}${defaultSecondaryQuery}&${PARAMETER_LOCALES}&${PARAMETER_ORIENTATION}`,
    {
      headers: {
        Authorization:
          "u5xjFALnII1Jk76ltclcoRMJ9cO7muo2NCIdXBWOtOlE6WPmUMjfJfzS"
      }
    }
  )
    .then((res) => {
      if (res.ok) {
        return res.json();
      } else {
        throw new Error("Error");
      }
    })
    .then((data) => {
      console.log(data);
      fillCards(data);
    })
    .catch((err) => {
      console.log("errore: ", err);
    });
};

//nasconde la card quando si clcica su "Hide"
const hideCard = function (event) {
  const card = event.target.closest(".card");
  card.classList.add("d-none");
};
