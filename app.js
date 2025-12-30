// ===== State Management =====
const state = {
    currentPet: null,
    filterActive: false,
    stream: null,
    animationFrame: null
};

// ===== DOM Elements =====
const elements = {
    dashboard: document.getElementById('dashboard'),
    cameraView: document.getElementById('camera-view'),
    permissionError: document.getElementById('permission-error'),
    petCards: document.querySelectorAll('.pet-card'),
    video: document.getElementById('video'),
    canvas: document.getElementById('canvas'),
    backBtn: document.getElementById('back-btn'),
    toggleFilter: document.getElementById('toggle-filter'),
    currentPetIcon: document.getElementById('current-pet-icon'),
    currentPetName: document.getElementById('current-pet-name'),
    retryCamera: document.getElementById('retry-camera'),
    backToDashboard: document.getElementById('back-to-dashboard')
};

// ===== Pet Vision Configurations =====
const petVisionConfig = {
    dog: {
        name: 'Dog',
        icon: '🐕',
        // Dogs are dichromats - they see blue-yellow spectrum but not red-green
        // They lack red cones, so reds appear yellowish-brown and greens appear yellow
        filter: (r, g, b) => {
            // Convert to perceived luminance
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Simulate dichromatic vision (protanopia - red-blind)
            // Map reds to yellows/browns, preserve blues
            const newR = 0.56667 * r + 0.43333 * g;
            const newG = 0.55833 * r + 0.44167 * g;
            const newB = 0.24167 * g + 0.75833 * b;
            
            // Reduce overall saturation (dogs see less vibrant colors)
            const saturationFactor = 0.6;
            const avgR = luminance + (newR - luminance) * saturationFactor;
            const avgG = luminance + (newG - luminance) * saturationFactor;
            const avgB = luminance + (newB - luminance) * saturationFactor;
            
            return [
                Math.min(255, Math.max(0, avgR)),
                Math.min(255, Math.max(0, avgG)),
                Math.min(255, Math.max(0, avgB))
            ];
        }
    },
    cat: {
        name: 'Cat',
        icon: '🐱',
        // Cats also have dichromatic vision similar to dogs but with better night vision
        // They see blues and yellows well but struggle with reds
        filter: (r, g, b) => {
            const luminance = 0.299 * r + 0.587 * g + 0.114 * b;
            
            // Similar to dog vision but slightly different color mapping
            const newR = 0.625 * r + 0.375 * g;
            const newG = 0.7 * r + 0.3 * g;
            const newB = 0.3 * g + 0.7 * b;
            
            // Cats have slightly better color discrimination than dogs
            const saturationFactor = 0.65;
            const avgR = luminance + (newR - luminance) * saturationFactor;
            const avgG = luminance + (newG - luminance) * saturationFactor;
            const avgB = luminance + (newB - luminance) * saturationFactor;
            
            // Enhance brightness slightly (better night vision)
            const brightnessFactor = 1.1;
            
            return [
                Math.min(255, Math.max(0, avgR * brightnessFactor)),
                Math.min(255, Math.max(0, avgG * brightnessFactor)),
                Math.min(255, Math.max(0, avgB * brightnessFactor))
            ];
        }
    }
};

// ===== View Management =====
function showView(viewName) {
    [elements.dashboard, elements.cameraView, elements.permissionError].forEach(view => {
        view.classList.remove('active');
    });
    
    setTimeout(() => {
        if (viewName === 'dashboard') elements.dashboard.classList.add('active');
        else if (viewName === 'camera') elements.cameraView.classList.add('active');
        else if (viewName === 'error') elements.permissionError.classList.add('active');
    }, 50);
}

// ===== Camera Management =====
async function startCamera() {
    try {
        // Request camera with rear camera preference for mobile
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' },
                width: { ideal: 1920 },
                height: { ideal: 1080 }
            }
        };
        
        state.stream = await navigator.mediaDevices.getUserMedia(constraints);
        elements.video.srcObject = state.stream;
        
        // Wait for video to be ready
        await new Promise((resolve) => {
            elements.video.onloadedmetadata = () => {
                setupCanvas();
                resolve();
            };
        });
        
        showView('camera');
        
    } catch (error) {
        console.error('Camera access error:', error);
        showView('error');
    }
}

