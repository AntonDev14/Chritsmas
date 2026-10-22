document.addEventListener("DOMContentLoaded", () => {
    // --- 1. RELOJ REGRESIVO EN TIEMPO REAL ---
    const targetYear = 2026;
    const christmasTime = new Date(`December 25, ${targetYear} 00:00:00`).getTime();

    function runCountdown() {
        const rightNow = new Date().getTime();
        const gap = christmasTime - rightNow;

        if (gap <= 0) {
            const wrapper = document.querySelector('.countdown-wrapper');
            if (wrapper) wrapper.innerHTML = "<span class='time-val' style='font-size:2rem;'>🎄 ¡Feliz Navidad! 🎁</span>";
            return;
        }

        const d = Math.floor(gap / (1000 * 60 * 60 * 24));
        const h = Math.floor((gap % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const m = Math.floor((gap % (1000 * 60 * 60)) / (1000 * 60));
        const s = Math.floor((gap % (1000 * 60)) / 1000);

        const elD = document.getElementById('días');
        const elH = document.getElementById('horas');
        const elM = document.getElementById('minutos');
        const elS = document.getElementById('segundos');

        if (elD) elD.innerText = d.toString().padStart(2, '0');
        if (elH) elH.innerText = h.toString().padStart(2, '0');
        if (elM) elM.innerText = m.toString().padStart(2, '0');
        if (elS) elS.innerText = s.toString().padStart(2, '0');
    }
    setInterval(runCountdown, 1000);
    runCountdown();
    // --- 2. BITÁCORA DE FECHAS TEMÁTICAS ESPECIALES ---
    const today = new Date();
    const currentDay = today.getDate();
    const currentMonth = today.getMonth() + 1;

    const monthsNames = { 10: "Oct", 11: "Nov", 12: "Dic" };

        // --- NUEVO REGISTRO ACTUALIZADO EN EVENTREGISTRY ---
    const eventRegistry = {
        "31-10": { title: "🎉 ¡Inicio de Aniversario!", desc: "Comienza una semana de celebración de aniversario inolvidable." },
        "5-11": { title: "🎁 Sorpresa Mágica", desc: "¡Primer evento de noviembre desbloqueado! Código: NAVIDAD_PREMIUM" },
        "8-11": { title: "🎤 Amor Eterno — Homenaje al Divo", desc: "Un día para recordar con música y alma al gran Juan Gabriel. ¡Abraza la nostalgia!" },
        "16-11": { title: "🎩 ¡Bah! ¡Paparruchas! — Ebenezer Scrooge", desc: "¡El viejo Scrooge vigila este día! Que el espíritu de las Navidades Pasadas, Presentes y Futuras transforme tu día. ¡No seas un avaro!" },
        "23-11": { title: "🎂 ¡Feliz Cumpleaños Especial!", desc: "Hoy celebramos la vida de alguien muy importante. ¡Deseos llenos de magia!" },
        "28-11": { title: "🎉 ¡Un Cumpleaños para Festejar!", desc: "Globos, pastel y los mejores deseos navideños en este día tan especial." },
        "1-12": { title: "🎄 Puerta de Diciembre", desc: "¡Oficialmente entramos en el mes navideño!" },
        "25-12": { title: "✨ ¡Feliz Navidad!", desc: "Que la magia y el brillo de estas fiestas inunden tu hogar de felicidad.", specialAnim: true }
    };


    const todayLeafNum = document.getElementById('todayLeafNum');
    const todayLeafMonth = document.getElementById('todayLeafMonth');
    if(todayLeafNum && todayLeafMonth) {
        todayLeafNum.innerText = currentDay;
        todayLeafMonth.innerText = monthsNames[currentMonth] || "Oct";
    }

    const todayKey = `${currentDay}-${currentMonth}`;
    const todayLeafEl = document.getElementById('todayLeaf');
    if(todayLeafEl) {
        todayLeafEl.addEventListener("click", () => {
            if (eventRegistry[todayKey]) {
                showEvent(eventRegistry[todayKey].title, eventRegistry[todayKey].desc, eventRegistry[todayKey].specialAnim);
            } else {
                showEvent(`Día ${currentDay} de ${monthsNames[currentMonth] || 'Oct'}`, "Disfruta de este hermoso día y mantente atento a las próximas sorpresas.", false);
            }
        });
    }
    // --- 3. GENERADOR DE GRID DE ADVIENTO (DESBLOQUEADO PARA MODO PRUEBA) ---
    const fullTimeline = [];
    for (let d = 20; d <= 31; d++) fullTimeline.push({ day: d, month: 10, label: "Oct" });
    for (let d = 1; d <= 30; d++) fullTimeline.push({ day: d, month: 11, label: "Nov" });
    for (let d = 1; d <= 25; d++) fullTimeline.push({ day: d, month: 12, label: "Dic" });

    // Se fuerza la inclusión del día 25 para que puedas realizar pruebas en cualquier mes
    const activeTimeline = fullTimeline.filter(date => {
        if (date.day === 25 && date.month === 12) return true;
        if (date.month > currentMonth) return true;
        if (date.month === currentMonth && date.day >= currentDay) return true;
        return false;
    });

       const container = document.getElementById('calendarGrid');
    if(container) {
        activeTimeline.forEach(date => {
            const cell = document.createElement('div');
            cell.classList.add('calendar-cell');

            if ((date.month === 10 && date.day === 31) || (date.month === 11 && date.day >= 1 && date.day <= 7)) {
                cell.classList.add('anniversary-week');
            }
            if (date.day === currentDay && date.month === currentMonth) {
                cell.classList.add('is-today');
            }

            // 1. Declaramos la llave de la fecha
            const key = `${date.day}-${date.month}`;

            // 2. Evaluamos los días especiales para aplicar las clases de CSS
            if (key === "8-11") cell.classList.add('divo-day');
            if (key === "16-11") cell.classList.add('scrooge-day'); // ¡Aquí quedó perfecto!
            if (key === "23-11" || key === "28-11") cell.classList.add('birthday-day');
            if (key === "1-12") cell.classList.add('nutcracker-day');
            if (eventRegistry[key]) cell.classList.add('surprise-day');

            // 3. Asignamos el click para abrir el modal flotante
            cell.addEventListener("click", () => {
                if (eventRegistry[key]) {
                    showEvent(eventRegistry[key].title, eventRegistry[key].desc, eventRegistry[key].specialAnim);
                } else {
                    showEvent(`Día ${date.day} de ${date.label}`, "Continúa el conteo para la víspera navideña.", false);
                }
            });

            cell.innerHTML = `<span class="cell-num">${date.day}</span><span class="cell-month">${date.label}</span>`;
            container.appendChild(cell);
        });
    }

    // --- 4. MANEJO SEGURO DE INTERFAZ Y MODAL ---
    const toggleBtn = document.getElementById('toggleCalendarBtn');
    const calendarSection = document.getElementById('calendarSection');
    const overlay = document.getElementById('eventOverlay');
    const closeBtn = document.getElementById('closeModalBtn');
    const animArea = document.getElementById('christmasAnimationArea');

    if(toggleBtn && calendarSection) {
        toggleBtn.addEventListener("click", () => {
            if (calendarSection.classList.contains('hidden')) {
                calendarSection.classList.remove('hidden');
                toggleBtn.innerText = "Ocultar Calendario Completo ❄️";
                calendarSection.scrollIntoView({ behavior: 'smooth' });
            } else {
                calendarSection.classList.add('hidden');
                toggleBtn.innerText = "Ver Calendario Completo ✨";
            }
        });
    }

    function showEvent(title, description, isSpecial) {
        const mTitle = document.getElementById('modalTitle');
        const mDesc = document.getElementById('modalDesc');
        const mEmoji = document.getElementById('modalEmoji');
        
        if(mTitle && mDesc && overlay) {
            mTitle.innerText = title;
            mDesc.innerText = description;
            animArea.innerHTML = ""; 
            
            if (isSpecial) {
                mEmoji.style.display = "none";
                mTitle.style.display = "none";
                mDesc.style.display = "none";
                
                function tryLoadAnimation() {
                    if (typeof TweenMax !== "undefined" && typeof MorphSVGPlugin !== "undefined") {
                        initMerryChristmasSVG();
                    } else {
                        animArea.innerHTML = "<p style='color:var(--accent-gold); padding:20px; font-weight:600;'>✨ Sincronizando entorno mágico... Espera un segundo. ✨</p>";
                        setTimeout(tryLoadAnimation, 600);
                    }
                }
                tryLoadAnimation();
            } else {
                mEmoji.style.display = "block";
                mTitle.style.display = "block";
                mDesc.style.display = "block";
            }
            overlay.classList.add('visible');
        }
    }

    if(closeBtn && overlay) {
        closeBtn.addEventListener("click", () => {
            overlay.classList.remove('visible');
            animArea.innerHTML = ""; 
        });
    }
    // --- 5. COMPONENTE VECTORIAL COMPLETO ADAPTADO DE CHRIS GANNON ---
    function initMerryChristmasSVG() {
        animArea.innerHTML = `
            <svg class="mainSVG" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 600 600" style="width:100%; height:320px; display:block; visibility:visible; overflow:visible;">
                <ellipse id="dot" rx="0" ry="4" cx="300" cy="580" fill="#F3F1E2"/>
                <circle id="splashDot" r="0" cx="300" cy="300" fill="#F3F1E2"/>
                <circle opacity="0" id="splashRing" r="6" cx="300" cy="300" fill="none" stroke="#F3F1E2" stroke-width="12"/>
                <defs>
                    <circle id="circ" r="1"/>
                    <path id="star" d="M4.55 0l1.4 2.85 3.15.45-2.28 2.22.54 3.13-2.81-1.48-2.81 1.48.53-3.13L0 3.3l3.14-.45z"/>
                    <path id="cross" d="M4 3.5L2.5 2 4 .5 3.5 0 2 1.5.5 0 0 .5 1.5 2 0 3.5l.5.5L2 2.5 3.5 4z"/>
                    <path id="heart" d="M2.9 0c-.37 0-.7.18-.9.47C1.8.18 1.47 0 1.1 0 .49 0 0 .49 0 1.1 0 2.6 1.56 4 2 4s2-1.4 2-2.9C4 .49 3.51 0 2.9 0z"/>
                    <path id="flake1" d="M5 2.1l.46-.19-.08-.71.64-.3-.09-.7.41-.2.25.38-.42.56.4.58-.42.57.3.4.49.06.28-.65.71.06.28-.65.45.03.03.45-.65.28.06.71-.65.27.06.5.4.3.57-.42.58.4.56-.42.38.25-.2.41-.7-.09-.3.64-.71-.08L7.9 5l.19.46.71-.08.3.64.7-.09.2.41-.38.25-.56-.42-.58.4-.57-.42-.4.3-.06.49.65.28-.06.71.65.28-.03.45-.45.03-.28-.65-.71.06-.27-.65-.5.06-.3.4.42.57-.4.58.42.56-.25.38-.41-.2.09-.7-.64-.3.08-.71L5 7.9l-.46.19.08.71-.64.3.09.7-.41.2-.25-.38.42-.56-.4-.58.42-.57-.3-.4-.49-.06-.28.65-.71-.06-.28.65-.45-.03-.03-.45.65-.28-.06-.71.65-.27-.06-.5-.4-.3-.57.42-.58-.4-.56.42L0 6.34l.2-.41.7.09.3-.64.71.08L2.1 5l-.19-.46-.71.08-.3-.64-.7.09-.2-.41.38-.25.56.42.58-.4.57.42.4-.3.06-.49-.65-.28.06-.71-.65-.28.03-.45.45-.03.28.65.71-.06.27.65.5-.06.3-.4-.42-.57.4-.58-.42-.56.25-.38.41.2-.09.7.64.3-.07.73z"/>
                    <path id="flake2" d="M5 2.29l1.48-.08L6.36.17 7.5 0l.42 1.07-1.82.92.67 1.32.81 1.24 1.7-1.12.72.9-.72.9-1.7-1.12-.81 1.24-.67 1.32 1.82.92-.42 1.07-1.14-.17.12-2.04L5 6.38l-1.48.07.12 2.04-1.14.17-.42-1.07 1.82-.92-.67-1.32-.81-1.24-1.7 1.12-.72-.9.72-.9 1.7 1.12.81-1.24.67-1.32-1.82-.92L2.5 0l1.14.17-.04 2.12z"/>
                    <path id="flake3" d="M5 3.3l.51-.45-.06-.91.71-.57L6.1.46 6.55 0l.09.64-.58.69.23.88-.58.7'.15.67.68-.07.48-.76.91-.06.48-.77.64-.1-.3.57-.88.22-.33.84-.88.23-.27.63.58.34.85-.33.76.49.84-.34.58.29-.58.28-.84-.34-.76.49-.85-.33-.58.35.27.62.88.23.32.84.89.23.29.57-.63-.11-.48-.77-.91-.05L6.54 6l-.68-.06-.15.66.58.7-.23.88.58.7-.1.63-.44-.46.06-.9-.71-.58.06-.91L5 6.21l-.51.45.06.91-.71.57.06.91-.45.46-.09-.63.58-.7-.23-.88.58-.7-.15-.66-.68.06-.48.77-.91.05-.48.77-.64.1.3-.56.88-.23.33-.84.88-.23.27-.62-.58-.35-.85.33-.76-.49-.84.34L0 4.75l.58-.28.84.34.76-.49.85.33.58-.35-.27-.62-.88-.22-.32-.85-.89-.22-.29-.57.63.1.48.77.91.05 Ram-.48.77.68.07.15-.67-.58-.7.23-.88-.58-.69.1-.64.44.46-.06.91.71.57-.06.92z"/>
                    <mask id="merryMask"><rect class="merryMask" y="265" fill="#FFF" width="100%" height="60"/></mask>
                    <mask id="strokeMask1"/><mask id="strokeMask2"/><mask id="strokeMask3"/>
                </defs>
                <g mask="url(#strokeMask1)" stroke="#F3F1E2"><path id="springStroke1" fill="none" stroke-width="32" stroke-miterlimit="10" d="M295.79 306.05c4.88-40 59.64-50.35 89.11-30.94 28.87 19.02 36.98 66.23 9.7 92.82-28.82 28.09-95.93 25.53-125.28 12.41-45.16-20.19-64.58-75.02-50.54-113.88 24.37-67.46 78.03-82.94 124.6-85.46 81.7-4.41 135.04 48.72 138.78 52.04C533.59 278.71 540.15 305 553.67 340"/></g>
                <g mask="url(#strokeMask2)" stroke="#F3F1E2"><path id="springStroke2" fill="none" stroke-width="32" stroke-miterlimit="10" d="M301 299c-8.88-30.88-22.07-52.82-31.33-66-17.16-24.42-38.97-55.44-76-60.67-18.91-2.67-34.3 2.45-41.33 5.33-31.61 12.96-55.3 47.33-56.67 80-2.14 51.11 51.95 61.79 56.67 122.67.49 6.36 3.73 57.6-30.67 80-26.63 17.34-63.99 9.68-86-7.33C-8.02 419.23-2.38 340.44 33 297.67c44.67-54 125.35-28.28 158-12.67 89.2 42.67 161.66 21.25 242.67-8 55.39-20 122.28 9.4 156 34"/></g>
                <g mask="url(#strokeMask3)" stroke="#F3F1E2"><path id="springStroke3" fill="none" stroke-width="32" stroke-miterlimit="10" d="M467.82 270.07c93.65-33.69 90.62-162.02 89.85-169.4-.22-2.15-.86-8.25-4.67-10 0 0-3.04-1.4-8 1.33-9.43 5.19-9.23 122.41-7.33 222"/></g>
                <g id="merryGroup" fill="#F3F1E2">
                                        <path d="M206.37 301.15l-11.58-19.56c-.3-.48-.42-1.02-.42-1.56 0-1.62 1.32-3.12 3.06-3.12 1.08 0 2.16.54 2.7 1.5l9.36 16.44 9.36-16.44c.54-.96 1.62-1.5 2.7-1.5 1.62 0 3.06 1.38 3.06 3.12 0 .54-.12 1.08-.42 1.56l-11.58 19.56v15.9c0 1.74-1.38 3.12-3.12 3.12-1.74 0-3.12-1.38-3.12-3.12v-15.9z"/>
                    <path d="M243.15 292.46c0-9.3 6.24-15.54 15.48-15.54 3.24 0 6.36.96 9.24 2.82.9.6 1.44 1.56 1.44 2.58 0 1.62-1.38 2.94-3.12 2.94-.54 0-1.08-.18-1.62-.48-1.92-1.2-3.9-1.98-5.94-1.98-5.82 0-9.12 3.84-9.12 9.66v12.18c0 5.82 3.3 9.66 9.12 9.66 2.04 0 3.96-.84 5.88-2.04.54-.36 1.14-.54 1.74-.54 1.62 0 3.06 1.26 3.06 3 0 1.02-.54 2.04-1.44 2.64-2.88 1.86-6 2.82-9.24 2.82-9.24 0-15.48-6.24-15.48-15.54v-12.18z"/>
                    <path d="M296.97 300.79h-15.6v16.2c0 1.74-1.44 3.18-3.12 3.18-1.74 0-3.24-1.44-3.24-3.18v-36.9c0-1.74 1.44-3.18 3.18-3.18 1.68 0 3.18 1.44 3.18 3.18v14.64h15.6V280.1c0-1.74 1.44-3.18 3.18-3.18 1.74 0 3.18 1.44 3.18 3.18V317c0 1.74-1.38 3.18-3.12 3.18-1.74 0-3.24-1.44-3.24-3.18v-16.21z"/>
                    <path d="M323.25 301.94h-5.4v15.12c0 1.74-1.5 3.12-3.18 3.12-1.74 0-3.18-1.38-3.18-3.12v-35.7c0-2.1 1.74-3.84 3.9-3.84h11.16c3.54 0 6.6 1.14 8.82 3.36 2.28 2.28 3.48 5.4 3.48 9 0 3.6-1.2 6.66-3.42 8.82-1.44 1.38-3.18 2.28-5.22 2.82l8.34 13.98c.3.48.48 1.08.48 1.62 0 1.56-1.44 3.06-3.12 3.06-1.08 0-2.1-.54-2.64-1.5l-10.02-16.74zm3.3-6.06c2.76 0 5.94-1.14 5.94-6 0-3.6-2.1-6.3-5.94-6.3h-8.7v12.3h8.7z"/>
                    <path d="M344.73 280.1c0-1.74 1.44-3.18 3.18-3.18 1.68 0 3.18 1.44 3.18 3.18V317c0 1.74-1.5 3.18-3.18 3.18-1.74 0-3.18-1.44-3.18-3.18v-36.9z"/>
                    <path d="M364.59 298.75c-4.68-2.04-7.08-5.7-7.08-10.38 0-7.14 6.72-11.46 13.56-11.46 3.3 0 6.78.6 9.9 1.98 1.26.54 2.34 1.38 2.34 3.06 0 1.56-1.32 2.88-3 2.88-.36 0-.72-.06-1.14-.24-1.44-.54-3.54-1.8-8.4-1.8-2.94 0; -6.84 1.2-6.84 5.28 0 2.82 1.38 4.08 3.78 5.16l6.84 3c4.56 1.98 8.88 4.8 8.88 11.22 0 7.26-5.22 12.72-13.32 12.72-3.54 0-7.62-.96-10.74-2.28-1.14-.48-1.86-1.5-1.86-2.82 0-1.68 1.08-3.06 2.88-3.06.78 0 1.38.18 1.92.42 2.46 1.08 4.98 1.86 7.8 1.86 4.32 0 6.9-2.1 6.9-6.06 0-3-2.52-5.1-5.22-6.3l-7.2-3.18z"/>
                    <path d="M397.59 283.58h-8.88c-1.74 0-3.06-1.32-3.06-3 0-1.74 1.32-3.06 3.06-3.06h24.06c1.74 0 3.12 1.32 3.12 3.06 0 1.68-1.38 3-3.12 3h-8.82V317c0 1.74-1.44 3.18-3.18 3.18-1.74 0-3.18-1.44-3.18-3.18v-33.42z"/>
                    <path d="M450.21 290.78l-9 16.32c-.6 1.08-1.8 1.8-3.06 1.8-1.32 0-2.46-.72-3.06-1.8l-9-16.32V317c0 1.74-1.5 3.18-3.18 3.18-1.74 0-3.18-1.44-3.18-3.18v-36.6c0-1.92 1.62-3.48 3.48-3.48 1.38 0 2.52.78 3.12 1.86l11.82 21.12 11.82-21.12c.6-1.08 1.86-1.86 3.12-1.86 1.92 0 3.48 1.56 3.48 3.48V317c0 1.74-1.5 3.18-3.24 3.18-1.68 0-3.12-1.44-3.12-3.18v-26.22z"/>
                    <path d="M485.55 309.01h-14.76l-3.3 9.12c-.48 1.26-1.62 2.04-2.94 2.04-1.62 0-3.06-1.38-3.06-3.12 0-.36.06-.66.18-1.02l13.2-36.84c.48-1.26 1.8-2.28 3.3-2.28 1.38 0 2.82.96 3.3 2.34l13.2 36.78c.12.3.18.72.18 1.02 0 1.62-1.32 3.12-3.12 3.12-1.26 0-2.46-.78-2.94-2.04l-3.24-9.12zm-7.38-20.57l-5.22 14.52h10.44l-5.22-14.52z"/>
                    <path d="M505.41 298.75c-4.68-2.04-7.08-5.7-7.08-10.38 0-7.14 6.72-11.46 13.56-11.46 3.3 0 6.78.6 9.9 1.98 1.26.54 2.34 1.38 2.34 3.06 0 1.56-1.32 2.88-3 2.88-.36 0-.72-.06-1.14-.24-1.44-.54-3.54-1.8-8.4-1.8-2.94 0; -6.84 1.2-6.84 5.28 0 2.82 1.38 4.08 3.78 5.16l6.84 3c4.56 1.98 8.88 4.8 8.88 11.22 0 7.26-5.22 12.72-13.32 12.72-3.54 0-7.62-.96-10.74-2.28-1.14-.48-1.86-1.5-1.86-2.82 0-1.68 1.08-3.06 2.88-3.06.78 0 1.38.18 1.92.42 2.46 1.08 4.98 1.86 7.8 1.86 4.32 0 6.9-2.1 6.9-6.06 0-3-2.52-5.1-5.22-6.3l-7.2-3.18z"/>
                </g>
                <g id="particleContainer"/>
                <g id="letterI">
                    <path fill="#F3F1E2" d="M533.19 316.27c0-2.16 1.74-3.9 3.9-3.9 2.1 0 3.84 1.74 3.84 3.9s-1.74 3.9-3.84 3.9c-2.16 0-3.9-1.74-3.9-3.9zm.78-36.23c0-1.74 1.38-3.12 3.12-3.12 1.68 0 3.06 1.38 3.06 3.12v23.76c0 1.68-1.38 3.06-3.06 3.06-1.74 0-3.12-1.38-3.12-3.06v-23.76z"/>
                    <use class="endFlake" fill="#F3F1E2" xlink:href="#flake2" x="532" y="313"/>
                    <use class="endFlake" fill="#F3F1E2" xlink:href="#flake3" x="532" y="313"/>
                    <use class="endFlake" fill="#F3F1E2" xlink:href="#flake3" x="532" y="313"/>
                </g>
            </svg>
        `;

        // Lanzamiento inmediato del bloque de Chris Gannon cargado por ti
        (function(){
            function f(a,b,d,f){for(var g=h=0;g<a;g++){var c=document.createElementNS("http://w3.org","rect");isFirefox?mainSVG.appendChild(c):b.appendChild(c);g>h*p&&h++;c.setAttributeNS(null,"fill",maskValueArr[h]);c.setAttributeNS(null,"width",16);c.setAttributeNS(null,"rx",16);c.setAttributeNS(null,"ry",16);c.setAttributeNS(null,"height",16);TweenMax.set(c,{transformOrigin:"50% 50%",scaleY:1-g/100});var e=new TimelineMax;e.to(c,1.52,{bezier:{type:"cubic",values:d,autoRotate:!0},ease:Linear.easeNone}).to(c,.1,{alpha:0},"-=0.1");f.add(e,g/200);isFirefox&&b.appendChild(c)}}
            function d(a,b){return Math.floor(Math.random()*(b-a+1)+a)}
            select=function(a){return document.querySelector(a)};
            selectAll=function(a){return document.querySelectorAll(a)};
            mainSVG=select(".mainSVG");
            merryGroup=select("#merryGroup");
            springStroke1=select("#springStroke1");
            springStroke2=select("#springStroke2");
            springStroke3=select("#springStroke3");
            particleContainer=select("#particleContainer");
            strokeMask1=select("#strokeMask1");
            strokeMask2=select("#strokeMask2");
            strokeMask3=select("#strokeMask3");
            allTextMasks=selectAll(".textMask *");
            maskValueArr="#111 #222 #333 #444 #555 #666 #777 #888 #999 #aaa #bbb #ccc #ddd #eee #FFF".split(" ").reverse();
            particleColorArray=["#F3F1E2"];
            particleTypeArray=["#flake1","#flake2","#flake3","#star","#heart"];
            particlePool=[];
            particleCount=0;
            numParticles=512;
            isFirefox=-1<navigator.userAgent.toLowerCase().indexOf("firefox");
            TweenMax.set(particleContainer,{x:0,y:0});
            var k=new TimelineMax({paused:!0}),l=new TimelineMax({paused:!0}),m=new TimelineMax({paused:!0}),h,p=Math.round(100/maskValueArr.length),
            q=MorphSVGPlugin.pathDataToBezier(springStroke1.getAttribute("d"),{offsetX:-8,offsetY:-8}),
            n=MorphSVGPlugin.pathDataToBezier(springStroke2.getAttribute("d"),{offsetX:-8,offsetY:-8}),
            r=MorphSVGPlugin.pathDataToBezier(springStroke3.getAttribute("d"),{offsetX:-8,offsetY:-8}),
            e=new TimelineMax({repeat:-1,paused:!0});
            e.to("#dot",.4,{attr:{cy:200,rx:12,ry:12},ease:Power2.easeOut}).to("#dot",.3,{attr:{cy:300},ease:Power2.easeIn}).set("#splashRing",{alpha:1}).to("#dot",1.2,{attr:{rx:76,ry:76},alpha:0,ease:Power1.easeOut}).to("#splashRing",1.2,{attr:{r:50},strokeWidth:0,ease:Power1.easeOut},"-=1.2").to(k,3,{time:2.33,ease:Power2.easeOut},"-=1.2").to(l,3.9,{time:2.33,ease:Power2.easeOut},"-=2.9").staggerFrom("#merryGroup path",.9,{rotation:-95,alpha:0,transformOrigin:"50% 150%",ease:Elastic.easeOut.config(2,.8)},.036,"-=3.3").to(m,1,{time:2.1,ease:SlowMo.ease.config(.1,.86,!1)},"-=2.9").to(particleContainer,1.4,{bezier:{type:"cubic",values:n,autoRotate:!1},onUpdate:function(a){a=particlePool[particleCount];TweenMax.set(a,{x:particleContainer._gsTransform.x,y:particleContainer._gsTransform.y,scale:d(1,15)/10,transformOrigin:"50% 50%"});(new TimelineMax).to(a,d(3,6),{physics2D:{velocity:d(5,10),angle:0,gravity:d(23,577)},scale:0,rotation:d(180,780),onStart:function(a){TweenMax.killTweensOf(a,{opacity:!0});TweenMax.fromTo(a,.7,{alpha:1},{alpha:Math.random(),ease:RoughEase.ease.config({template:Power0.easeNone,strength:3,points:6,taper:"both",randomize:!0,clamp:!1}),repeat:-1})},onStartParams:[a]});particleCount++;particleCount=particleCount>=numParticles?0:particleCount},ease:Linear.easeNone},"-=4").from("#letterI",.76,{y:-200,alpha:0,ease:Power4.easeIn},"-=2.7").from("#letterI",1,{rotation:23,transformOrigin:"50% 100%",ease:Elastic.easeOut.config(1,.3)},"-=2.2").staggerTo(selectAll(".endFlake"),.6,{cycle:{x:[-10,0,10],y:[200,100,300],transformOrigin:["50% 50%","50% 150%"]},alpha:0,rotation:d(200,360),ease:SlowMo.ease.config(.1,.4,!1)},.02,"-=1.95").staggerTo("#merryGroup *",.6,{alpha:0},.05).to("#letterI",.6,{alpha:0},"-=0.6");
            (function(){for(var a=numParticles,b;-1<--a;)b=document.createElementNS("http://w3.org","use"),b.setAttributeNS("http://w3.org","xlink:href",particleTypeArray[a%particleTypeArray.length]),mainSVG.appendChild(b),b.setAttributeNS(null,"fill",particleColorArray[a%particleColorArray.length]),b.setAttributeNS(null,"opacity",0),b.setAttribute("class","particle"),particlePool.push(b)})();
            f(100,strokeMask1,q,k);f(100,strokeMask2,n,l);f(100,strokeMask3,r,m);e.timeScale(.8);TweenMax.delayedCall(0,function(){e.play()})
        })();
    }
});
