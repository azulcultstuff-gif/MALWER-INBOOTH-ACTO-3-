/**
 * ==========================================================================
 * M-WER | ACTO III - CONTROLADOR LÓGICO DE INTERACCIÓN Y NARRATIVA
 * ==========================================================================
 */

let ambientTrack, glitchSFX, partyTrack;
let currentVolumeLevel = 0.4;

function initAudioSystem() {
    if (!glitchSFX) {
        glitchSFX = new Audio('assets/audio/glitch_effect.mp3');
        
        ambientTrack = new Audio('assets/audio/ambient_loop.mp3');
        ambientTrack.loop = true;
        ambientTrack.volume = currentVolumeLevel * 0.4;

        partyTrack = new Audio('assets/audio/party_rabteu.mp3');
        partyTrack.loop = true;
        partyTrack.volume = 0; // Inicia silenciado para el fade progresivo

        const volSlider = document.getElementById('master-vol-slider');
        const volDisplay = document.getElementById('vol-display');
        
        volSlider.addEventListener('input', (e) => {
            currentVolumeLevel = parseFloat(e.target.value);
            if (ambientTrack) ambientTrack.volume = currentVolumeLevel * 0.4;
            if (partyTrack && !partyTrack.paused) {
                // Si el track de fiesta está activo, responde directamente al slider escalado
                partyTrack.volume = currentVolumeLevel * 0.8;
            }
            volDisplay.innerText = Math.round(currentVolumeLevel * 100) + "%";
        });
    }
}

function triggerAudioGlitch() {
    if (glitchSFX) {
        glitchSFX.currentTime = 0;
        glitchSFX.volume = 0.2;
        glitchSFX.play().catch(() => {});
    }
}

window.onload = () => {
    if (typeof initThreeEngine === "function") {
        initThreeEngine();
    }
    
    const startBtn = document.getElementById('main-start-btn');
    const introScreen = document.getElementById('screen-intro');
    const startScreen = document.getElementById('screen-start');
    const canvasContainer = document.getElementById('canvas-container');
    
    introScreen.style.display = 'flex';
    introScreen.style.opacity = '1';
    startScreen.style.display = 'none';
    startScreen.style.opacity = '0';
    if (canvasContainer) canvasContainer.style.opacity = '0';

    gsap.to("#main-logo-intro", { 
        opacity: 1, 
        duration: 1.5, 
        ease: "power2.inOut",
        onComplete: () => {
            setTimeout(() => {
                gsap.to("#main-logo-intro", { 
                    opacity: 0, 
                    duration: 0.8, 
                    ease: "power2.inOut",
                    onComplete: () => {
                        introScreen.style.display = 'none';
                        startScreen.style.display = 'flex';
                        
                        gsap.to(startScreen, { opacity: 1, duration: 0.6, ease: "power2.out" });
                        if (canvasContainer) {
                            gsap.to(canvasContainer, { opacity: 1, duration: 1.2, ease: "power2.out" });
                        }

                        gsap.fromTo(startBtn, 
                            { opacity: 0, scale: 0.95 },
                            { 
                                opacity: 1, 
                                scale: 1, 
                                duration: 0.6, 
                                ease: "power2.out",
                                onComplete: () => {
                                    startBtn.style.pointerEvents = "auto";
                                }
                            }
                        );
                    }
                });
            }, 2000);
        }
    });
};

function startActo3() {
    initAudioSystem();
    if (ambientTrack) ambientTrack.play().catch(() => {});

    gsap.to('#screen-start', {
        opacity: 0,
        duration: 0.8,
        onComplete: () => {
            document.getElementById('screen-start').style.display = 'none';
            
            const bootScreen = document.getElementById('screen-device-boot');
            bootScreen.style.display = 'flex';
            bootScreen.style.opacity = '1';
            
            const statusText = document.getElementById('boot-status-text');
            const progressFill = document.getElementById('boot-progress-fill');
            
            setTimeout(() => { if(statusText) statusText.innerText = "LOADING CORRUPTION PROTOCOLS..."; }, 800);
            setTimeout(() => { if(statusText) statusText.innerText = "LINKING IN-BOOTH INTERFACE..."; }, 1800);

            gsap.to(progressFill, {
                width: '100%',
                duration: 2.8,
                ease: 'power1.inOut',
                onComplete: () => {
                    gsap.to(bootScreen, {
                        opacity: 0,
                        duration: 0.5,
                        onComplete: () => {
                            bootScreen.style.display = 'none';
                            
                            const screenMobile = document.getElementById('screen-mobile');
                            screenMobile.classList.add('active');
                            screenMobile.style.display = 'flex';
                            gsap.fromTo(screenMobile, { opacity: 0 }, { opacity: 1, duration: 0.6 });
                            runSystemClock();
                        }
                    });
                }
            });
        }
    });
}

