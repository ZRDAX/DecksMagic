// Mapeamento de símbolos de mana para URLs das imagens SVG
const manaIcons = {
    "{W}": "https://svgs.scryfall.io/card-symbols/W.svg",
    "{U}": "https://svgs.scryfall.io/card-symbols/U.svg",
    "{B}": "https://svgs.scryfall.io/card-symbols/B.svg",
    "{R}": "https://svgs.scryfall.io/card-symbols/R.svg",
    "{G}": "https://svgs.scryfall.io/card-symbols/G.svg",
    "{∞}": "https://svgs.scryfall.io/card-symbols/INFINITY.svg",
    "{W/U}": "https://svgs.scryfall.io/card-symbols/WU.svg",
    "{W/B}": "https://svgs.scryfall.io/card-symbols/WB.svg",
    "{B/R}": "https://svgs.scryfall.io/card-symbols/BR.svg",
    "{B/G}": "https://svgs.scryfall.io/card-symbols/BG.svg",
    "{U/B}": "https://svgs.scryfall.io/card-symbols/UB.svg",
    "{U/R}": "https://svgs.scryfall.io/card-symbols/UR.svg",
    "{R/G}": "https://svgs.scryfall.io/card-symbols/RG.svg",
    "{R/W}": "https://svgs.scryfall.io/card-symbols/RW.svg",
    "{G/W}": "https://svgs.scryfall.io/card-symbols/GW.svg",
    "{G/U}": "https://svgs.scryfall.io/card-symbols/GU.svg",
    "{B/G/P}": "https://svgs.scryfall.io/card-symbols/BGP.svg",
    "{B/R/P}": "https://svgs.scryfall.io/card-symbols/BRP.svg",
    "{G/U/P}": "https://svgs.scryfall.io/card-symbols/GUP.svg",
    "{G/W/P}": "https://svgs.scryfall.io/card-symbols/GWP.svg",
    "{R/G/P}": "https://svgs.scryfall.io/card-symbols/RGP.svg",
    "{R/W/P}": "https://svgs.scryfall.io/card-symbols/RWP.svg",
    "{U/B/P}": "https://svgs.scryfall.io/card-symbols/UBP.svg",
    "{U/R/P}": "https://svgs.scryfall.io/card-symbols/URP.svg",
    "{W/B/P}": "https://svgs.scryfall.io/card-symbols/WBP.svg",
    "{W/U/P}": "https://svgs.scryfall.io/card-symbols/WUP.svg",
    "{2/W}": "https://svgs.scryfall.io/card-symbols/2W.svg",
    "{2/U}": "https://svgs.scryfall.io/card-symbols/2U.svg",
    "{2/B}": "https://svgs.scryfall.io/card-symbols/2B.svg",
    "{2/R}": "https://svgs.scryfall.io/card-symbols/2R.svg",
    "{2/G}": "https://svgs.scryfall.io/card-symbols/2G.svg",
    "{P}": "https://svgs.scryfall.io/card-symbols/P.svg",
    "{W/P}": "https://svgs.scryfall.io/card-symbols/WP.svg",
    "{U/P}": "https://svgs.scryfall.io/card-symbols/UP.svg",
    "{B/P}": "https://svgs.scryfall.io/card-symbols/BP.svg",
    "{R/P}": "https://svgs.scryfall.io/card-symbols/RP.svg",
    "{G/P}": "https://svgs.scryfall.io/card-symbols/GP.svg",
    "{HW}": "https://svgs.scryfall.io/card-symbols/HW.svg",
    "{HR}": "https://svgs.scryfall.io/card-symbols/HR.svg",
    "{T}": "https://svgs.scryfall.io/card-symbols/T.svg",
    "{Q}": "https://svgs.scryfall.io/card-symbols/Q.svg",
    "{X}": "https://svgs.scryfall.io/card-symbols/X.svg",
    "{Y}": "https://svgs.scryfall.io/card-symbols/Y.svg",
    "{Z}": "https://svgs.scryfall.io/card-symbols/Z.svg",
    "{S}": "https://svgs.scryfall.io/card-symbols/S.svg",
    "{C}": "https://svgs.scryfall.io/card-symbols/C.svg",
    "{CHAOS}": "https://svgs.scryfall.io/card-symbols/CHAOS.svg",
    "{E}": "https://svgs.scryfall.io/card-symbols/E.svg",
    "{TK}": "https://svgs.scryfall.io/card-symbols/TK.svg",
    "{PW}": "https://svgs.scryfall.io/card-symbols/PW.svg",
    "{½}": "https://svgs.scryfall.io/card-symbols/HALF.svg",    
    "{A}": "https://svgs.scryfall.io/card-symbols/A.svg",
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
        const symbol = match.trim();
        const iconUrl = manaIcons[symbol];
        if (iconUrl) {
          const manaIcon = document.createElement("img");
          manaIcon.src = iconUrl;
          manaIcon.alt = "";
          manaIcon.className = "mana-icon";
  
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
    modalCardImage.src = cardData.image_uris.border_crop;
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