function stopCamera() {
    if (state.stream) {
        state.stream.getTracks().forEach(track => track.stop());
        state.stream = null;
    }
    
    if (state.animationFrame) {
        cancelAnimationFrame(state.animationFrame);
        state.animationFrame = null;
    }
    
    elements.video.srcObject = null;
}

function setupCanvas() {
    const video = elements.video;
    const canvas = elements.canvas;
    
    // Match canvas size to video
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
}

// ===== Filter Application =====
function applyPetFilter() {
    if (!state.filterActive || !state.currentPet) return;
    
    const video = elements.video;
    const canvas = elements.canvas;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    
    // Draw current video frame
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    
    // Get image data
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;
    
    // Apply pet vision filter
    const filterFunc = petVisionConfig[state.currentPet].filter;
    
    for (let i = 0; i < data.length; i += 4) {
        const [newR, newG, newB] = filterFunc(data[i], data[i + 1], data[i + 2]);
        data[i] = newR;
        data[i + 1] = newG;
        data[i + 2] = newB;
        // Alpha channel (data[i + 3]) remains unchanged
    }
    
    // Put filtered image back
    ctx.putImageData(imageData, 0, 0);
    
    // Continue animation loop
    state.animationFrame = requestAnimationFrame(applyPetFilter);
}

function toggleFilter() {
    state.filterActive = !state.filterActive;
    
    const toggleSwitch = elements.toggleFilter.querySelector('.toggle-switch');
    
    if (state.filterActive) {
        toggleSwitch.classList.add('active');
        elements.canvas.classList.add('active');
        applyPetFilter();
    } else {
        toggleSwitch.classList.remove('active');
        elements.canvas.classList.remove('active');
        if (state.animationFrame) {
            cancelAnimationFrame(state.animationFrame);
            state.animationFrame = null;
        }
    }
}

// ===== Event Handlers =====
function handlePetSelection(petType) {
    state.currentPet = petType;
    const config = petVisionConfig[petType];
    
    elements.currentPetIcon.textContent = config.icon;
    elements.currentPetName.textContent = config.name;
    
    startCamera();
}

function handleBackButton() {
    stopCamera();
    state.filterActive = false;
    state.currentPet = null;
    elements.canvas.classList.remove('active');
    elements.toggleFilter.querySelector('.toggle-switch').classList.remove('active');
    showView('dashboard');
}

// ===== Event Listeners =====
elements.petCards.forEach(card => {
    card.addEventListener('click', () => {
        const petType = card.dataset.pet;
        handlePetSelection(petType);
    });
});

elements.backBtn.addEventListener('click', handleBackButton);
elements.toggleFilter.addEventListener('click', toggleFilter);
elements.retryCamera.addEventListener('click', () => {
    showView('camera');
    startCamera();
});
elements.backToDashboard.addEventListener('click', () => {
    showView('dashboard');
});

// ===== Prevent screen sleep on mobile =====
let wakeLock = null;

async function requestWakeLock() {
    try {
        if ('wakeLock' in navigator) {
            wakeLock = await navigator.wakeLock.request('screen');
            console.log('Wake Lock active');
        }
    } catch (err) {
        console.error('Wake Lock error:', err);
    }
}

// Request wake lock when camera starts
elements.cameraView.addEventListener('transitionend', () => {
    if (elements.cameraView.classList.contains('active')) {
        requestWakeLock();
    }
});

// Handle visibility change
document.addEventListener('visibilitychange', async () => {
    if (wakeLock !== null && document.visibilityState === 'visible') {
        await requestWakeLock();
    }
});

// ===== Initialize =====
console.log('PetEyes App Initialized 👁️');