function switchView(targetId) {
    const currentActive = document.querySelector('.mobile-view.active');
    const targetView = document.getElementById(targetId);
    
    if (currentActive) {
        gsap.to(currentActive, { 
            opacity: 0, 
            scale: 0.96, 
            duration: 0.3, 
            ease: "power2.in",
            onComplete: () => {
                currentActive.classList.remove('active');
                deployNextView();
            }
        });
    } else {
        deployNextView();
    }

    function deployNextView() {
        targetView.classList.add('active');
        gsap.fromTo(targetView, 
            { opacity: 0, scale: 1.04 }, 
            { opacity: 1, scale: 1, duration: 0.4, ease: "power2.out" }
        );
    }
}

async function openNarration() {
    switchView('view-narration-panel');
    const textContainer = document.getElementById('narration-text');
    const titleContainer = document.getElementById('narration-title');
    
    const bloquesTexto = [
        "Estableciendo conexión por frecuencias alternas...",
        "Logré infiltrarme con éxito dentro de las líneas de la colonia.",
        "Esto significa que las cosas se pondrán más complejas a partir de ahora.",
        "Como era de esperarse, ellos te asignarán una tarea obligatoria.",
        "Tómalo como una prueba de confianza indispensable para asegurar tu permanencia.",
        "Mantén la calma y ejecuta las instrucciones. Que tengas mucha suerte."
    ];

    for (let i = 0; i < bloquesTexto.length; i++) {
        textContainer.textContent = "";
        triggerAudioGlitch();
        
        if (i === 0) {
            if (titleContainer) {
                titleContainer.innerText = "ANUNCIO DEL DISPOSITIVO";
                titleContainer.style.color = "var(--cyber-purple)";
                titleContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.5)";
            }
            textContainer.style.color = "var(--cyber-purple)";
            textContainer.style.fontStyle = "italic";
            textContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.4)";
        } else if (i === bloquesTexto.length - 1) {
            if (titleContainer) {
                titleContainer.innerText = "TRANSMISIÓN CRÍTICA";
                titleContainer.style.color = "var(--cyber-purple)";
                titleContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.5)";
            }
            textContainer.style.color = "var(--cyber-purple)"; 
            textContainer.style.fontStyle = "italic";          
            textContainer.style.textShadow = "0 0 10px rgba(189, 0, 255, 0.4)"; 
        } else {
            if (titleContainer) {
                titleContainer.innerText = "AGENTE R-BTU";
                titleContainer.style.color = "var(--neon-green)";
                titleContainer.style.textShadow = "0 0 8px rgba(0, 255, 102, 0.3)";
            }
            textContainer.style.color = ""; 
            textContainer.style.fontStyle = "";
            textContainer.style.textShadow = "";
        }
        
        for (let char of bloquesTexto[i]) {
            textContainer.textContent += char;
            await new Promise(resolve => setTimeout(resolve, 45));
        }
        
        if (i < bloquesTexto.length - 1) {
            await new Promise(resolve => setTimeout(resolve, 3200));
        }
    }
    
    const nextBtn = document.getElementById('btn-next-narration');
    nextBtn.style.display = "inline-block";
    gsap.fromTo(nextBtn, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.3 });
}

function goToColoniaWelcome() {
    triggerAudioGlitch();
    switchView('view-colonia-welcome');
}

function showMisionPopup() {
    triggerAudioGlitch();
    const popup = document.getElementById('popup-mision');
    popup.classList.remove('hidden');
    gsap.fromTo(popup, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3, ease: "power2.out" });
}

function goToAcertijo() {
    triggerAudioGlitch();
    const popup = document.getElementById('popup-mision');
    popup.classList.add('hidden');
    switchView('view-acertijo');
    initAcertijo();
}

