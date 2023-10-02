  const PesquisaInput = document.querySelector("[name=card-name]");
  const title = document.querySelector(".Cards-pesquisados");
  const cardsContainer = document.querySelector(".cards-container");
  const language = "Portuguese (Brazil)";

  function formSubmitted(event) {
    event.preventDefault();
    const ExprecaoDigitada = PesquisaInput.value;
    title.innerHTML = ExprecaoDigitada + " cards:";
    title.style.color = "rgb(252, 252, 252)";
    PesquisaInput.value = "";
    cardsContainer.innerHTML = "";
    const ApiMtgBr = `https://api.magicthegathering.io/v1/cards?name=${ExprecaoDigitada}&language=${language}`;
  
    fetch(ApiMtgBr)
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Erro na solicitação: ${response.status}`);
        }
        return response.json();
      })
      .then((data) => {
        // Limpador
        cardsContainer.innerHTML = "";
  
        // Verifica se a propriedade "cards" existe
        if (data.cards && data.cards.length > 0) {
          data.cards.forEach((card, index) => {
            if (card.imageUrl) {
              const { imageUrl, name } = card;
              const cardElement = document.createElement('img');
              cardElement.className = 'card-img';
              cardElement.src = imageUrl;
              cardElement.alt = name;
              cardElement.onclick = () => showModal(card, index);
              cardsContainer.appendChild(cardElement);
            }
          });
        } else {
          cardsContainer.innerHTML = "Nenhuma carta encontrada.";
        }
      })
      .catch((error) => {
        console.error(`Erro na solicitação: ${error.message}`);
      });
  }
  
  function showModal(cardData, index) {
    const modalCardName = document.getElementById('modalCardName');
    const modalCardImage = document.getElementById('modalCardImage');
    const modalManaCost = document.getElementById('modalManaCost');
    const modalType = document.getElementById('modalType');
    const modalSetName = document.getElementById('modalSetName');
    const modalText = document.getElementById('modalText');
    const modalArtist = document.getElementById('modalArtist');
  
    modalCardName.textContent = cardData.name;
    modalCardImage.src = cardData.imageUrl; // Define a imagem
    modalCardImage.alt = cardData.name; // Define o atributo alt
    modalManaCost.textContent = cardData.manaCost || 'N/A';
    modalType.textContent = cardData.type || 'N/A';
    modalSetName.textContent = cardData.setName || 'N/A';
    modalText.textContent = cardData.text || 'N/A';
    modalArtist.textContent = cardData.artist || 'N/A';
  
    cardModal.style.display = "block";
  
    // Adicione um evento de fechar modal ao clique na imagem da carta
    modalCardImage.onclick = klose;
    
    // Adicione um evento de fechar modal ao clique no modal
    cardModal.onclick = (event) => {
      if (event.target === cardModal) {
        klose();
      }
    };
  }
  function klose(){
       cardModal.style.display = 'none'
  }

  //showModal("Exemplo de Carta", "Criatura", "Esta é uma descrição de carta de exemplo.");


  document.querySelector("form").addEventListener("submit", formSubmitted);
