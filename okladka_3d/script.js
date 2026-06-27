document.addEventListener('DOMContentLoaded', () => {
    const cover = document.getElementById('cover');
    const accordion = document.getElementById('accordion');
    const cdDisc = document.getElementById('cd-disc');
    
    const btnToggleCover = document.getElementById('btn-toggle-cover');
    const btnTogglePullout = document.getElementById('btn-toggle-pullout');
    const btnUnfoldBooklet = document.getElementById('btn-unfold-booklet');
    const btnToggleLabels = document.getElementById('btn-toggle-labels');
    
    let isCoverOpen = false;
    let isCdPulledOut = false;
    let isBookletUnfolded = false;
    let areLabelsHidden = true;

    // Domyślnie ukryte etykiety
    document.body.classList.add('hide-labels');
    btnToggleLabels.textContent = '4. Pokaż Etykiety';

    // 1. Otwieranie / Zamykanie okładki
    const toggleCover = () => {
        if (isCoverOpen) {
            // Zamykanie okładki
            if (isBookletUnfolded) toggleUnfold(false);
            if (isCdPulledOut) togglePullOut(false);
            
            setTimeout(() => doCloseCover(), isBookletUnfolded || isCdPulledOut ? 800 : 0);
        } else {
            // Otwieranie okładki
            album.classList.add('is-open');
            cover.classList.add('is-open');
            isCoverOpen = true;
            btnTogglePullout.disabled = false;
            btnUnfoldBooklet.disabled = false;
        }
    };

    const doCloseCover = () => {
        album.classList.remove('is-open');
        cover.classList.remove('is-open');
        isCoverOpen = false;
        btnTogglePullout.disabled = true;
        btnUnfoldBooklet.disabled = true;
    };

    // 2. Wysuwanie / Wsuwanie płyty
    const togglePullOut = (forceState) => {
        const newState = forceState !== undefined ? forceState : !isCdPulledOut;
        
        if (!newState) {
            // Wsuwanie
            cdDisc.classList.remove('is-pulled-out');
            isCdPulledOut = false;
        } else {
            // Wysuwanie
            cdDisc.classList.add('is-pulled-out');
            isCdPulledOut = true;
        }
    };

    // 3. Rozkładanie / Składanie harmonijki
    const toggleUnfold = (forceState) => {
        const newState = forceState !== undefined ? forceState : !isBookletUnfolded;
        
        if (newState) {
            accordion.classList.add('is-unfolded');
            isBookletUnfolded = true;
        } else {
            accordion.classList.remove('is-unfolded');
            isBookletUnfolded = false;
        }
    };

    // Event Listeners
    cover.addEventListener('click', (e) => {
        // Kliknięcie w okładkę otwiera ją (jeśli kliknięto z przodu okładki)
        if (!isCoverOpen) {
            toggleCover();
        }
    });

    btnToggleCover.addEventListener('click', toggleCover);
    btnTogglePullout.addEventListener('click', () => togglePullOut());
    btnUnfoldBooklet.addEventListener('click', () => toggleUnfold());
    
    // Ukrywanie/pokazywanie etykiet
    btnToggleLabels.addEventListener('click', () => {
        areLabelsHidden = !areLabelsHidden;
        if (areLabelsHidden) {
            document.body.classList.add('hide-labels');
            btnToggleLabels.textContent = '4. Pokaż Etykiety';
        } else {
            document.body.classList.remove('hide-labels');
            btnToggleLabels.textContent = '4. Ukryj Etykiety';
        }
    });

    // --- GENEROWANIE TŁA TYPOGRAFICZNEGO ---
    const generateTypoBackground = () => {
        const typoBg = document.getElementById('typo-bg');
        if (!typoBg) return;

        const words = [
            'góralskie', 'lubelskie', 'krakowiak', 'kujawiak', 'oberek', 
            'polonez', 'mazur', 'łowickie', 'rzeszowskie', 'kaszubskie',
            'kurpiowskie', 'sieradzkie', 'opoczyńskie', 'śląskie', 'wielkopolskie'
        ];

        // Czyścimy poprzednią zawartość jeśli istnieje
        typoBg.innerHTML = '';
        
        // Zmieniamy styl kontenera na flex/wrap by tworzył jednolity "mur" tekstu
        typoBg.style.display = 'flex';
        typoBg.style.flexWrap = 'wrap';
        typoBg.style.alignContent = 'flex-start';
        typoBg.style.overflow = 'hidden';
        typoBg.style.padding = '2%'; // Mniejszy padding dla większej gęstości

        // Generujemy ogromną ilość słów, aby całkowicie wypełnić tło
        const wordsCount = 500; 

        for (let i = 0; i < wordsCount; i++) {
            const wordEl = document.createElement('span');
            
            wordEl.textContent = words[Math.floor(Math.random() * words.length)] + '\u00A0\u00A0'; 
            
            // JEDNOLITY STYL: wszystko małe, takie samo, bardzo gęste
            wordEl.style.fontSize = '0.5rem';
            wordEl.style.fontWeight = '400';
            wordEl.style.opacity = '0.08';
            wordEl.style.color = '#ffffff';
            wordEl.style.textTransform = 'uppercase';
            wordEl.style.lineHeight = '1.5';
            wordEl.style.whiteSpace = 'nowrap';
            wordEl.style.mixBlendMode = 'overlay';
            wordEl.style.letterSpacing = '0.1em';
            
            // Wszystko na tym samym poziomie za ciupagą (brak wybijania z-index, ma być równe tło)
            wordEl.style.position = 'relative';
            wordEl.style.zIndex = 5;

            typoBg.appendChild(wordEl);
        }
    };

    // Inicjalizacja tła po załadowaniu
    generateTypoBackground();

    // 4. Obracanie okładki myszką (Drag to Rotate)
    const album = document.getElementById('album');
    let isDragging = false;
    let startX, startY;
    let currentRotX = 15;
    let currentRotY = -10;

    document.addEventListener('mousedown', (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        isDragging = true;
        startX = e.clientX;
        startY = e.clientY;
        document.body.style.cursor = 'grabbing';
    });

    document.addEventListener('mousemove', (e) => {
        if (!isDragging) return;
        const deltaX = e.clientX - startX;
        const deltaY = e.clientY - startY;
        
        currentRotY += deltaX * 0.4;
        currentRotX -= deltaY * 0.4;
        
        // Ograniczenie obrotu góra/dół, żeby się nie przewróciło do góry nogami
        currentRotX = Math.max(-60, Math.min(60, currentRotX));

        album.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        
        startX = e.clientX;
        startY = e.clientY;
    });

    document.addEventListener('mouseup', () => {
        isDragging = false;
        document.body.style.cursor = 'default';
    });
});
