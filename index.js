const FETCH_REQUEST_URL = "https://api.pexels.com/v1/search?query=";
const PARAMETER_ORIENTATION = "orientation=landscape";
const PARAMETER_LOCALES = "locale=it-IT";

let query = undefined;
const defaultPrimaryQuery = "ocean";
const defaultSecondaryQuery = "gaming";

const initSearch = function (btn) {
  const inputField = btn.previousElementSibling;
  query = inputField.value || defaultPrimaryQuery;
  searchAndLoad();
};

const fillCards = function (data) {
  const cardImgs = document.querySelectorAll(".card img");
  let photo = undefined;
  Array.from(cardImgs).forEach((img, index) => {
    if (index < data.photos.length) {
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
    }
  });
};

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

const applyId = function (id, span) {
  span.textContent = "ID: " + id;
};

const applyAuthor = function (photographer, photographerId, cardSub) {
  cardSub.textContent = `${photographer} - ${photographerId}`;
};

const applyTitle = function (title, cardTitle, img) {
  cardTitle.textContent = title;
  //   viewBtnClick(img, title);
  //   cardTitle.addEventListener("click", () => {
  //     openImageInModal(img);
  //   });
};

const viewBtnClick = function (card, img, title) {
  const viewButton = card.querySelector(".viewBtn");
  viewButton.addEventListener("click", () => {
    openImageInModal(img, title);
  });
};

const openImageInModal = function (img, title) {
  console.log("photo src ", img);
  const modal = document.querySelector(".modal");
  const modalBody = modal.querySelector(".modal-body");
  const modalTitle = modal.querySelector(".modal-title");
  console.log(modalTitle);
  modalBody.innerHTML = `<img class="img-fluid" src="${img.original}"></img>`;
  modalTitle.textContent = title.textContent;
};

const searchAndLoad = function () {
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

const loadImages = function () {
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

const loadSecondaryImages = function () {
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

const hideCard = function (event) {
  const card = event.target.closest(".card");
  card.classList.add("d-none");
};