/**
 * LÓGICA DEL ACERTIJO (MINIJUEGO DE MEMORIA - PAREJAS DE COLORES)
 */
let acertijoColores = ['#00ff66', '#bd00ff', '#ff0055', '#00e1ff', '#ffff00', '#00ff66', '#bd00ff', '#ff0055', '#00e1ff', '#ffff00'];
let cartasSeleccionadas = [];
let parejasEncontradas = 0;
let bloqueandoTablero = false;

function initAcertijo() {
    cartasSeleccionadas = [];
    parejasEncontradas = 0;
    bloqueandoTablero = false;
    document.getElementById('btn-next-acertijo').style.display = "none";
    
    for (let i = acertijoColores.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [acertijoColores[i], acertijoColores[j]] = [acertijoColores[j], acertijoColores[i]];
    }

    const grid = document.getElementById('grid-acertijo');
    grid.innerHTML = "";

    for (let i = 0; i < 10; i++) {
        const btn = document.createElement('button');
        btn.classList.add('btn-nodo-acertijo');
        btn.dataset.index = i;
        btn.dataset.color = acertijoColores[i];
        btn.onclick = () => selectCard(btn);
        grid.appendChild(btn);
    }
}

function selectCard(btn) {
    if (bloqueandoTablero) return;
    if (btn.classList.contains('matched')) return;
    if (cartasSeleccionadas.length > 0 && cartasSeleccionadas[0].dataset.index === btn.dataset.index) return;

    triggerAudioGlitch();
    btn.style.background = btn.dataset.color;
    btn.style.borderColor = btn.dataset.color;
    btn.style.boxShadow = `0 0 10px ${btn.dataset.color}`;
    cartasSeleccionadas.push(btn);

    if (cartasSeleccionadas.length === 2) {
        checkMatch();
    }
}

function checkMatch() {
    bloqueandoTablero = true;
    const [card1, card2] = cartasSeleccionadas;

    if (card1.dataset.color === card2.dataset.color) {
        card1.classList.add('matched');
        card2.classList.add('matched');
        parejasEncontradas++;
        cartasSeleccionadas = [];
        bloqueandoTablero = false;

        if (parejasEncontradas === 5) {
            setTimeout(() => {
                triggerAudioGlitch();
                const nextBtn = document.getElementById('btn-next-acertijo');
                nextBtn.style.display = "inline-block";
                gsap.fromTo(nextBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
            }, 500);
        }
    } else {
        setTimeout(() => {
            resetCards(card1, card2);
        }, 900);
    }
}

function resetCards(card1, card2) {
    card1.style.background = "";
    card1.style.borderColor = "";
    card1.style.boxShadow = "";
    card2.style.background = "";
    card2.style.borderColor = "";
    card2.style.boxShadow = "";
    cartasSeleccionadas = [];
    bloqueandoTablero = false;
}

function goToLogradoAcertijo() {
    triggerAudioGlitch();
    switchView('view-logrado-acertijo');
}

function goToRompecabezas() {
    triggerAudioGlitch();
    switchView('view-rompecabezas');
    initRompecabezas();
}

/**
 * LÓGICA DEL ROMPECABEZAS DE ROTACIÓN (MATRIZ 2x3)
 */
let puzzleRotations = [0, 0, 0, 0, 0, 0];

function initRompecabezas() {
    const grid = document.getElementById('grid-rompecabezas');
    grid.innerHTML = "";
    document.getElementById('btn-next-rompecabezas').style.display = "none";

    const positions = [
        { x: '0%', y: '0%' },   { x: '100%', y: '0%' },
        { x: '0%', y: '50%' },  { x: '100%', y: '50%' },
        { x: '0%', y: '100%' }, { x: '100%', y: '100%' }
    ];

    for (let i = 0; i < 6; i++) {
        const angles = [90, 180, 270];
        const randomAngle = angles[Math.floor(Math.random() * angles.length)];
        puzzleRotations[i] = randomAngle;

        const tile = document.createElement('div');
        tile.classList.add('tile-rompecabezas');
        tile.style.backgroundPosition = `${positions[i].x} ${positions[i].y}`;
        tile.style.transform = `rotate(${randomAngle}deg)`;
        
        tile.onclick = () => rotateTile(tile, i);
        grid.appendChild(tile);
    }
}

function rotateTile(tile, index) {
    triggerAudioGlitch();
    
    puzzleRotations[index] = (puzzleRotations[index] + 90) % 360;
    tile.style.transform = `rotate(${puzzleRotations[index]}deg)`;

    if (puzzleRotations[index] === 0) {
        tile.style.borderColor = "var(--cyber-purple)";
    } else {
        tile.style.borderColor = "rgba(255, 255, 255, 0.1)";
    }

    checkPuzzleSolved();
}

function checkPuzzleSolved() {
    const isSolved = puzzleRotations.every(rotation => rotation === 0);
    
    if (isSolved) {
        setTimeout(() => {
            triggerAudioGlitch();
            const tiles = document.querySelectorAll('.tile-rompecabezas');
            tiles.forEach(t => t.style.borderColor = "var(--neon-green)");
            
            const nextBtn = document.getElementById('btn-next-rompecabezas');
            nextBtn.style.display = "inline-block";
            gsap.fromTo(nextBtn, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.4 });
        }, 300);
    }
}

