document.addEventListener('DOMContentLoaded', () => {
    const cover = document.getElementById('cover');
    const accordion = document.getElementById('accordion');
    const cdDisc = document.getElementById('cd-disc');
    
    const btnToggleCover = document.getElementById('btn-toggle-cover');
    const btnFlipCover = document.getElementById('btn-flip-cover');
    const btnTogglePullout = document.getElementById('btn-toggle-pullout');
    const btnUnfoldBooklet = document.getElementById('btn-unfold-booklet');
    const btnToggleLabels = document.getElementById('btn-toggle-labels');
    
    let isCoverOpen = false;
    let isFlipped = false;
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
            
            // Jeśli była odwrócona, resetujemy kąt przy otwieraniu
            if (isFlipped) {
                isFlipped = false;
                currentRotY -= 180;
                album.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
            }
            updateScale();
        }
    };

    const doCloseCover = () => {
        album.classList.remove('is-open');
        cover.classList.remove('is-open');
        isCoverOpen = false;
        btnTogglePullout.disabled = true;
        btnUnfoldBooklet.disabled = true;
        updateScale();
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
        updateScale();
    };

    // Event Listeners
    cover.addEventListener('click', (e) => {
        // Kliknięcie w okładkę otwiera ją (jeśli kliknięto z przodu okładki)
        if (!isCoverOpen) {
            toggleCover();
        }
    });

    btnToggleCover.addEventListener('click', toggleCover);
    
    btnFlipCover.addEventListener('click', () => {
        if (!isCoverOpen) {
            isFlipped = !isFlipped;
            currentRotY += 180;
            album.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        }
    });

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
            wordEl.style.fontWeight = '600';
            wordEl.style.opacity = '0.3'; // Zwiększona widoczność
            wordEl.style.color = '#ffffff';
            wordEl.style.textTransform = 'uppercase';
            wordEl.style.lineHeight = '1.5';
            wordEl.style.whiteSpace = 'nowrap';
            wordEl.style.letterSpacing = '0.1em';
            
            // Wszystko na tym samym poziomie za ciupagą (brak wybijania z-index, ma być równe tło)
            wordEl.style.position = 'relative';
            wordEl.style.zIndex = 5;

            typoBg.appendChild(wordEl);
        }
    };

    // Inicjalizacja tła po załadowaniu
    generateTypoBackground();

    // 4. Skalowanie na mobile
    const scene = document.querySelector('.scene');
    const updateScale = () => {
        let scale = 1;
        if (window.innerWidth <= 768) {
            if (isBookletUnfolded) scale = 0.25;
            else if (isCoverOpen) scale = 0.45;
            else scale = 0.55;
        } else {
            if (isBookletUnfolded) scale = 0.5;
            else if (isCoverOpen) scale = 0.8;
            else scale = 1;
        }
        scene.style.transform = `scale(${scale})`;
    };
    window.addEventListener('resize', updateScale);
    updateScale(); // Inicjalizacja

    // 5. Obracanie okładki myszką i dotykiem (Drag to Rotate)
    const album = document.getElementById('album');
    let isDragging = false;
    let startX, startY;
    let currentRotX = 15;
    let currentRotY = -10;

    const startDrag = (e) => {
        if (e.target.tagName === 'BUTTON' || e.target.closest('button')) return;
        isDragging = true;
        startX = e.touches ? e.touches[0].clientX : e.clientX;
        startY = e.touches ? e.touches[0].clientY : e.clientY;
        document.body.style.cursor = 'grabbing';
    };

    const moveDrag = (e) => {
        if (!isDragging) return;
        const clientX = e.touches ? e.touches[0].clientX : e.clientX;
        const clientY = e.touches ? e.touches[0].clientY : e.clientY;
        
        const deltaX = clientX - startX;
        const deltaY = clientY - startY;
        
        currentRotY += deltaX * 0.4;
        currentRotX -= deltaY * 0.4;
        
        // Ograniczenie obrotu góra/dół, żeby się nie przewróciło do góry nogami
        currentRotX = Math.max(-60, Math.min(60, currentRotX));

        album.style.transform = `rotateX(${currentRotX}deg) rotateY(${currentRotY}deg)`;
        
        startX = clientX;
        startY = clientY;
    };

    const endDrag = () => {
        isDragging = false;
        document.body.style.cursor = 'default';
    };

    document.addEventListener('mousedown', startDrag);
    document.addEventListener('touchstart', startDrag, {passive: true});
    document.addEventListener('mousemove', moveDrag);
    document.addEventListener('touchmove', moveDrag, {passive: true});
    document.addEventListener('mouseup', endDrag);
    document.addEventListener('touchend', endDrag);

    // 6. Lightbox (Galeria)
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const btnCloseLightbox = document.getElementById('lightbox-close');
    const btnPrevLightbox = document.getElementById('lightbox-prev');
    const btnNextLightbox = document.getElementById('lightbox-next');
    
    const galleryImages = [
        'images/acc_1_front.jpg',
        'images/acc_2_front.jpg',
        'images/acc_3_front.jpg',
        'images/acc_4_front.jpg',
        'images/acc_4_back.jpg',
        'images/acc_3_back.jpg',
        'images/acc_2_back.jpg',
        'images/acc_1_back.jpg'
    ];
    let currentImageIndex = 0;

    const openLightbox = (index) => {
        currentImageIndex = index;
        lightboxImg.src = galleryImages[currentImageIndex];
        lightbox.classList.add('is-active');
    };

    const closeLightbox = () => {
        lightbox.classList.remove('is-active');
    };

    const showPrev = (e) => {
        if (e) e.stopPropagation();
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
    };

    const showNext = (e) => {
        if (e) e.stopPropagation();
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        lightboxImg.src = galleryImages[currentImageIndex];
    };

    btnCloseLightbox.addEventListener('click', closeLightbox);
    btnPrevLightbox.addEventListener('click', showPrev);
    btnNextLightbox.addEventListener('click', showNext);
    
    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox) closeLightbox();
    });

    const accImages = document.querySelectorAll('.acc-front img, .acc-back img');
    accImages.forEach(img => {
        img.style.cursor = 'zoom-in';
        img.addEventListener('click', (e) => {
            const srcFilename = img.getAttribute('src');
            const idx = galleryImages.indexOf(srcFilename);
            if (idx !== -1) {
                openLightbox(idx);
            }
        });
    });
});
