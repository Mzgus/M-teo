let url =
  "https://api.meteo-concept.com/api/forecast/nextHours?token=a0797e3c4b5165c7b119feb410146891b46a2b4491a90bc2caee00981cf0db61&insee=";
let insee = "77181";
let messageElement = document.getElementById("message");
let forecast;

// stockage de l'url dans le local storage
if (localStorage.getItem("meteo")) {
  forecast = JSON.parse(localStorage.getItem("meteo"));
  sendMessage(`Vous regardez la méteo pour ${forecast.city.name}`);
} else {
  sendMessage("Pas de donnés en mémoire");
}

function sendMessage(str) {
  messageElement.textContent = str;
}

// Function pour mettre en stockage l'api
function refresh() {
  fetch(url + insee)
    .then((response) => response.json())
    .then((response) => {
      console.log(response);
      forecast = response
      localStorage.setItem("meteo", JSON.stringify(response));
      sendMessage(`Vous regardez la méteo pour ${forecast.city.name}`);
    })
    .catch((error) => alert(error));
}

function remove() {
  localStorage.removeItem("meteo");
  sendMessage("la mémoire a été vidé");
}

function handleClick() {
  console.log(forecast);
  let temperature = forecast.forecast[0].temp2m;
  let humidite = forecast.forecast[0].rh2m;
  let vent = forecast.forecast[0].wind10m;
  let tendanceIndex = forecast.forecast[0].weather;
  let tendance = codeArray[tendanceIndex];
  let imgSrc = imgArray[tendance[1]];
  document.getElementById(
    "temperature"
  ).textContent = `température: ${temperature}°C`;
  document.getElementById(
    "humidite"
  ).textContent = `taux d'humidité: ${humidite}%`;
  document.getElementById("vent").textContent = `vitesse du vent: ${vent}km/h`;
  document.getElementById(
    "tendance"
  ).textContent = `tendance météo: ${tendance[0]}`;
  document.querySelector("img").setAttribute("src", imgSrc);
  document.querySelector("img").classList.remove("d-none");
}

function handleSubmit(e) {
  e.preventDefault();
  insee = document.querySelector(".soluce:checked").value;
  console.log(insee);
  document.getElementById("nom_ville").innerHTML = "";
  document.getElementById("code_postal").innerHTML = "";
  document.getElementById("select").innerHTML = "";
  refresh()
}

function handleInput() {
  let codeDepartement = document.getElementById("code_postal").value;
  let nomVille = document.getElementById("nom_ville").value;
  let url =
    "https://geo.api.gouv.fr/communes?codeDepartement=" +
    codeDepartement +
    "&nom=" +
    nomVille;

  fetch(url)
    .then((res) => res.json())
    .then((response) => {
      console.log(response);
      if (response.length < 10) {
        displayOption(response);
      }
    })
    .catch((error) => alert(error));
}

function displayOption(arr) {
  document.getElementById("select").innerHTML = "";
  for (let item of arr) {
    document.getElementById("select").insertAdjacentHTML(
      "beforeend",
      `<div>
        <input class="soluce" type="radio" value=${item.code} name="ville">
        <label>${item.nom}</label>
        </div>`
    );
  }
}