function goToLogradoRompecabezas() {
    triggerAudioGlitch();
    switchView('view-logrado-rompecabezas');
}

function goToAlertaFallo() {
    triggerAudioGlitch();
    switchView('view-alerta-fallo');
    document.getElementById('view-alerta-fallo').classList.add('view-alerta-active');
}

function goToRecogeHerramientas() {
    triggerAudioGlitch();
    document.getElementById('view-alerta-fallo').classList.remove('view-alerta-active');
    switchView('view-recoge-herramientas');
    selectedTools = [];
    
    const cards = document.querySelectorAll('.card-herramienta');
    cards.forEach(card => card.classList.remove('selected'));
    closeToolsErrorPopup();
}

/**
 * LÓGICA DE SELECCIÓN Y VALIDACIÓN DE HERRAMIENTAS
 */
let selectedTools = [];

function selectTool(toolId) {
    triggerAudioGlitch();
    const card = document.getElementById(`tool-${toolId}`);
    const index = selectedTools.indexOf(toolId);

    if (index > -1) {
        selectedTools.splice(index, 1);
        card.classList.remove('selected');
    } else {
        if (selectedTools.length < 4) {
            selectedTools.push(toolId);
            card.classList.add('selected');
        } else {
            triggerAudioGlitch();
        }
    }
}

function validateTools() {
    triggerAudioGlitch();
    const correctTools = ['vcl-splicer', 'vcl-calibrator', 'rabteu-wrench', 'rabteu-injector'];
    
    if (selectedTools.length !== 4) {
        showToolsErrorPopup();
        return;
    }

    const verification = correctTools.every(tool => selectedTools.includes(tool));

    if (verification) {
        switchView('view-maleta-lista');
    } else {
        showToolsErrorPopup();
    }
}

