/**
 * ==========================================================================
 * M-WER | ENGINE-THREE - RED DE NODOS INTERACTIVOS EN VERDE NEÓN
 * ==========================================================================
 */

let coreScene, coreCamera, coreRenderer, nodePoints;

function initThreeEngine() {
    const renderContainer = document.getElementById('canvas-container');
    if (!renderContainer) return;

    coreScene = new THREE.Scene();
    
    coreCamera = new THREE.PerspectiveCamera(60, window.innerWidth / window.innerHeight, 1, 1000);
    coreCamera.position.z = 400;

    coreRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    coreRenderer.setSize(window.innerWidth, window.innerHeight);
    coreRenderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderContainer.appendChild(coreRenderer.domElement);

    // Malla Cromática: Configurada para Renderizar en Verde Neón (0x00ff66)
    const nodeCount = 350;
    const geometryBuffer = new THREE.BufferGeometry();
    const positionMatrix = new Float32Array(nodeCount * 3);

    for (let i = 0; i < nodeCount * 3; i += 3) {
        positionMatrix[i] = (Math.random() - 0.5) * 750;
        positionMatrix[i+1] = (Math.random() - 0.5) * 750;
        positionMatrix[i+2] = (Math.random() - 0.5) * 500;
    }

    geometryBuffer.setAttribute('position', new THREE.BufferAttribute(positionMatrix, 3));

    const materialConfig = new THREE.PointsMaterial({
        color: 0x00ff66,
        size: 1.8,
        transparent: true,
        opacity: 0.2,
        blending: THREE.AdditiveBlending
    });

    nodePoints = new THREE.Points(geometryBuffer, materialConfig);
    coreScene.add(nodePoints);

    window.addEventListener('resize', handleViewportResize, false);
    executeRenderLoop();
}

function executeRenderLoop() {
    requestAnimationFrame(executeRenderLoop);

    if (nodePoints) {
        nodePoints.rotation.y += 0.0002;
        nodePoints.rotation.x += 0.0001;
    }

    coreRenderer.render(coreScene, coreCamera);
}

function handleViewportResize() {
    coreCamera.aspect = window.innerWidth / window.innerHeight;
    coreCamera.updateProjectionMatrix();
    coreRenderer.setSize(window.innerWidth, window.innerHeight);
}

document.addEventListener('DOMContentLoaded', initThreeEngine);