/**
 * Таро приложение - Основна логика
 * Автор: comnsnense
 * Година: 2026
 */

document.addEventListener('DOMContentLoaded', function() {
    // Елементи от DOM
    const themeToggle = document.getElementById('themeToggle');
    const htmlElement = document.documentElement;
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const navMenu = document.getElementById('navMenu');
    const allCardsLink = document.getElementById('allCardsLink');
    const drawCardsLink = document.getElementById('drawCardsLink');
    const selectCardsLink = document.getElementById('selectCardsLink');
    const homeLink = document.getElementById('homeLink');
    const container = document.getElementById('mainContainer');

    // ===== ТЕМА =====
    // Зареждане на тема от localStorage
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
        
        // Смяна на иконата
        const icon = this.querySelector('i');
        if (navMenu.classList.contains('show')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-times');
        } else {
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // Затваряне на менюто при клик върху линк
    document.querySelectorAll('.nav-item a').forEach(link => {
        link.addEventListener('click', function() {
            navMenu.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        });
    });

    // Затваряне при клик извън менюто
    document.addEventListener('click', function(event) {
        if (!navMenu.contains(event.target) && !mobileMenuBtn.contains(event.target)) {
            navMenu.classList.remove('show');
            const icon = mobileMenuBtn.querySelector('i');
            icon.classList.remove('fa-times');
            icon.classList.add('fa-bars');
        }
    });

    // ===== НАВИГАЦИЯ =====
    function setActiveLink(activeLink) {
        [allCardsLink, drawCardsLink, selectCardsLink].forEach(link => {
            link.classList.remove('active');
        });
        activeLink.classList.add('active');
    }

    allCardsLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(allCardsLink);
        showAllCards();
    });

    drawCardsLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(drawCardsLink);
        showDrawCards();
    });

    selectCardsLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(selectCardsLink);
        showSelectCards();
    });

    homeLink.addEventListener('click', (e) => {
        e.preventDefault();
        setActiveLink(allCardsLink);
        showAllCards();
    });

    // ===== ФУНКЦИИ ЗА СТРАНИЦИТЕ =====

    /**
     * Показва страницата с всички карти
     */
    function showAllCards() {
        let html = `
            <div class="info-card">
                <div class="card-title">
                    <i class="fas fa-layer-group"></i> Всички карти
                </div>
                <div class="btn-group">
                    <button class="btn" onclick="showMajor()"><i class="fas fa-star"></i> Големи аркани</button>
                    <button class="btn" onclick="showMinorNumber(1)"><i class="fas fa-hashtag"></i> Числа 1-10</button>
                    <button class="btn" onclick="showCourtCards()"><i class="fas fa-crown"></i> Придворни 11-14</button>
                </div>
                <div id="cardsDisplay">
                    ${generateMajorButtons()}
                    ${generateMinorNumberButtons()}
                </div>
            </div>
        `;
        container.innerHTML = html;
        
        // Показваме Големите аркани по подразбиране
        showMajor();
    }

    /**
     * Генерира бутони за Големите аркани
     */
    function generateMajorButtons() {
        let html = '<div class="card-title" style="margin-top: 2rem;"><i class="fas fa-star"></i> Големи аркани</div><div class="button-grid" id="majorGrid">';
        for (let i = 0; i <= 21; i++) {
            html += `<button class="num-btn major" data-num="${i}" onclick="showMajorCard(${i})">${i === 0 ? '0' : i}</button>`;
        }
        html += '</div><div id="majorDisplay"></div>';
        return html;
    }

    /**
     * Генерира бутони за числата 1-14
     */
    function generateMinorNumberButtons() {
        let html = '<div class="card-title" style="margin-top: 2rem;"><i class="fas fa-hashtag"></i> Числа 1-14</div><div class="button-grid" id="minorGrid">';
        for (let i = 1; i <= 14; i++) {
            let specialClass = i >= 11 ? 'special' : '';
            html += `<button class="num-btn ${specialClass}" data-num="${i}" onclick="showMinorNumber(${i})">${i}</button>`;
        }
        html += '</div><div id="minorDisplay"></div>';
        return html;
    }

    /**
     * Показва страницата за теглене на карти
     */
    function showDrawCards() {
        let html = `
            <div class="info-card">
                <div class="card-title">
                    <i class="fas fa-hand"></i> Тегли карти
                </div>
                <div class="draw-controls">
                    <div class="draw-options">
                        <label for="cardCount">Брой карти:</label>
                        <select id="cardCount" class="card-count-select">
                            <option value="1">1 карта</option>
                            <option value="2">2 карти</option>
                            <option value="3">3 карти</option>
                            <option value="4">4 карти</option>
                            <option value="5" selected>5 карти</option>
                        </select>
                        <button class="btn" onclick="drawCards()"><i class="fas fa-crystal-ball"></i> Тегли</button>
                        <button class="btn" onclick="clearCards()"><i class="fas fa-eraser"></i> Изчисти</button>
                    </div>
                </div>
                <div id="drawnCardsContainer"></div>
                <div class="interpretation-panel" id="interpretationPanel">
                    <div class="interpretation-header">📜 Тълкувание</div>
                    <div id="interpretationContent">Изтегли карти, за да видиш обобщение.</div>
                </div>
            </div>
        `;
        container.innerHTML = html;
    }

    /**
     * Показва страницата "Избери карти" (в разработка)
     */
    function showSelectCards() {
        let html = `
            <div class="info-card">
                <div class="card-title">
                    <i class="fas fa-check-double"></i> Избери карти
                </div>
                <p>Тази страница е в процес на разработка. Ще можете да избирате конкретни карти и да виждате техните значения.</p>
                <p>Засега използвайте "Всички карти" за разглеждане или "Тегли" за случайни.</p>
            </div>
        `;
        container.innerHTML = html;
    }

    // ===== ФУНКЦИИ ЗА ПОКАЗВАНЕ НА КАРТИ =====

    /**
     * Показва Големите аркани (първата по подразбиране)
     */
    window.showMajor = function() {
        showMajorCard(0);
    };

    /**
     * Показва конкретна Голяма аркана
     */
    window.showMajorCard = function(index) {
        const card = tarotData.major[index];
        const display = document.getElementById('majorDisplay');
        if (display) {
            display.innerHTML = `
                <div class="minor-item">
                    <div class="minor-head">
                        <span class="minor-name">${card.name}</span>
                        <span style="background: var(--skill-bg); padding: 0.3rem 1rem; border-radius: 20px;">${card.keyword}</span>
                    </div>
                    <div class="minor-desc">${card.meaning}</div>
                </div>
            `;
        }
    };

    /**
     * Показва всички карти с дадено число
     */
    window.showMinorNumber = function(num) {
        const cards = tarotData.minor.filter(c => c.number == num);
        let display = document.getElementById('minorDisplay');
        if (!display) {
            display = document.createElement('div');
            display.id = 'minorDisplay';
            const cardsDisplay = document.getElementById('cardsDisplay');
            if (cardsDisplay) cardsDisplay.appendChild(display);
        }
        
        let html = '';
        cards.sort((a,b) => {
            const order = { wands:1, cups:2, swords:3, pentacles:4 };
            return order[a.suit] - order[b.suit];
        });
        
        cards.forEach(card => {
            let suitName = '';
            if (card.suit === 'wands') suitName = 'Жезли (Огън)';
            else if (card.suit === 'cups') suitName = 'Чаши (Вода)';
            else if (card.suit === 'swords') suitName = 'Мечове (Въздух)';
            else if (card.suit === 'pentacles') suitName = 'Пентакли (Земя)';
            
            html += `
                <div class="minor-item">
                    <div class="minor-head">
                        <span class="minor-name">${card.name} (${card.nick})</span>
                        <span style="background: var(--skill-bg); padding: 0.3rem 1rem; border-radius: 20px;">${suitName}</span>
                    </div>
                    <div class="minor-desc"><strong>${card.keyword}:</strong> ${card.meaning}</div>
                </div>
            `;
        });
        display.innerHTML = html;
    };

    /**
     * Показва придворните карти (11-14)
     */
    window.showCourtCards = function() {
        showMinorNumber(11);
    };

    /**
     * Тегли определен брой случайни карти
     */
    window.drawCards = function() {
        const count = parseInt(document.getElementById('cardCount').value);
        const shuffled = [...allCards].sort(() => 0.5 - Math.random());
        const drawn = shuffled.slice(0, count);
        
        let html = '<div class="cards-container">';
        drawn.forEach(card => {
            html += `
                <div class="mini-card" onclick='showCardDetail(${JSON.stringify(card)})'>
                    <div class="mini-card-header">
                        <span class="mini-card-name">${card.name}</span>
                        <span class="mini-card-keyword">${card.keyword}</span>
                    </div>
                    <div class="mini-card-desc">${card.meaning.substring(0, 80)}...</div>
                </div>
            `;
        });
        html += '</div>';
        document.getElementById('drawnCardsContainer').innerHTML = html;
        
        // Интерпретация
        let interpretation = `<strong>Ключови думи:</strong> ${drawn.map(c => c.keyword).join(' · ')}<br><br>`;
        interpretation += `<strong>Карти:</strong><br>`;
        drawn.forEach((card, i) => {
            interpretation += `${i+1}. ${card.name} – ${card.keyword}<br>`;
        });
        document.getElementById('interpretationContent').innerHTML = interpretation;
    };

    /**
     * Изчиства изтеглените карти
     */
    window.clearCards = function() {
        document.getElementById('drawnCardsContainer').innerHTML = '';
        document.getElementById('interpretationContent').innerHTML = 'Изтегли карти, за да видиш обобщение.';
    };

    /**
     * Показва детайли за конкретна карта
     */
    window.showCardDetail = function(card) {
        document.getElementById('interpretationContent').innerHTML = `
            <strong>${card.name}</strong> (${card.keyword})<br><br>
            ${card.meaning}<br><br>
            <em>Кликни върху друга карта за детайли</em>
        `;
    };

    // Стартираме с всички карти
    showAllCards();
});