function showToolsErrorPopup() {
    const popup = document.getElementById('popup-error-herramientas');
    popup.classList.remove('hidden');
    gsap.fromTo(popup, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
}

function closeToolsErrorPopup() {
    const popup = document.getElementById('popup-error-herramientas');
    if (popup) popup.classList.add('hidden');
}

function goToNaveCabina() {
    triggerAudioGlitch();
    switchView('view-nave-cabina');
    initNaveCabinaState();
}

/**
 * LÓGICA DE REPARACIÓN INTERACTIVA (CLICK-TO-TARGET ORIGEN/DESTINO)
 */
let cabinaTareasCompletadas = { splicer: false, calibrator: false, wrench: false, injector: false };
let puertaAbierta = false;
let selectedSourceToolId = null;

function initNaveCabinaState() {
    cabinaTareasCompletadas = { splicer: false, calibrator: false, wrench: false, injector: false };
    puertaAbierta = false;
    selectedSourceToolId = null;
    
    const puerta = document.getElementById('puerta-cabina');
    puerta.classList.remove('abierta');
    
    document.getElementById('status-cabina-alert').innerText = "SISTEMA EN ESTADO CRÍTICO // INTERFAZ EXPUESTA";
    document.getElementById('status-cabina-alert').style.color = "var(--glitch-red)";
    document.getElementById('view-nave-cabina').classList.add('view-alerta-active');
    
    document.getElementById('panel-herramientas-reparar').style.display = "none";
    document.getElementById('cabina-instruccion').style.display = "block";
    document.getElementById('cabina-instruccion').innerText = "Haz clic en la compuerta para acceder al panel interno.";
    document.getElementById('popup-exito-reparacion').classList.add('hidden');

    const dmgElements = ['dmg-residuos', 'dmg-luces', 'dmg-cables', 'dmg-grieta'];
    dmgElements.forEach(id => {
        const el = document.getElementById(id);
        el.classList.remove('resuelto', 'seleccionado');
    });

    document.getElementById('lbl-residuos').innerText = "RESIDUOS OBSOLETO";
    document.getElementById('lbl-luces').innerText = "MATRIZ LUMÍNICA ERR";
    document.getElementById('lbl-cables').innerText = "BUS DE CABLES DESCONECT";
    document.getElementById('lbl-grieta').innerText = "GRIETA DE PRESIÓN ABIERTA";

    const repButtons = document.querySelectorAll('.btn-herramienta-rep');
    repButtons.forEach(btn => btn.classList.remove('active-select'));
}

function openCabinaPanel() {
    if (puertaAbierta) return;
    triggerAudioGlitch();
    
    puertaAbierta = true;
    document.getElementById('puerta-cabina').classList.add('abierta');
    document.getElementById('panel-herramientas-reparar').style.display = "grid";
    document.getElementById('cabina-instruccion').innerText = "1. Selecciona una herramienta abajo. 2. Haz clic en su anomalía correspondiente arriba.";
}

function selectSourceTool(toolType) {
    if (!puertaAbierta) return;
    triggerAudioGlitch();

    const repButtons = document.querySelectorAll('.btn-herramienta-rep');
    repButtons.forEach(btn => btn.classList.remove('active-select'));

    if (selectedSourceToolId === toolType) {
        // Deseleccionar si se hace click en la misma
        selectedSourceToolId = null;
        document.getElementById('cabina-instruccion').innerText = "Selecciona una herramienta abajo.";
    } else {
        selectedSourceToolId = toolType;
        document.getElementById(`rep-btn-${toolType}`).classList.add('active-select');
        document.getElementById('cabina-instruccion').innerText = `Herramienta [${toolType.toUpperCase()}] cargada. Haz clic en su anomalía objetiva.`;
    }
}

function targetDamageElement(event, requiredToolType) {
    event.stopPropagation(); // Prevenir interferencias con el contenedor de la puerta
    if (!puertaAbierta) return;

    if (!selectedSourceToolId) {
        triggerAudioGlitch();
        document.getElementById('cabina-instruccion').innerText = "⚠️ DEBES SELECCIONAR PRIMERO UNA HERRAMIENTA EN LA PARTE INFERIOR.";
        return;
    }

    if (cabinaTareasCompletadas[requiredToolType]) return; // Ya resuelto

    if (selectedSourceToolId === requiredToolType) {
        triggerAudioGlitch();
        executeRepairAction(requiredToolType);
        
        // Resetear selección de herramienta de origen tras éxito
        selectedSourceToolId = null;
        const repButtons = document.querySelectorAll('.btn-herramienta-rep');
        repButtons.forEach(btn => btn.classList.remove('active-select'));
        document.getElementById('cabina-instruccion').innerText = "Subsistema reparado. Selecciona otra herramienta.";
    } else {
        triggerAudioGlitch();
        document.getElementById('cabina-instruccion').innerText = "⚠️ HERRAMIENTA INCOMPATIBLE CON ESTA ANOMALÍA. PRUEBA OTRA COMBINACIÓN.";
        
        // Efecto visual rápido de error en el elemento clickeado
        const targetEl = document.getElementById(`dmg-${getAnomaliaIdKey(requiredToolType)}`);
        targetEl.classList.add('seleccionado');
        setTimeout(() => targetEl.classList.remove('seleccionado'), 300);
    }
}

function getAnomaliaIdKey(toolType) {
    if (toolType === 'splicer') return 'residuos';
    if (toolType === 'calibrator') return 'luces';
    if (toolType === 'wrench') return 'cables';
    if (toolType === 'injector') return 'grieta';
    return '';
}

function executeRepairAction(toolType) {
    if (toolType === 'splicer') {
        const t = document.getElementById('dmg-residuos');
        document.getElementById('lbl-residuos').innerText = "RESIDUOS ELIMINADOS";
        t.classList.add('resuelto');
        cabinaTareasCompletadas.splicer = true;
    } else if (toolType === 'calibrator') {
        const t = document.getElementById('dmg-luces');
        document.getElementById('lbl-luces').innerText = "LUCES SINCRONIZADAS";
        t.classList.add('resuelto');
        cabinaTareasCompletadas.calibrator = true;
    } else if (toolType === 'wrench') {
        const t = document.getElementById('dmg-cables');
        document.getElementById('lbl-cables').innerText = "CABLES RECONECTADOS";
        t.classList.add('resuelto');
        cabinaTareasCompletadas.wrench = true;
    } else if (toolType === 'injector') {
        const t = document.getElementById('dmg-grieta');
        document.getElementById('lbl-grieta').innerText = "GRIETA SELLADA";
        t.classList.add('resuelto');
        cabinaTareasCompletadas.injector = true;
    }

    checkCabinaReparada();
}

function checkCabinaReparada() {
    const todoListo = Object.values(cabinaTareasCompletadas).every(status => status === true);
    
    if (todoListo) {
        setTimeout(() => {
            triggerAudioGlitch();
            document.getElementById('view-nave-cabina').classList.remove('view-alerta-active');
            document.getElementById('status-cabina-alert').innerText = "ESTABILIDAD RESTAURADA // INTEGRIDAD AL 100%";
            document.getElementById('status-cabina-alert').style.color = "var(--neon-green)";
            document.getElementById('cabina-instruccion').innerText = "Reparación estructural completa.";
            
            const popup = document.getElementById('popup-exito-reparacion');
            popup.classList.remove('hidden');
            gsap.fromTo(popup, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.3 });
        }, 400);
    }
}

