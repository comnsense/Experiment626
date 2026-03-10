/**
 * Таро приложение - Основна логика с изображения
 * Автор: comnsnense
 * Година: 2026
 */

document.addEventListener('DOMContentLoaded', function() {
    // ===== DOM ЕЛЕМЕНТИ =====
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const allCardsLink = document.querySelector('.nav-item a[href="index.html"]');
    const selectCardsLink = document.getElementById('selectCardsLink');
    const homeLink = document.getElementById('homeLink');
    const container = document.getElementById('mainContainer');

    // ===== ТЕМА =====
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'light') {
        htmlElement.setAttribute('data-theme', 'light');
        themeToggle.checked = true;
    }

    themeToggle.addEventListener('change', function() {
        if (this.checked) {
            htmlElement.setAttribute('data-theme', 'light');
            localStorage.setItem('theme', 'light');
        } else {
            htmlElement.removeAttribute('data-theme');
            localStorage.setItem('theme', 'dark');
        }
    });

    // ===== МОБИЛНО МЕНЮ =====
    mobileMenuBtn.addEventListener('click', function() {
        navMenu.classList.toggle('show');
        const icon = this.querySelector('i');
        icon.classList.toggle('fa-bars');
        icon.classList.toggle('fa-times');
    });

    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.add('fa-bars');
            icon.classList.remove('fa-times');
        });
    });

    // ===== ПОМОЩНИ ФУНКЦИИ ЗА ИЗОБРАЖЕНИЯ =====
    
    /**
     * Връща английския ранг за числото
     */
    function getEnglishRank(number) {
        const ranks = {
            1: 'ace', 2: 'two', 3: 'three', 4: 'four', 5: 'five',
            6: 'six', 7: 'seven', 8: 'eight', 9: 'nine', 10: 'ten',
            11: 'page', 12: 'knight', 13: 'queen', 14: 'king'
        };
        return ranks[number] || 'card';
    }

    /**
     * Връща английското име на Големите аркани
     */
    function getEnglishName(bgName) {
        const names = {
            'Глупакът': 'fool',
            'Магьосникът': 'magician',
            'Върховната жрица': 'high-priestess',
            'Императрицата': 'empress',
            'Императорът': 'emperor',
            'Йерофантът': 'hierophant',
            'Влюбените': 'lovers',
            'Колесницата': 'chariot',
            'Силата': 'strength',
            'Отшелникът': 'hermit',
            'Колелото на съдбата': 'wheel-of-fortune',
            'Справедливост': 'justice',
            'Обесеният': 'hanged-man',
            'Смърт': 'death',
            'Умереност': 'temperance',
            'Дяволът': 'devil',
            'Кулата': 'tower',
            'Звездата': 'star',
            'Луната': 'moon',
            'Слънцето': 'sun',
            'Съд': 'judgement',
            'Светът': 'world'
        };
        return names[bgName] || bgName.toLowerCase().replace(/[^a-z0-9]/g, '-');
    }

    /**
     * Връща път до изображението на картата
     */
    function getCardImagePath(card) {
        if (!card) return 'images/placeholder.jpg';
        
        if (card.type === 'major') {
            const num = card.number.toString().padStart(2, '0');
            const nameEn = getEnglishName(card.name);
            return `images/major-${num}-${nameEn}.jpg`;
        } else {
            const num = card.number.toString().padStart(2, '0');
            const rankEn = getEnglishRank(card.number);
            return `images/${card.suit}-${num}-${rankEn}.jpg`;
        }
    }

    /**
     * Връща името на боята
     */
    function getSuitName(card) {
        if (card.type === 'major') return 'Голям аркан';
        const suits = {
            'wands': 'Жезли',
            'cups': 'Чаши',
            'swords': 'Мечове',
            'pentacles': 'Пентакли'
        };
        return suits[card.suit] || card.suit;
    }

    /**
     * Връща номер за показване
     */
    function getDisplayNumber(card) {
        if (card.type === 'major') {
            return card.number === 0 ? '0' : card.number.toString();
        } else {
            const roman = ['0', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII', 'XIII', 'XIV'];
            return roman[card.number] || card.number.toString();
        }
    }

    // ===== НАВИГАЦИЯ =====
    function setActiveLink(activeLink) {
        document.querySelectorAll('.nav-item a').forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    if (allCardsLink) {
        allCardsLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(allCardsLink);
            showAllCards();
        });
    }

    if (selectCardsLink) {
        selectCardsLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(selectCardsLink);
            showSelectCards();
        });
    }

    if (homeLink) {
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            setActiveLink(allCardsLink);
            showAllCards();
        });
    }

    // ===== СТРАНИЦА "ВСИЧКИ КАРТИ" =====
    
    function showAllCards() {
        let html = `
            <div class="info-card">
                <div class="card-title">
                    <i class="fas fa-layer-group"></i> Всички карти
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="window.showMajor(0)"><i class="fas fa-star"></i> Големи аркани</button>
                    <button class="btn" onclick="window.showMinorNumber(1)"><i class="fas fa-hashtag"></i> Числа 1-10</button>
                    <button class="btn" onclick="window.showCourtCards()"><i class="fas fa-crown"></i> Придворни 11-14</button>
                </div>
                <div id="cardsDisplay">
                    ${generateMajorButtons()}
                    ${generateMinorButtons()}
                </div>
                <div id="cardDetailDisplay" class="minor-item" style="margin-top: 2rem; display: none;"></div>
            </div>
        `;
        container.innerHTML = html;
    }

    function generateMajorButtons() {
        let html = '<div class="card-title" style="margin-top: 2rem;"><i class="fas fa-star"></i> Големи аркани</div>';
        html += '<div class="button-grid" id="majorGrid">';
        for (let i = 0; i <= 21; i++) {
            html += `<button class="num-btn major" onclick="window.showMajor(${i})">${i === 0 ? '0' : i}</button>`;
        }
        html += '</div>';
        return html;
    }

    function generateMinorButtons() {
        let html = '<div class="card-title" style="margin-top: 2rem;"><i class="fas fa-hashtag"></i> Числа 1-14</div>';
        html += '<div class="button-grid" id="minorGrid">';
        for (let i = 1; i <= 14; i++) {
            html += `<button class="num-btn ${i >= 11 ? 'special' : ''}" onclick="window.showMinorNumber(${i})">${i}</button>`;
        }
        html += '</div>';
        return html;
    }

    // Глобални функции за показване на карти с изображения
    window.showMajor = function(index) {
        const card = tarotData.major[index];
        const imagePath = getCardImagePath({ type: 'major', number: index, name: card.name });
        
        let display = document.getElementById('cardDetailDisplay');
        if (!display) {
            display = document.createElement('div');
            display.id = 'cardDetailDisplay';
            display.className = 'minor-item';
            display.style.marginTop = '2rem';
            document.getElementById('cardsDisplay').appendChild(display);
        }
        
        display.style.display = 'block';
        display.innerHTML = `
            <div style="display: flex; gap: 2rem; flex-wrap: wrap;">
                <div style="flex: 0 0 200px;">
                    <img src="${imagePath}" alt="${card.name}" 
                         style="width: 100%; border-radius: 12px; border: 2px solid var(--border-color); box-shadow: var(--shadow);"
                         onerror="this.src='images/placeholder.jpg';">
                </div>
                <div style="flex: 1;">
                    <div class="minor-head">
                        <span class="minor-name">${card.name}</span>
                        <span style="background: var(--skill-bg); padding: 0.3rem 1rem; border-radius: 20px;">${card.keyword}</span>
                    </div>
                    <div class="minor-desc">${card.meaning}</div>
                </div>
            </div>
        `;
    };

    window.showMinorNumber = function(num) {
        const cards = tarotData.minor.filter(c => c.number == num);
        
        let display = document.getElementById('cardDetailDisplay');
        if (!display) {
            display = document.createElement('div');
            display.id = 'cardDetailDisplay';
            display.className = 'minor-item';
            display.style.marginTop = '2rem';
            document.getElementById('cardsDisplay').appendChild(display);
        }
        
        let html = '';
        cards.sort((a, b) => {
            const order = { wands: 1, cups: 2, swords: 3, pentacles: 4 };
            return order[a.suit] - order[b.suit];
        });

        cards.forEach(card => {
            const imagePath = getCardImagePath(card);
            html += `
                <div class="minor-item" style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                    <div style="flex: 0 0 120px;">
                        <img src="${imagePath}" alt="${card.name}" 
                             style="width: 100%; border-radius: 8px; border: 2px solid var(--border-color);"
                             onerror="this.src='images/placeholder.jpg';">
                    </div>
                    <div style="flex: 1;">
                        <div class="minor-head">
                            <span class="minor-name">${card.name} (${card.nick})</span>
                            <span style="background: var(--skill-bg); padding: 0.3rem 1rem; border-radius: 20px;">${getSuitName(card)}</span>
                        </div>
                        <div class="minor-desc"><strong>${card.keyword}:</strong> ${card.meaning}</div>
                    </div>
                </div>
            `;
        });
        
        display.style.display = 'block';
        display.innerHTML = html;
    };

    window.showCourtCards = function() {
        window.showMinorNumber(11);
    };

    // ===== СТРАНИЦА "ИЗБЕРИ КАРТИ" =====
    
    function showSelectCards() {
        let html = `
            <div class="info-card">
                <div class="card-title">
                    <i class="fas fa-check-double"></i> Избери карти
                </div>
                
                <div style="margin-bottom: 2rem;">
                    <div style="display: flex; gap: 1rem; flex-wrap: wrap; margin-bottom: 1rem;">
                        <input type="text" id="searchInput" placeholder="🔍 Търси карта..." 
                               style="flex: 1; padding: 0.8rem 1.2rem; border-radius: 30px; 
                                      border: 2px solid var(--border-color); 
                                      background-color: var(--bg-secondary); 
                                      color: var(--text-primary); font-size: 1rem;">
                        <select id="suitFilter" 
                                style="padding: 0.8rem 1.2rem; border-radius: 30px; 
                                       border: 2px solid var(--border-color); 
                                       background-color: var(--bg-secondary); 
                                       color: var(--text-primary); font-size: 1rem;">
                            <option value="all">Всички бои</option>
                            <option value="major">Големи аркани</option>
                            <option value="wands">Жезли (Огън)</option>
                            <option value="cups">Чаши (Вода)</option>
                            <option value="swords">Мечове (Въздух)</option>
                            <option value="pentacles">Пентакли (Земя)</option>
                        </select>
                    </div>
                    
                    <div style="display: flex; gap: 0.5rem; flex-wrap: wrap; justify-content: space-between; align-items: center;">
                        <div>
                            <span id="selectedCount" style="background-color: var(--accent); color: white; 
                                 padding: 0.3rem 1rem; border-radius: 20px; font-weight: 600;">
                                <i class="fas fa-check-circle"></i> 0 избрани
                            </span>
                        </div>
                        <div style="display: flex; gap: 0.5rem;">
                            <button class="btn" id="clearSelectionBtn"><i class="fas fa-times"></i> Изчисти</button>
                            <button class="btn" id="showSelectedBtn"><i class="fas fa-eye"></i> Покажи избраните</button>
                        </div>
                    </div>
                </div>

                <div id="cardsList" class="cards-grid"></div>

                <div id="selectedCardsPanel" style="margin-top: 2rem; display: none;">
                    <div class="card-title" style="font-size: 1.3rem; margin-bottom: 1rem;">
                        <i class="fas fa-check-circle" style="color: var(--accent);"></i> Избрани карти
                        <span id="selectedCountDetail" style="font-size: 1rem; margin-left: 1rem; color: var(--text-secondary);"></span>
                    </div>
                    
                    <div id="selectedCardsList" class="selected-cards-horizontal"></div>
                    
                    <div class="interpretation-panel" style="margin-top: 1rem; padding: 1.5rem; background-color: var(--bg-card); border: 1px solid var(--border-color); border-radius: 16px;">
                        <div style="font-size: 1.3rem; color: var(--accent); margin-bottom: 1rem;">
                            <i class="fas fa-scroll"></i> Тълкувание
                        </div>
                        <div id="selectedInterpretation" style="color: var(--text-secondary); line-height: 1.6;"></div>
                    </div>
                </div>
            </div>
        `;
        
        container.innerHTML = html;
        loadAllCardsForSelection();
        
        document.getElementById('searchInput').addEventListener('input', filterCards);
        document.getElementById('suitFilter').addEventListener('change', filterCards);
        document.getElementById('clearSelectionBtn').addEventListener('click', clearSelection);
        document.getElementById('showSelectedBtn').addEventListener('click', showSelectedCards);
    }

    function loadAllCardsForSelection() {
        const cardsList = document.getElementById('cardsList');
        const selectedCards = JSON.parse(sessionStorage.getItem('selectedCards') || '[]');
        
        let html = '';
        allCards.forEach(card => {
            const isSelected = selectedCards.some(c => c.id === card.id);
            const imagePath = getCardImagePath(card);
            
            html += `
                <div class="selectable-card ${isSelected ? 'selected' : ''}" data-card-id="${card.id}">
                    <div class="card-image-container">
                        <img src="${imagePath}" 
                             alt="${card.name}"
                             class="card-image"
                             loading="lazy"
                             onerror="this.src='images/placeholder.jpg'; this.onerror=null;">
                    </div>
                    
                    <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.3rem;">
                        <span class="card-number-badge">${getDisplayNumber(card)}</span>
                        <span class="card-suit-badge">${getSuitName(card)}</span>
                    </div>
                    
                    <div class="card-name">${card.name}</div>
                    <div class="card-keyword">${card.keyword}</div>
                    
                    ${isSelected ? '<div class="selected-check"><i class="fas fa-check"></i></div>' : ''}
                </div>
            `;
        });
        
        cardsList.innerHTML = html;
        
        document.querySelectorAll('.selectable-card').forEach(cardEl => {
            cardEl.addEventListener('click', function() {
                const cardId = this.getAttribute('data-card-id');
                toggleSelectCard(cardId);
            });
        });
        
        updateSelectedCount();
    }

    function filterCards() {
        const searchTerm = document.getElementById('searchInput').value.toLowerCase();
        const suitFilter = document.getElementById('suitFilter').value;
        
        document.querySelectorAll('.selectable-card').forEach(card => {
            const cardId = card.getAttribute('data-card-id');
            const cardData = allCards.find(c => c.id == cardId);
            
            if (!cardData) return;
            
            const matchesSearch = cardData.name.toLowerCase().includes(searchTerm) || 
                                 (cardData.keyword && cardData.keyword.toLowerCase().includes(searchTerm));
            
            let matchesSuit = true;
            if (suitFilter !== 'all') {
                if (suitFilter === 'major') {
                    matchesSuit = cardData.type === 'major';
                } else {
                    matchesSuit = cardData.suit === suitFilter;
                }
            }
            
            card.style.display = matchesSearch && matchesSuit ? 'flex' : 'none';
        });
    }

    function toggleSelectCard(cardId) {
        let selectedCards = JSON.parse(sessionStorage.getItem('selectedCards') || '[]');
        const cardData = allCards.find(c => c.id == cardId);
        
        if (!cardData) return;
        
        const index = selectedCards.findIndex(c => c.id === cardId);
        
        if (index === -1) {
            if (selectedCards.length < 10) {
                selectedCards.push(cardData);
            } else {
                alert('Може да изберете максимум 10 карти');
                return;
            }
        } else {
            selectedCards.splice(index, 1);
        }
        
        sessionStorage.setItem('selectedCards', JSON.stringify(selectedCards));
        
        const cardEl = document.querySelector(`.selectable-card[data-card-id="${cardId}"]`);
        if (cardEl) {
            if (index === -1) {
                cardEl.classList.add('selected');
                if (!cardEl.querySelector('.selected-check')) {
                    const check = document.createElement('div');
                    check.className = 'selected-check';
                    check.innerHTML = '<i class="fas fa-check"></i>';
                    cardEl.appendChild(check);
                }
            } else {
                cardEl.classList.remove('selected');
                const check = cardEl.querySelector('.selected-check');
                if (check) check.remove();
            }
        }
        
        updateSelectedCount();
        
        const panel = document.getElementById('selectedCardsPanel');
        if (panel && panel.style.display !== 'none') {
            showSelectedCards();
        }
    }

    function updateSelectedCount() {
        const selectedCards = JSON.parse(sessionStorage.getItem('selectedCards') || '[]');
        const countSpan = document.getElementById('selectedCount');
        if (countSpan) {
            countSpan.innerHTML = `<i class="fas fa-check-circle"></i> ${selectedCards.length} избрани`;
        }
    }

    function clearSelection() {
        sessionStorage.removeItem('selectedCards');
        
        document.querySelectorAll('.selectable-card').forEach(card => {
            card.classList.remove('selected');
            const check = card.querySelector('.selected-check');
            if (check) check.remove();
        });
        
        updateSelectedCount();
        
        const panel = document.getElementById('selectedCardsPanel');
        if (panel) {
            panel.style.display = 'none';
        }
    }

    function showSelectedCards() {
        const selectedCards = JSON.parse(sessionStorage.getItem('selectedCards') || '[]');
        const panel = document.getElementById('selectedCardsPanel');
        const list = document.getElementById('selectedCardsList');
        const interpretation = document.getElementById('selectedInterpretation');
        const countDetail = document.getElementById('selectedCountDetail');
        
        if (selectedCards.length === 0) {
            panel.style.display = 'none';
            return;
        }
        
        panel.style.display = 'block';
        countDetail.textContent = `(${selectedCards.length} карти)`;
        
        let html = '';
        selectedCards.forEach((card, index) => {
            const imagePath = getCardImagePath(card);
            
            html += `
                <div class="selected-card-item" onclick="window.removeSelectedCard(${index})">
                    <div class="card-image-container" style="margin-bottom: 0.3rem;">
                        <img src="${imagePath}" alt="${card.name}" class="card-image" onerror="this.src='images/placeholder.jpg';">
                    </div>
                    <div class="card-name" style="font-size: 0.8rem;">${card.name}</div>
                    <div class="selected-card-number">${index + 1}</div>
                    <div class="selected-card-remove"><i class="fas fa-times"></i></div>
                </div>
            `;
        });
        
        list.innerHTML = html;
        
        const allKeywords = selectedCards.map(c => c.keyword).join(' · ');
        let interpretationHtml = `
            <div style="background: linear-gradient(145deg, var(--skill-bg), var(--bg-card)); padding: 1rem; border-radius: 12px; margin-bottom: 1rem;">
                <strong style="color: var(--accent);">🔑 Ключови думи:</strong>
                <p style="margin-top: 0.5rem;">${allKeywords}</p>
            </div>
        `;
        
        selectedCards.forEach((card, i) => {
            interpretationHtml += `
                <div style="margin-bottom: 1rem; padding: 1rem; background-color: var(--bg-card); border-radius: 12px; border-left: 4px solid var(--accent);">
                    <strong style="color: var(--accent);">${i+1}. ${card.name}</strong>
                    <p style="margin-top: 0.3rem;">${card.meaning}</p>
                </div>
            `;
        });
        
        interpretation.innerHTML = interpretationHtml;
    }

    window.removeSelectedCard = function(index) {
        let selectedCards = JSON.parse(sessionStorage.getItem('selectedCards') || '[]');
        const cardId = selectedCards[index].id;
        selectedCards.splice(index, 1);
        sessionStorage.setItem('selectedCards', JSON.stringify(selectedCards));
        
        const cardEl = document.querySelector(`.selectable-card[data-card-id="${cardId}"]`);
        if (cardEl) {
            cardEl.classList.remove('selected');
            const check = cardEl.querySelector('.selected-check');
            if (check) check.remove();
        }
        
        updateSelectedCount();
        showSelectedCards();
    };

    // Стартираме с всички карти
    showAllCards();
});
