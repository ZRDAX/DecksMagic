
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

$(document).ready(function () {
    const PesquisaInput = $("[name=card-name]");
    const title = $(".Cards-pesquisados");
    const cardsContainer = $(".cards-container");
    const cardModal = $("#cardModal");

    function formSubmitted(event) {
        event.preventDefault();
        const searchTerm = PesquisaInput.val().trim();

        if (!searchTerm) {
            // Se a pesquisa estiver vazia, mostre cartas aleatórias
            title.text("Cartas Aleatórias:");
            title.css("color", "rgb(252, 252, 252)");
            PesquisaInput.val("");
            cardsContainer.empty();

            getRandomCards();
        } else {
            title.text(`${searchTerm} cards:`);
            title.css("color", "rgb(252, 252, 252)");
            PesquisaInput.val("");
            cardsContainer.empty();

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
                cardElement.click(function () {
                    showModal(cardData);
                });
                cardsContainer.append(cardElement);
            } else {
                cardsContainer.text("Nenhuma carta aleatória encontrada.");
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
                data.forEach(function (card) {
                    if (card.image_uris) {
                        const { image_uris, name } = card;
                        const cardElement = createCardElement(image_uris.normal, name);
                        cardElement.click(function () {
                            showModal(card);
                        });
                        cardsContainer.append(cardElement);
                    }
                });
            } else {
                cardsContainer.text("Nenhuma carta encontrada.");
            }
        } catch (error) {
            console.error(`Erro na solicitação: ${error.message}`);
        }
    }

    function createCardElement(imageUrl, altText) {
        const cardElement = $("<img>").addClass("card-img");
        cardElement.attr("src", imageUrl);
        cardElement.attr("alt", altText);
        return cardElement;
    }

    // Função para mapear os símbolos de mana para elementos de imagem
    function mapManaSymbolsToIcons(manaCost) {
        const regex = /{[^{}]+}/g;
        const matches = manaCost.match(regex);

        if (matches) {
            matches.forEach(function (match) {
                const symbol = match.trim();
                const iconUrl = manaIcons[symbol];
                if (iconUrl) {
                    const manaIcon = $("<img>").attr("src", iconUrl).addClass("mana-icon");
                    manaIcon.attr("alt", "");
                    manaIcon.addClass("mana-icon");

                    manaCost = manaCost.replace(new RegExp(symbol, "g"), manaIcon[0].outerHTML);
                }
            });
        }

        return manaCost;
    }

    function showModal(cardData) {
        const modalCardName = $("#modalCardName");
        const modalCardImage = $("#modalCardImage");
        const modalManaCost = $("#modalManaCost");
        const modalType = $("#modalType");
        const modalSetName = $("#modalSetName");
        const modalText = $("#modalText");
        const modalArtist = $("#modalArtist");

        modalCardName.text(cardData.name);
        modalCardImage.attr("src", cardData.image_uris.border_crop);
        modalCardImage.attr("alt", cardData.name);
        modalManaCost.html(mapManaSymbolsToIcons(cardData.mana_cost || "N/A"));
        modalType.text(cardData.type_line || "N/A");
        modalSetName.text(cardData.set_name || "N/A");
        modalText.text(cardData.oracle_text || "N/A");
        modalArtist.text(cardData.artist || "N/A");


        function createCardElement(card) {
            const cardElement = $("<div>").addClass("deck-card");
            const cardImage = $("<img>")
                .addClass("deck-card-image")
                .attr("src", card.image_uris.art_crop)
                .attr("alt", card.name);
            const cardNameImg = $("<img>")
                .addClass("deck-card-nameImg")
                .attr("src", card.image_uris.border_crop);

            cardElement.append(cardImage, cardNameImg);
            return cardElement;
        }

        // Remova todos os botões "Adicionar ao Deck" existentes
        $(".add-to-deck-button").remove();

        const addButton = $("<button>")
            .text("Adicionar ao Deck")
            .addClass("add-to-deck-button");

        addButton.click(function () {
            const deckCardElement = createCardElement(cardData);
            $(".SBdeck").append(deckCardElement);
            klose(); // Feche o modal ao adicionar a carta ao deck
        });


        // Adicionar o botão abaixo da carta
        $("#modalCardImage").after(addButton);

        cardModal.css("display", "block");

        modalCardImage.click(klose);
        cardModal.click(function (event) {
            if (event.target === cardModal[0]) {
                klose();
            }
        });
    }

    function klose() {
        cardModal.css("display", "none");
    }

    // Função para remover uma carta do deck-card
    function removeCardFromDeckCard(cardElement) {
        cardElement.remove();
    }

    // Adicione um ouvinte de evento de clique às cartas no deck-card
    $(".SBdeck").on("click", ".deck-card", function () {
        removeCardFromDeckCard($(this));
    });


    $("form").submit(formSubmitted);
});
//document.querySelector("form").addEventListener("submit", formSubmitted);
