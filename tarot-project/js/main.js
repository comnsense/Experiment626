// Основна логика за index.html

document.addEventListener('DOMContentLoaded', function() {
    const majorGrid = document.getElementById('majorGrid');
    const minorGrid = document.getElementById('minorGrid');
    const infoPanel = document.getElementById('infoPanel');

    // Създаване на бутони за Големи аркани
    for (let i = 0; i <= 21; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn major';
        btn.setAttribute('data-num', i);
        btn.textContent = i === 0 ? '0' : i;
        btn.addEventListener('click', function() {
            setActive(btn);
            showMajor(i);
        });
        majorGrid.appendChild(btn);
    }

    // Създаване на бутони за числа 1-14
    for (let i = 1; i <= 14; i++) {
        const btn = document.createElement('button');
        btn.className = 'num-btn';
        if (i >= 11) btn.classList.add('special');
        btn.setAttribute('data-num', i);
        btn.textContent = i;
        btn.addEventListener('click', function() {
            setActive(btn);
            showAllSuitsForNumber(i);
        });
        minorGrid.appendChild(btn);
    }

    function setActive(clickedBtn) {
        document.querySelectorAll('.num-btn').forEach(b => b.classList.remove('active'));
        clickedBtn.classList.add('active');
    }

    function showMajor(index) {
        const card = tarotData.major[index];
        if (!card) return;
        const html = `
            <div class="card-header">
                <span class="card-number">${index === 0 ? '0' : index}</span>
                <span class="card-name">${card.name}</span>
                <span class="keyword">${card.keyword}</span>
            </div>
            <div class="meaning-box">${card.meaning}</div>
        `;
        infoPanel.innerHTML = html;
    }

    function showAllSuitsForNumber(num) {
        const cards = tarotData.minor.filter(card => card.number == num);
        
        if (cards.length === 0) {
            infoPanel.innerHTML = `<div style="padding:20px;text-align:center;">Няма данни за число ${num}</div>`;
            return;
        }

        // Подредба по боя
        cards.sort((a,b) => {
            const order = { wands:1, cups:2, swords:3, pentacles:4 };
            return order[a.suit] - order[b.suit];
        });

        let html = `
            <div class="card-header">
                <span class="card-number">${num}</span>
                <span class="keyword">${num==1?'Асо':num==11?'Паж':num==12?'Рицар':num==13?'Кралица':num==14?'Крал':num+' число'}</span>
            </div>
            <div class="sub-cards">
                <div class="sub-title">⚡ Четирите бои</div>
                <div class="minor-grid">
        `;

        cards.forEach(card => {
            let suitName = '';
            if (card.suit === 'wands') suitName = 'Жезли (Огън)';
            else if (card.suit === 'cups') suitName = 'Чаши (Вода)';
            else if (card.suit === 'swords') suitName = 'Мечове (Въздух)';
            else if (card.suit === 'pentacles') suitName = 'Пентакли (Земя)';

            html += `
                <div class="minor-item ${card.suit}">
                    <div class="minor-head">
                        <span class="minor-element">${suitName}</span>
                        <span class="minor-name">${card.name}</span>
                        <span style="background:#dac09a; border-radius:30px; padding:2px 10px;">${card.nick}</span>
                    </div>
                    <div class="minor-desc">${card.meaning}</div>
                </div>
            `;
        });

        html += `</div></div>`;
        infoPanel.innerHTML = html;
    }

    // Покажи Глупака при старт
    setTimeout(() => {
        const defaultBtn = document.querySelector('.num-btn.major[data-num="0"]');
        if (defaultBtn) {
            defaultBtn.classList.add('active');
            showMajor(0);
        }
    }, 50);
});
