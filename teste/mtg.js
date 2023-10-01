const $nameField = document.querySelector("#card-input");
const $resultsContainer = document.querySelector(".js-results-container");

const getApiUrl = (name) => `https://api.magicthegathering.io/v1/cards?name=${name}`;

const renderCards = ({cards}) => {
    $resultsContainer.innerHTML = '';
    const filteredCards = cards.filter( (card) => typeof card.imageUrl === "string");

    const cardMarkup = [];
     for (let card of filteredCards){
        cardMarkup.push(`
        <div class="card-container"> 
            <h5>${card.name}</h5>
            <img src="${card.imageUrl} alt="${card.name}" class="card-image" />
            <p>${card.text}</p>
        </div>
        `);
    }
    if (cardMarkup.length === 0){
        $resultsContainer.innerHTML = "Erro: essa carta não existe.";
    }else{
        $resultsContainer.innerHTML = cardMarkup.join("\n");
    }

};

const renderError = () => {
    $resultsContainer.innerHTML = "Erro: essa carta não existe.";
};

const onSubmit = (event) => {
    event.preventDefault();

    const name = $nameField.value;

    fetch( getApiUrl(name) ) 
    .then( data => data.json())
    .then( renderCards ) 
    .catch(renderError);

    $nameField.value = "";
};

document.querySelector(".js-form").addEventListener("submit", onSubmit);