/**
 * SECUENCIA DE INTERFERENCIA, REINICIO Y ACTIVACIÓN DE PARTY_RABTEU.MP3
 */
function triggerDeviceCrash() {
    triggerAudioGlitch();
    
    // Transición y atenuación progresiva del ambiente de fondo original
    if (ambientTrack) {
        gsap.to(ambientTrack, {
            volume: 0,
            duration: 1.5,
            onComplete: () => {
                ambientTrack.pause();
            }
        });
    }

    const crashScreen = document.getElementById('screen-device-crash');
    const fill = document.getElementById('crash-reboot-fill');
    
    crashScreen.style.display = "flex";
    fill.style.width = "0%";

    gsap.to(fill, {
        width: "100%",
        duration: 3.5,
        ease: "power2.inOut",
        onComplete: () => {
            gsap.to(crashScreen, {
                opacity: 0,
                duration: 0.4,
                onComplete: () => {
                    crashScreen.style.display = "none";
                    crashScreen.style.opacity = "1";
                    
                    // Inicializar y reproducir el nuevo track de música electrónica progresiva
                    if (partyTrack) {
                        partyTrack.currentTime = 0;
                        partyTrack.play().catch(() => {});
                        // Subida de volumen progresiva (Fade-In) adaptada al slider maestro
                        gsap.to(partyTrack, {
                            volume: currentVolumeLevel * 0.8,
                            duration: 4.0,
                            ease: "linear"
                        });
                    }

                    // Forzar limpieza y despliegue del área de chat
                    switchView('view-satelite-chat');
                    document.getElementById('chat-box-container').innerHTML = "";
                    document.getElementById('chat-trigger-wrapper').style.display = "flex";
                    
                    // Asegurar visibilidad de elementos base del chat
                    document.getElementById('chat-box-container').style.display = "flex";
                    document.getElementById('panel-sobreviviente-notas').style.display = "none";
                    document.getElementById('panel-transmedia-final').style.display = "none";
                    document.getElementById('satellite-header-title').innerText = "📡 SAT_LINK_SECURE";
                    document.getElementById('popup-critical-disconnect').classList.add('hidden');
                }
            });
        }
    });
}

