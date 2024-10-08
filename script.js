let weather = {
    apiKey: "",
    apiKey2: "",
    // Funzione per caricare le chiavi API dal file JSON
    loadConfig: function() {
        fetch('config.json')  // Carica il file JSON
            .then(response => response.json())  // Parso il JSON
            .then(config => {
                this.apiKey = config.apiKey;  // Assegna la chiave API a apiKey
                this.apiKey2 = config.apiKey2;  // Assegna la seconda chiave API a apiKey2
                this.fetchWeather("Milan");  // Puoi anche chiamare la funzione di ricerca meteo dopo aver caricato le chiavi
            })
            .catch(error => console.log("Error loading config:", error));
    },
    fetchWeather: function (city) {
        fetch(
            "https://api.openweathermap.org/data/2.5/weather?q=" +
            city +
            "&units=metric&appid=" +
            this.apiKey
        )
            .then((response) => {
                if (!response.ok) {
                    alert("No weather found.");
                    throw new Error("No weather found.");
                }
                return response.json();
            })
            .then((data) => this.displayWeather(data));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        // Aggiorna le informazioni del tempo sul display
        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src =
            "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerHTML = temp + " &deg;C";
        document.querySelector(".humidity").innerText =
            "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText =
            "Wind speed: " + speed + " km/h";
        document.querySelector(".weather").classList.remove("loading");

        // Chiama la funzione per ottenere l'immagine di sfondo da Unsplash
        this.fetchCityImage(name);
    },
    fetchCityImage: function (city) {
        fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(city)}&client_id=${this.apiKey2}`
        )
            .then((response) => response.json())
            .then((data) => {
                if (data.results.length > 0) {
                    const imageUrl = data.results[0].urls.raw;
                    const sizedImageUrl = `${imageUrl}&w=1600&h=900`;

                    // Aggiorna lo sfondo dello pseudo-elemento body::before
                    const style = document.createElement('style');
                    style.innerHTML = `
                    body::before {
                        background-image: url(${sizedImageUrl});
                        filter: blur(4px);
                    }
                `;
                    document.head.appendChild(style);
                } else {
                    console.log("No images found for this city.");
                }
            })
            .catch((error) => console.log("Error fetching city image:", error));
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

// Carica la configurazione all'inizio
weather.loadConfig();

// Event listener per il pulsante di ricerca
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

// Event listener per l'input nella barra di ricerca (per cercare premendo "Enter")
document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});
