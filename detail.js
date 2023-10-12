const addressBarContent = new URLSearchParams(location.search);
const photoSrc = addressBarContent.get("photoSrc");
const photoTitle = addressBarContent.get("photoTitle");
const photoAuthor = addressBarContent.get("photoAuthor");
const photoAuthorId = addressBarContent.get("photoAuthorId");
const photoAuthorUrl = addressBarContent.get("photoAuthorUrl");
const imgAvgColor = addressBarContent.get("avgColor");

const img = document.getElementById("image");
const title = document.getElementById("img-title");
const subtitle = document.getElementById("subtitle");
const author = document.getElementById("author");
const authorId = document.getElementById("authorId");
const authorUrl = document.getElementById("authorUrl");
const body = document.body;

img.src = photoSrc;
title.textContent = photoTitle;
subtitle.textContent = "Lorem ipsum dolor sit amet.";
author.textContent = `Fotografo: ${photoAuthor}`;
authorId.textContent = `ID: ${photoAuthorId}`;
authorUrl.textContent = `Profilo: ${photoAuthorUrl}`;
authorUrl.href = photoAuthorUrl;
body.style.background = "#" + imgAvgColor;

const getContrast = function (hexcolor) {
  // Convert to RGB value
  const r = parseInt(hexcolor.substr(0, 2), 16);
  const g = parseInt(hexcolor.substr(2, 2), 16);
  const b = parseInt(hexcolor.substr(4, 2), 16);

  // Get YIQ ratio
  const yiq = (r * 299 + g * 587 + b * 114) / 1000;

  // Check contrast
  return yiq >= 128 ? "black" : "white";
};

const allText = document.querySelectorAll("h2, h3, h4, h5, h6, span, p, a");
Array.from(allText).forEach((text) => {
  text.style.color = getContrast(imgAvgColor);
});

console.log(imgAvgColor);
