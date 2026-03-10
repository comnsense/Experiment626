// Логика за pick-cards.html (ръчен избор на карти)

document.addEventListener('DOMContentLoaded', function() {
    const cardsGrid = document.getElementById('cardsGrid');
    const searchBox = document.getElementById('searchBox');
    const selectedList = document.getElementById('selectedList');
    const counter = document.getElementById('counter');
    const interpretBtn = document.getElementById('interpretBtn');
    const clearSelectedBtn = document.getElementById('clearSelectedBtn');
    const interpretationPanel = document.getElementById('interpretationPanel');
    const pickInterpretation = document.getElementById('pickInterpretation');

    let selectedCards = []; // макс 5
    let allCardsForDisplay = []; // всички карти за показване

    // Инициализация: показване на всички карти
    function initCardsGrid() {
        allCardsForDisplay = [...allCards]; // от data.js
        
        renderCards(allCardsForDisplay);
    }

    function renderCards(cardsToShow) {
        cardsGrid.innerHTML = '';
        
        cardsToShow.forEach(card => {
            const cardEl = document.createElement('div');
            cardEl.className = `browser-card ${getSuitClass(card)}`;
            cardEl.setAttribute('data-card-id', card.id);
            
            // Проверка дали картата е вече избрана
            if (selectedCards.some(c => c.id === card.id)) {
                cardEl.classList.add('selected');
            }
            
            // Ако вече има 5 избрани и тази не е избрана, disable
            if (selectedCards.length >= 5 && !selectedCards.some(c => c.id === card.id)) {
                cardEl.classList.add('disabled');
            }
            
            cardEl.innerHTML = `
                <strong>${card.name}</strong>
                <div class="card-suit">${getSuitName(card)}</div>
                <div style="font-size: 0.8rem; margin-top: 4px;">${card.keyword}</div>
            `;
            
            cardEl.addEventListener('click', () => toggleCardSelection(card));
            
            cardsGrid.appendChild(cardEl);
        });
    }

    function getSuitClass(card) {
        if (card.suit === 'major') return 'major-bg';
        return card.suit + '-bg';
    }

    function getSuitName(card) {
        if (card.suit === 'major') return 'Голям аркан';
        const suitNames = {
            wands: 'Жезли',
            cups: 'Чаши',
            swords: 'Мечове',
            pentacles: 'Пентакли'
        };
        return suitNames[card.suit] || '';
    }

    function toggleCardSelection(card) {
        const index = selectedCards.findIndex(c => c.id === card.id);
        
        if (index >= 0) {
            // Премахване от избрани
            selectedCards.splice(index, 1);
        } else {
            // Добавяне, ако няма 5
            if (selectedCards.length < 5) {
                selectedCards.push(card);
            } else {
                alert('Можеш да избереш най-много 5 карти');
                return;
            }
        }
        
        updateUI();
    }

    function updateUI() {
        // Обновяване на брояча
        counter.textContent = `${selectedCards.length} / 5 избрани`;
        
        // Обновяване на списъка с избрани карти
        if (selectedCards.length === 0) {
            selectedList.innerHTML = '<div style="text-align: center; color: #9b8569; padding: 20px;">Все още нямаш избрани карти</div>';
        } else {
            selectedList.innerHTML = '';
            selectedCards.forEach((card, index) => {
                const item = document.createElement('div');
                item.className = `selected-item ${getSuitClass(card)}`;
                item.innerHTML = `
                    <div>
                        <strong>${card.name}</strong><br>
                        <small>${card.keyword}</small>
                    </div>
                    <button class="remove-btn" data-card-id="${card.id}">×</button>
                `;
                
                // Бутон за премахване
                item.querySelector('.remove-btn').addEventListener('click', (e) => {
                    e.stopPropagation();
                    removeCard(card.id);
                });
                
                selectedList.appendChild(item);
            });
        }
        
        // Активиране/деактивиране на бутона за тълкуване
        if (selectedCards.length > 0) {
            interpretBtn.disabled = false;
        } else {
            interpretBtn.disabled = true;
            interpretationPanel.style.display = 'none';
        }
        
        // Прерисуване на основната мрежа (за да се обновят селектираните/disabled състояния)
        filterAndRenderCards();
    }

    function removeCard(cardId) {
        selectedCards = selectedCards.filter(c => c.id != cardId);
        updateUI();
    }

    function filterAndRenderCards() {
        const searchTerm = searchBox.value.toLowerCase();
        
        let filtered = allCardsForDisplay;
        
        if (searchTerm.trim() !== '') {
            filtered = allCardsForDisplay.filter(card => 
                card.name.toLowerCase().includes(searchTerm) ||
                (card.keyword && card.keyword.toLowerCase().includes(searchTerm)) ||
                (card.meaning && card.meaning.toLowerCase().includes(searchTerm))
            );
        }
        
        renderCards(filtered);
    }

    // Тълкуване на избраните карти
    function interpretSelected() {
        if (selectedCards.length === 0) return;
        
        // Събиране на ключови теми
        const allKeywords = selectedCards.map(c => c.keyword).join(' · ');
        
        // Обща тема – опит за синтез
        let generalTheme = 'Разнообразни енергии';
        
        // Проверка дали всички са от една боя
        const allSameSuit = selectedCards.every(c => c.suit === selectedCards[0].suit);
        if (allSameSuit) {
            const suitThemes = {
                wands: 'Фокус върху действие, страст и творчество',
                cups: 'Фокус върху емоции, любов и връзки',
                swords: 'Фокус върху мисли, конфликти и истина',
                pentacles: 'Фокус върху материално, здраве и сигурност',
                major: 'Силно влияние на съдбовни сили'
            };
            generalTheme = suitThemes[selectedCards[0].suit] || generalTheme;
        }
        
        // Проверка за преобладаване на Големи аркани
        const majorCount = selectedCards.filter(c => c.type === 'major').length;
        if (majorCount >= 3) {
            generalTheme = 'Силно кармично влияние, важни житейски уроци';
        }
        
        // Създаване на интерпретация
        let interpretation = `<strong>Обща тема:</strong> ${generalTheme}<br><br>`;
        interpretation += `<strong>Ключови думи:</strong> ${allKeywords}<br><br>`;
        interpretation += `<strong>Избрани карти:</strong><br>`;
        
        selectedCards.forEach((card, i) => {
            interpretation += `<br><strong>${i+1}. ${card.name}</strong> (${card.keyword})<br>`;
            interpretation += `${card.meaning}<br>`;
        });
        
        pickInterpretation.innerHTML = interpretation;
        interpretationPanel.style.display = 'block';
    }

    // Събития
    searchBox.addEventListener('input', filterAndRenderCards);
    
    interpretBtn.addEventListener('click', () => {
        interpretSelected();
    });
    
    clearSelectedBtn.addEventListener('click', () => {
        selectedCards = [];
        interpretationPanel.style.display = 'none';
        updateUI();
    });

    // Инициализация
    initCardsGrid();
});
