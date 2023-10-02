// Mapeamento de símbolos de mana para URLs das imagens SVG
const manaIcons = {
    "{W}": "/src/svg/WhiteManaColor.svg",
    "{U}": "/src/svg/BlueManaColor.svg",
    "{B}": "/src/svg/BlackManaColor.svg",
    "{R}": "https://svgs.scryfall.io/card-symbols/R.svg",
    "{G}": "https://svgs.scryfall.io/card-symbols/G.svg",
    "{T}": "/src/svg/Tap.svg",
};

const PesquisaInput = document.querySelector("[name=card-name]");
const title = document.querySelector(".Cards-pesquisados");
const cardsContainer = document.querySelector(".cards-container");
const cardModal = document.getElementById("cardModal");

function formSubmitted(event) {
    event.preventDefault();
    const searchTerm = PesquisaInput.value.trim();

    if (!searchTerm) {
        // Se a pesquisa estiver vazia, mostre cartas aleatórias
        title.textContent = "Cartas Aleatórias:";
        title.style.color = "rgb(252, 252, 252)";
        PesquisaInput.value = "";
        cardsContainer.innerHTML = "";

        getRandomCards();
    } else {
        title.textContent = `${searchTerm} cards:`;
        title.style.color = "rgb(252, 252, 252)";
        PesquisaInput.value = "";
        cardsContainer.innerHTML = "";

        searchScryfall(searchTerm);
    }
}

async function getRandomCards() {
    try {
        const response = await fetch("https://api.scryfall.com/cards/random");

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        const cardData = await response.json();

        if (cardData.image_uris) {
            const { image_uris, name } = cardData;
            const cardElement = createCardElement(image_uris.normal, name);
            cardElement.addEventListener("click", () => showModal(cardData));
            cardsContainer.appendChild(cardElement);
        } else {
            cardsContainer.textContent = "Nenhuma carta aleatória encontrada.";
        }
    } catch (error) {
        console.error(`Erro na solicitação: ${error.message}`);
    }
}

async function searchScryfall(searchTerm) {
    try {
        const response = await fetch(`https://api.scryfall.com/cards/search?q=${encodeURIComponent(searchTerm)}`);

        if (!response.ok) {
            throw new Error(`Erro na solicitação: ${response.status}`);
        }

        const { data } = await response.json();

        if (data && data.length > 0) {
            data.forEach((card) => {
                if (card.image_uris) {
                    const { image_uris, name } = card;
                    const cardElement = createCardElement(image_uris.normal, name);
                    cardElement.addEventListener("click", () => showModal(card));
                    cardsContainer.appendChild(cardElement);
                }
            });
        } else {
            cardsContainer.textContent = "Nenhuma carta encontrada.";
        }
    } catch (error) {
        console.error(`Erro na solicitação: ${error.message}`);
    }
}

function createCardElement(imageUrl, altText) {
    const cardElement = document.createElement("img");
    cardElement.className = "card-img";
    cardElement.src = imageUrl;
    cardElement.alt = altText;
    return cardElement;
}

// Função para mapear os símbolos de mana para elementos de imagem
function mapManaSymbolsToIcons(manaCost) {
    const regex = /{[^{}]+}/g;
    const matches = manaCost.match(regex);

    if (matches) {
        matches.forEach((match) => {
            const symbol = match.trim(); // Remova os caracteres de chaves extras
            const iconUrl = manaIcons[symbol];
            if (iconUrl) {
                // Crie um elemento de imagem com o URL da imagem de mana correspondente
                const manaIcon = document.createElement("img");
                manaIcon.src = iconUrl;
                manaIcon.alt = "não encontrado";      
                manaIcon.className = "mana-icon";

                // Substitua o símbolo de mana pelo elemento de imagem
                manaCost = manaCost.replace(new RegExp(symbol, 'g'), manaIcon.outerHTML);
            }
        });
    }

    return manaCost;
}

function showModal(cardData) {
    const modalCardName = document.getElementById("modalCardName");
    const modalCardImage = document.getElementById("modalCardImage");
    const modalManaCost = document.getElementById("modalManaCost");
    const modalType = document.getElementById("modalType");
    const modalSetName = document.getElementById("modalSetName");
    const modalText = document.getElementById("modalText");
    const modalArtist = document.getElementById("modalArtist");

    modalCardName.textContent = cardData.name;
    modalCardImage.src = cardData.image_uris.normal;
    modalCardImage.alt = cardData.name;
    modalManaCost.innerHTML = mapManaSymbolsToIcons(cardData.mana_cost || "N/A");
    modalType.textContent = cardData.type_line || "N/A";
    modalSetName.textContent = cardData.set_name || "N/A";
    modalText.textContent = cardData.oracle_text || "N/A";
    modalArtist.textContent = cardData.artist || "N/A";

    cardModal.style.display = "block";

    modalCardImage.addEventListener("click", klose);
    cardModal.addEventListener("click", (event) => {
        if (event.target === cardModal) {
            klose();
        }
    });
}

function klose() {
    cardModal.style.display = "none";
}

document.querySelector("form").addEventListener("submit", formSubmitted);