/**
 * MOTOR DE TRANSMISIÓN ASÍNCRONA FRAGMENTADA (CHAT DE DIÁLOGOS DE MALWËR)
 */
function appendChatMessageElement(senderName, alignLeft, colorVar) {
    const container = document.getElementById('chat-box-container');
    
    const wrapper = document.createElement('div');
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = alignLeft ? "flex-start" : "flex-end";
    wrapper.style.width = "100%";
    
    const label = document.createElement('span');
    label.style.fontSize = "0.6rem";
    label.style.fontWeight = "bold";
    label.style.marginBottom = "3px";
    label.style.letterSpacing = "0.5px";
    label.style.color = colorVar;
    label.innerText = senderName + ":";
    
    const body = document.createElement('div');
    body.style.borderRadius = "4px";
    body.style.padding = "8px";
    body.style.fontSize = "0.68rem";
    body.style.lineHeight = "1.4";
    body.style.color = "#ffffff";
    body.style.width = alignLeft ? "90%" : "85%";
    body.style.textAlign = alignLeft ? "left" : "right";
    
    if (alignLeft) {
        body.style.background = "rgba(255, 0, 85, 0.08)";
        body.style.border = "1px solid rgba(255, 0, 85, 0.2)";
    } else {
        body.style.background = "rgba(0, 255, 102, 0.08)";
        body.style.border = "1px solid rgba(0, 255, 102, 0.2)";
    }
    
    wrapper.appendChild(label);
    wrapper.appendChild(body);
    container.appendChild(wrapper);
    
    // Auto scroll automático hacia el fondo del feed
    container.scrollTop = container.scrollHeight;
    
    return body;
}

function activateSateliteCommunication() {
    triggerAudioGlitch();
    document.getElementById('chat-trigger-wrapper').style.display = "none";
    executeSequencedChatScript();
}

async function executeSequencedChatScript() {
    const chatContainer = document.getElementById('chat-box-container');
    
    // Block 1: MALWER
    let bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "por fin logré que una persona me diera acceso a su satélite");
    await new Promise(r => setTimeout(r, 1600));

    // Block 2: MALWER
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "la tierra tiene los días contados, JAJAJAJA");
    await new Promise(r => setTimeout(r, 1400));

    // Block 3: USUARIO
    bodyNode = appendChatMessageElement("TÚ", false, "var(--neon-green)");
    bodyNode.innerText = "¡¿Dónde está el Agente R-btu?!";
    triggerAudioGlitch();
    chatContainer.scrollTop = chatContainer.scrollHeight;
    await new Promise(r => setTimeout(r, 1800));

    // Block 4: MALWER
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "El agente fue sólo un invento, ¿quien diría que fue tan sencillo ganarme tu confianza...");
    await new Promise(r => setTimeout(r, 1600));

    // Block 5: USUARIO
    bodyNode = appendChatMessageElement("TÚ", false, "var(--neon-green)");
    bodyNode.innerText = "Pero... o sea que todo este tiempo...";
    triggerAudioGlitch();
    chatContainer.scrollTop = chatContainer.scrollHeight;
    await new Promise(r => setTimeout(r, 1800));

    // Block 6: MALWER
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "...");
    await new Promise(r => setTimeout(r, 1200));

    // Block 7: MALWER (Explicación del engaño biométrico)
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "Creé la identidad del agente para guiarte exactamente a donde quería. Necesitaba que procesaras los filtros de seguridad del sistema.");
    await new Promise(r => setTimeout(r, 1600));

    // Block 8: MALWER
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "Al resolver las matrices lumínicas y de rotación, absorbí tus firmas y datos biométricos directamente desde la pantalla táctil.");
    await new Promise(r => setTimeout(r, 1500));

    // Block 9: USUARIO
    bodyNode = appendChatMessageElement("TÚ", false, "var(--neon-green)");
    bodyNode.innerText = "No... no es posible. ¡Las herramientas eran de reparación!";
    triggerAudioGlitch();
    chatContainer.scrollTop = chatContainer.scrollHeight;
    await new Promise(r => setTimeout(r, 1800));

    // Block 10: MALWER
    bodyNode = appendChatMessageElement("MALWER (IA)", true, "var(--glitch-red)");
    await typeDecryptingTextSlow(bodyNode, "Ahora me haré pasar por ti. Usaré tu credencial autorizada para esparcir mi código por toda la red de la colonia. Gracias por abrirme las compuertas.");
    await new Promise(r => setTimeout(r, 3500));

    // Despliegue del Pop-up de desconexión forzada por la IA
    triggerAudioGlitch();
    const disconnectPopup = document.getElementById('popup-critical-disconnect');
    disconnectPopup.classList.remove('hidden');
    gsap.fromTo(disconnectPopup, { opacity: 0, scale: 0.9 }, { opacity: 1, scale: 1, duration: 0.4 });
}

