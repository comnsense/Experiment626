// Логика за five-cards.html

document.addEventListener('DOMContentLoaded', function() {
    const drawBtn = document.getElementById('drawBtn');
    const clearBtn = document.getElementById('clearBtn');
    const cardCountSelect = document.getElementById('cardCount');
    const cardsContainer = document.getElementById('cardsContainer');
    const interpretationContent = document.getElementById('interpretationContent');

    let drawnCards = []; // текущо изтеглени карти

    drawBtn.addEventListener('click', drawCards);
    clearBtn.addEventListener('click', clearCards);

    function drawCards() {
        const count = parseInt(cardCountSelect.value);
        
        // Изтегляне на случайни карти от allCards (без повторение)
        const shuffled = [...allCards].sort(() => 0.5 - Math.random());
        drawnCards = shuffled.slice(0, count);
        
        displayCards();
        interpretCards();
    }

    function displayCards() {
        cardsContainer.innerHTML = '';
        
        drawnCards.forEach((card, index) => {
            const cardEl = document.createElement('div');
            cardEl.className = 'mini-card';
            cardEl.setAttribute('data-card-id', card.id);
            
            // Цвят според боята
            let suitColor = '';
            if (card.suit === 'wands') suitColor = 'wands';
            else if (card.suit === 'cups') suitColor = 'cups';
            else if (card.suit === 'swords') suitColor = 'swords';
            else if (card.suit === 'pentacles') suitColor = 'pentacles';
            else if (card.suit === 'major') suitColor = 'major';
            
            if (suitColor) {
                cardEl.classList.add(suitColor);
            }
            
            cardEl.innerHTML = `
                <div class="mini-card-header">
                    <span class="mini-card-name">${card.name}</span>
                    <span class="mini-card-keyword">${card.keyword}</span>
                </div>
                <div class="mini-card-desc">${card.meaning.substring(0, 80)}...</div>
            `;
            
            // Клик за детайли
            cardEl.addEventListener('click', () => showCardDetail(card));
            
            cardsContainer.appendChild(cardEl);
        });
    }

    function interpretCards() {
        if (drawnCards.length === 0) {
            interpretationContent.textContent = 'Изтегли карти, за да видиш обобщение.';
            return;
        }

        // Събиране на ключови теми
        const allKeywords = drawnCards.map(c => c.keyword).join(' · ');
        const allMeanings = drawnCards.map(c => c.meaning);
        
        // Обща тема – опит за синтез
        let generalTheme = 'Разнообразни енергии';
        if (drawnCards.every(c => c.suit === 'wands')) generalTheme = 'Фокус върху действие и страст';
        else if (drawnCards.every(c => c.suit === 'cups')) generalTheme = 'Фокус върху емоции и връзки';
        else if (drawnCards.every(c => c.suit === 'swords')) generalTheme = 'Фокус върху мисли и конфликти';
        else if (drawnCards.every(c => c.suit === 'pentacles')) generalTheme = 'Фокус върху материално и здраве';
        else if (drawnCards.some(c => c.type === 'major')) generalTheme = 'Силно влияние на съдбата';
        
        // Създаване на интерпретация
        let interpretation = `<strong>Обща тема:</strong> ${generalTheme}<br><br>`;
        interpretation += `<strong>Ключови думи:</strong> ${allKeywords}<br><br>`;
        interpretation += `<strong>Обобщение:</strong><br>`;
        
        drawnCards.forEach((card, i) => {
            interpretation += `${i+1}. ${card.name} (${card.keyword}): ${card.meaning.substring(0, 60)}...<br>`;
        });
        
        interpretationContent.innerHTML = interpretation;
    }

    function showCardDetail(card) {
        // Показване на детайли в избран панел (може да се разшири)
        interpretationContent.innerHTML = `
            <strong>${card.name}</strong> (${card.keyword})<br><br>
            ${card.meaning}<br><br>
            <em>Кликни върху друга карта за детайли или тегли отново.</em>
        `;
    }

    function clearCards() {
        drawnCards = [];
        cardsContainer.innerHTML = '';
        interpretationContent.textContent = 'Изтегли карти, за да видиш обобщение.';
    }
});