function typeDecryptingTextSlow(element, finalContainerText) {
    return new Promise((resolve) => {
        const chars = "$%&/()=?¿#@+*{}[]";
        let currentLen = 0;
        element.innerText = "";

        let interval = setInterval(() => {
            currentLen += 1; // Generación con paso ralentizado para mayor tensión dramática
            if (currentLen > finalContainerText.length) {
                element.innerText = finalContainerText;
                clearInterval(interval);
                resolve();
                return;
            }

            let dynamicStr = finalContainerText.substring(0, currentLen);
            for (let k = currentLen; k < finalContainerText.length && k < currentLen + 4; k++) {
                dynamicStr += chars[Math.floor(Math.random() * chars.length)];
            }
            element.innerText = dynamicStr;
        }, 55); // Incremento del delay por carácter
    });
}

/**
 * SISTEMA POST-RECONEXIÓN: APERTURA DIÉGETICA DE LA CARTA DEL SOBREVIVIENTE
 */
function executeSateliteReconnection() {
    triggerAudioGlitch();
    document.getElementById('popup-critical-disconnect').classList.add('hidden');
    
    // Transformar visualmente la barra de estado superior del chat
    document.getElementById('satellite-header-title').innerText = "📂 NOTAS_RECUPERADAS.DAT";
    document.getElementById('satellite-header-title').style.color = "var(--neon-green)";
    
    // Convertir el botón del satélite en un icono interactivo de notas
    const iconBtnContainer = document.getElementById('satellite-logo-btn-container');
    iconBtnContainer.style.borderColor = "var(--neon-green)";
    iconBtnContainer.style.background = "rgba(0, 255, 102, 0.05)";
    
    // Cambiar el SVG del satélite a un glifo de archivo/notas
    document.getElementById('satellite-svg-icon').innerHTML = `
        <path d="M25 15 H 60 L 75 30 V 85 H 25 Z" fill="none" stroke="currentColor" stroke-width="4"/>
        <path d="M55 15 V 32 H 75" fill="none" stroke="currentColor" stroke-width="3"/>
        <line x1="35" y1="45" x2="65" y2="45" stroke="currentColor" stroke-width="3"/>
        <line x1="35" y1="60" x2="65" y2="60" stroke="currentColor" stroke-width="3"/>
    `;
    
    // Ocultar chat y habilitar vista del texto del sobreviviente
    document.getElementById('chat-box-container').style.display = "none";
    const notasPanel = document.getElementById('panel-sobreviviente-notas');
    notasPanel.style.display = "flex";
    gsap.fromTo(notasPanel, { opacity: 0, y: 8 }, { opacity: 1, y: 0, duration: 0.4 });
}

function openSurvivorNotesPanel() {
    // Si el usuario hace clic directamente sobre el icono de notas, refresca el foco visual
    if (document.getElementById('panel-sobreviviente-notas').style.display === "flex") {
        triggerAudioGlitch();
    }
}

function showTransmediaNextStep() {
    triggerAudioGlitch();
    document.getElementById('panel-sobreviviente-notas').style.display = "none";
    document.getElementById('satellite-header-title').innerText = "🔗 PROTOCOLO_TRANSMEDIA";
    
    const finalPanel = document.getElementById('panel-transmedia-final');
    finalPanel.style.display = "flex";
    gsap.fromTo(finalPanel, { opacity: 0, scale: 0.96 }, { opacity: 1, scale: 1, duration: 0.4 });
}

function runSystemClock() {
    setInterval(() => {
        const now = new Date();
        document.getElementById('clock').innerText = 
            now.getHours().toString().padStart(2, '0') + ":" + 
            now.getMinutes().toString().padStart(2, '0');
    }, 1000);
}