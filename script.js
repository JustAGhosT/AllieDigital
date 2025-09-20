// ===== GLOBAL VARIABLES AND CONSTANTS =====
const CONFIG = {
    // Neural Network Config
    NEURAL_NODES: 50,
    NEURAL_CONNECTIONS: 100,
    NEURAL_SPEED: 0.02,
    
    // Particle System Config
    PARTICLE_COUNT: 80,
    PARTICLE_SPEED: 1,
    PARTICLE_SIZE: { min: 2, max: 6 },
    
    // Quantum Wave Config
    WAVE_FREQUENCY: 0.02,
    WAVE_AMPLITUDE: 50,
    WAVE_SPEED: 0.05,
    
    // Accessibility
    REDUCED_MOTION: false,
    HIGH_CONTRAST: false,
    READING_GUIDE: false,
    SPEECH_ENABLED: false
};

// Global state management
const AppState = {
    currentTheme: 'light',
    fontSize: 16,
    animations: [],
    speechSynthesis: null,
    speechRecognition: null,
    currentDemo: null
};

// ===== UTILITY FUNCTIONS =====
function $(selector) {
    return document.querySelector(selector);
}

function $$(selector) {
    return document.querySelectorAll(selector);
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function random(min, max) {
    return Math.random() * (max - min) + min;
}

function lerp(start, end, factor) {
    return start + (end - start) * factor;
}

// ===== NEURAL NETWORK VISUALIZATION =====
class NeuralNetwork {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.nodes = [];
        this.connections = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.setupCanvas();
        this.createNodes();
        this.createConnections();
        this.bindEvents();
        this.animate();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createNodes() {
        this.nodes = [];
        for (let i = 0; i < CONFIG.NEURAL_NODES; i++) {
            this.nodes.push({
                x: random(50, this.canvas.width / window.devicePixelRatio - 50),
                y: random(50, this.canvas.height / window.devicePixelRatio - 50),
                vx: random(-1, 1),
                vy: random(-1, 1),
                size: random(4, 12),
                activation: random(0, 1),
                targetActivation: random(0, 1),
                pulse: 0
            });
        }
    }
    
    createConnections() {
        this.connections = [];
        for (let i = 0; i < CONFIG.NEURAL_CONNECTIONS; i++) {
            const nodeA = this.nodes[Math.floor(random(0, this.nodes.length))];
            const nodeB = this.nodes[Math.floor(random(0, this.nodes.length))];
            if (nodeA !== nodeB) {
                this.connections.push({
                    nodeA,
                    nodeB,
                    strength: random(0.1, 1),
                    activity: 0
                });
            }
        }
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
            this.activateNearbyNodes();
        });
        
        this.canvas.addEventListener('click', () => {
            this.triggerNetworkPulse();
            this.announceInteraction('Neural network activated');
        });
    }
    
    activateNearbyNodes() {
        this.nodes.forEach(node => {
            const distance = Math.sqrt(
                Math.pow(node.x - this.mouse.x, 2) + 
                Math.pow(node.y - this.mouse.y, 2)
            );
            if (distance < 100) {
                node.targetActivation = Math.max(0.5, 1 - distance / 100);
            }
        });
    }
    
    triggerNetworkPulse() {
        this.nodes.forEach(node => {
            node.pulse = 1;
            node.targetActivation = 1;
        });
    }
    
    update() {
        this.time += CONFIG.NEURAL_SPEED;
        
        // Update nodes
        this.nodes.forEach(node => {
            // Smooth activation changes
            node.activation = lerp(node.activation, node.targetActivation, 0.05);
            node.targetActivation *= 0.95; // Decay
            
            // Pulse animation
            if (node.pulse > 0) {
                node.pulse -= 0.02;
                node.size = 12 + node.pulse * 8;
            } else {
                node.size = lerp(node.size, random(4, 8), 0.02);
            }
            
            // Gentle movement
            if (!CONFIG.REDUCED_MOTION) {
                node.x += Math.sin(this.time + node.y * 0.01) * 0.2;
                node.y += Math.cos(this.time + node.x * 0.01) * 0.2;
            }
        });
        
        // Update connections
        this.connections.forEach(connection => {
            const distance = Math.sqrt(
                Math.pow(connection.nodeA.x - connection.nodeB.x, 2) + 
                Math.pow(connection.nodeA.y - connection.nodeB.y, 2)
            );
            
            connection.activity = (connection.nodeA.activation + connection.nodeB.activation) / 2;
            connection.activity *= Math.max(0, 1 - distance / 200); // Distance falloff
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Draw connections
        this.connections.forEach(connection => {
            if (connection.activity > 0.1) {
                const gradient = this.ctx.createLinearGradient(
                    connection.nodeA.x, connection.nodeA.y,
                    connection.nodeB.x, connection.nodeB.y
                );
                gradient.addColorStop(0, `rgba(99, 102, 241, ${connection.activity * 0.5})`);
                gradient.addColorStop(1, `rgba(16, 185, 129, ${connection.activity * 0.3})`);
                
                this.ctx.strokeStyle = gradient;
                this.ctx.lineWidth = connection.activity * 2;
                this.ctx.beginPath();
                this.ctx.moveTo(connection.nodeA.x, connection.nodeA.y);
                this.ctx.lineTo(connection.nodeB.x, connection.nodeB.y);
                this.ctx.stroke();
            }
        });
        
        // Draw nodes
        this.nodes.forEach(node => {
            const glow = node.activation * 20;
            
            // Glow effect
            if (glow > 2) {
                this.ctx.shadowColor = `rgba(99, 102, 241, ${node.activation})`;
                this.ctx.shadowBlur = glow;
            } else {
                this.ctx.shadowBlur = 0;
            }
            
            // Node
            this.ctx.fillStyle = `rgba(99, 102, 241, ${0.7 + node.activation * 0.3})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size, 0, Math.PI * 2);
            this.ctx.fill();
            
            // Core
            this.ctx.fillStyle = `rgba(255, 255, 255, ${node.activation})`;
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, node.size * 0.4, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        this.update();
        this.render();
        
        if (!CONFIG.REDUCED_MOTION) {
            requestAnimationFrame(() => this.animate());
        } else {
            // Static render for reduced motion
            setTimeout(() => this.animate(), 100);
        }
    }
    
    announceInteraction(message) {
        if (CONFIG.SPEECH_ENABLED && AppState.speechSynthesis) {
            const utterance = new SpeechSynthesisUtterance(message);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }
}

// ===== PARTICLE SYSTEM =====
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.mouse = { x: 0, y: 0 };
        this.time = 0;
        
        this.setupCanvas();
        this.createParticles();
        this.bindEvents();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createParticles() {
        this.particles = [];
        for (let i = 0; i < CONFIG.PARTICLE_COUNT; i++) {
            this.particles.push({
                x: random(0, this.canvas.width / window.devicePixelRatio),
                y: random(0, this.canvas.height / window.devicePixelRatio),
                vx: random(-CONFIG.PARTICLE_SPEED, CONFIG.PARTICLE_SPEED),
                vy: random(-CONFIG.PARTICLE_SPEED, CONFIG.PARTICLE_SPEED),
                size: random(CONFIG.PARTICLE_SIZE.min, CONFIG.PARTICLE_SIZE.max),
                color: this.getRandomColor(),
                life: 1,
                attraction: random(0.5, 2)
            });
        }
    }
    
    getRandomColor() {
        const colors = [
            'rgba(99, 102, 241, 0.7)',
            'rgba(16, 185, 129, 0.7)',
            'rgba(245, 158, 11, 0.7)',
            'rgba(239, 68, 68, 0.7)',
            'rgba(139, 92, 246, 0.7)'
        ];
        return colors[Math.floor(random(0, colors.length))];
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
    }
    
    update() {
        this.time += 0.01;
        
        this.particles.forEach(particle => {
            // Mouse attraction
            const dx = this.mouse.x - particle.x;
            const dy = this.mouse.y - particle.y;
            const distance = Math.sqrt(dx * dx + dy * dy);
            
            if (distance < 150) {
                const force = (150 - distance) / 150 * particle.attraction * 0.01;
                particle.vx += dx * force;
                particle.vy += dy * force;
            }
            
            // Apply velocity
            particle.x += particle.vx;
            particle.y += particle.vy;
            
            // Friction
            particle.vx *= 0.99;
            particle.vy *= 0.99;
            
            // Boundary wrapping
            if (particle.x < 0) particle.x = this.canvas.width / window.devicePixelRatio;
            if (particle.x > this.canvas.width / window.devicePixelRatio) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height / window.devicePixelRatio;
            if (particle.y > this.canvas.height / window.devicePixelRatio) particle.y = 0;
            
            // Size oscillation
            particle.size = CONFIG.PARTICLE_SIZE.min + 
                Math.sin(this.time + particle.x * 0.01) * 
                (CONFIG.PARTICLE_SIZE.max - CONFIG.PARTICLE_SIZE.min) * 0.5;
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.particles.forEach(particle => {
            this.ctx.fillStyle = particle.color;
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = 10;
            
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.shadowBlur = 0;
    }
    
    animate() {
        this.update();
        this.render();
        
        if (!CONFIG.REDUCED_MOTION) {
            requestAnimationFrame(() => this.animate());
        } else {
            setTimeout(() => this.animate(), 100);
        }
    }
}

// ===== QUANTUM WAVE FIELD =====
class QuantumWaves {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.time = 0;
        this.waves = [];
        this.mouse = { x: 0, y: 0 };
        
        this.setupCanvas();
        this.createWaves();
        this.bindEvents();
    }
    
    setupCanvas() {
        const rect = this.canvas.getBoundingClientRect();
        this.canvas.width = rect.width * window.devicePixelRatio;
        this.canvas.height = rect.height * window.devicePixelRatio;
        this.ctx.scale(window.devicePixelRatio, window.devicePixelRatio);
        this.canvas.style.width = rect.width + 'px';
        this.canvas.style.height = rect.height + 'px';
    }
    
    createWaves() {
        this.waves = [
            { frequency: 0.02, amplitude: 30, speed: 0.05, color: 'rgba(99, 102, 241, 0.3)' },
            { frequency: 0.03, amplitude: 20, speed: 0.03, color: 'rgba(16, 185, 129, 0.3)' },
            { frequency: 0.01, amplitude: 40, speed: 0.07, color: 'rgba(245, 158, 11, 0.2)' }
        ];
    }
    
    bindEvents() {
        this.canvas.addEventListener('mousemove', (e) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = e.clientX - rect.left;
            this.mouse.y = e.clientY - rect.top;
        });
        
        this.canvas.addEventListener('click', () => {
            this.createRipple(this.mouse.x, this.mouse.y);
        });
    }
    
    createRipple(x, y) {
        this.waves.push({
            centerX: x,
            centerY: y,
            radius: 0,
            maxRadius: 200,
            life: 1,
            color: 'rgba(255, 255, 255, 0.5)'
        });
    }
    
    update() {
        this.time += CONFIG.WAVE_SPEED;
        
        // Update ripples
        this.waves = this.waves.filter(wave => {
            if (wave.hasOwnProperty('life')) {
                wave.radius += 3;
                wave.life = 1 - (wave.radius / wave.maxRadius);
                return wave.life > 0;
            }
            return true;
        });
    }
    
    render() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
        const width = this.canvas.width / window.devicePixelRatio;
        const height = this.canvas.height / window.devicePixelRatio;
        
        // Draw quantum waves
        this.waves.forEach(wave => {
            if (!wave.hasOwnProperty('life')) {
                // Static waves
                this.ctx.strokeStyle = wave.color;
                this.ctx.lineWidth = 2;
                this.ctx.beginPath();
                
                for (let x = 0; x < width; x += 2) {
                    const mouseInfluence = Math.max(0, 1 - Math.abs(x - this.mouse.x) / 100);
                    const y = height / 2 + 
                        Math.sin(x * wave.frequency + this.time) * wave.amplitude +
                        Math.sin(this.time * 2) * 10 * mouseInfluence;
                    
                    if (x === 0) {
                        this.ctx.moveTo(x, y);
                    } else {
                        this.ctx.lineTo(x, y);
                    }
                }
                
                this.ctx.stroke();
            } else {
                // Ripples
                this.ctx.strokeStyle = `rgba(255, 255, 255, ${wave.life * 0.5})`;
                this.ctx.lineWidth = 3;
                this.ctx.beginPath();
                this.ctx.arc(wave.centerX, wave.centerY, wave.radius, 0, Math.PI * 2);
                this.ctx.stroke();
            }
        });
    }
    
    animate() {
        this.update();
        this.render();
        
        if (!CONFIG.REDUCED_MOTION) {
            requestAnimationFrame(() => this.animate());
        } else {
            setTimeout(() => this.animate(), 100);
        }
    }
}

// ===== ACCESSIBILITY FEATURES =====
class AccessibilityManager {
    constructor() {
        this.setupKeyboardNavigation();
        this.setupReadingGuide();
        this.setupSpeechSupport();
        this.loadUserPreferences();
    }
    
    setupKeyboardNavigation() {
        document.addEventListener('keydown', (e) => {
            // Escape key closes accessibility panel
            if (e.key === 'Escape') {
                this.closeAccessibilityPanel();
            }
            
            // Space or Enter activates focused elements
            if ((e.key === ' ' || e.key === 'Enter') && e.target.classList.contains('feature-card')) {
                e.preventDefault();
                this.announceFeature(e.target);
            }
            
            // Arrow keys for navigation
            if (e.key.startsWith('Arrow')) {
                this.handleArrowKeyNavigation(e);
            }
        });
    }
    
    setupReadingGuide() {
        const guide = $('#reading-guide');
        let isActive = false;
        
        document.addEventListener('mousemove', (e) => {
            if (CONFIG.READING_GUIDE && e.target.tagName === 'P') {
                const rect = e.target.getBoundingClientRect();
                guide.style.top = (rect.top + window.scrollY) + 'px';
                guide.style.left = rect.left + 'px';
                guide.style.width = rect.width + 'px';
                guide.classList.add('active');
                isActive = true;
            } else if (isActive) {
                guide.classList.remove('active');
                isActive = false;
            }
        });
    }
    
    setupSpeechSupport() {
        // Text-to-Speech
        if ('speechSynthesis' in window) {
            AppState.speechSynthesis = speechSynthesis;
            
            // Add click-to-speak functionality
            document.addEventListener('click', (e) => {
                if (CONFIG.SPEECH_ENABLED && e.target.closest('p, h1, h2, h3, h4, h5, h6')) {
                    const text = e.target.textContent;
                    this.speak(text);
                }
            });
        }
        
        // Speech Recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            AppState.speechRecognition = new SpeechRecognition();
            AppState.speechRecognition.continuous = false;
            AppState.speechRecognition.interimResults = false;
            
            AppState.speechRecognition.onresult = (event) => {
                const command = event.results[0][0].transcript.toLowerCase();
                this.processVoiceCommand(command);
            };
        }
    }
    
    speak(text) {
        if (AppState.speechSynthesis) {
            speechSynthesis.cancel(); // Stop current speech
            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.8;
            utterance.pitch = 1;
            speechSynthesis.speak(utterance);
        }
    }
    
    processVoiceCommand(command) {
        if (command.includes('dark mode') || command.includes('dark theme')) {
            this.toggleTheme();
        } else if (command.includes('accessibility') || command.includes('settings')) {
            this.openAccessibilityPanel();
        } else if (command.includes('larger text') || command.includes('bigger font')) {
            this.adjustFontSize(2);
        } else if (command.includes('smaller text') || command.includes('smaller font')) {
            this.adjustFontSize(-2);
        }
    }
    
    announceFeature(element) {
        const title = element.querySelector('h3').textContent;
        const description = element.querySelector('p').textContent;
        this.speak(`${title}. ${description}`);
    }
    
    loadUserPreferences() {
        const savedPrefs = localStorage.getItem('allieDigitalPrefs');
        if (savedPrefs) {
            const prefs = JSON.parse(savedPrefs);
            this.applyPreferences(prefs);
        }
    }
    
    saveUserPreferences() {
        const prefs = {
            theme: AppState.currentTheme,
            fontSize: AppState.fontSize,
            reducedMotion: CONFIG.REDUCED_MOTION,
            highContrast: CONFIG.HIGH_CONTRAST,
            readingGuide: CONFIG.READING_GUIDE,
            speechEnabled: CONFIG.SPEECH_ENABLED
        };
        localStorage.setItem('allieDigitalPrefs', JSON.stringify(prefs));
    }
    
    applyPreferences(prefs) {
        if (prefs.theme) {
            AppState.currentTheme = prefs.theme;
            document.documentElement.setAttribute('data-theme', prefs.theme);
        }
        if (prefs.fontSize) {
            this.setFontSize(prefs.fontSize);
        }
        if (prefs.reducedMotion) {
            CONFIG.REDUCED_MOTION = prefs.reducedMotion;
        }
        if (prefs.highContrast) {
            CONFIG.HIGH_CONTRAST = prefs.highContrast;
        }
        if (prefs.readingGuide) {
            CONFIG.READING_GUIDE = prefs.readingGuide;
        }
        if (prefs.speechEnabled) {
            CONFIG.SPEECH_ENABLED = prefs.speechEnabled;
        }
    }
    
    toggleTheme() {
        AppState.currentTheme = AppState.currentTheme === 'light' ? 'dark' : 'light';
        document.documentElement.setAttribute('data-theme', AppState.currentTheme);
        this.saveUserPreferences();
    }
    
    setFontSize(size) {
        AppState.fontSize = Math.max(12, Math.min(24, size));
        document.documentElement.style.fontSize = AppState.fontSize + 'px';
        $('#font-size-value').textContent = AppState.fontSize + 'px';
        $('#font-size-slider').value = AppState.fontSize;
        this.saveUserPreferences();
    }
    
    adjustFontSize(delta) {
        this.setFontSize(AppState.fontSize + delta);
    }
    
    openAccessibilityPanel() {
        $('#accessibility-panel').classList.add('open');
        $('#accessibility-panel').setAttribute('aria-hidden', 'false');
        $('#accessibility-title').focus();
    }
    
    closeAccessibilityPanel() {
        $('#accessibility-panel').classList.remove('open');
        $('#accessibility-panel').setAttribute('aria-hidden', 'true');
    }
    
    handleArrowKeyNavigation(e) {
        const focusableElements = Array.from(document.querySelectorAll(
            'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
        ));
        
        const currentIndex = focusableElements.indexOf(document.activeElement);
        let nextIndex;
        
        switch (e.key) {
            case 'ArrowDown':
            case 'ArrowRight':
                nextIndex = (currentIndex + 1) % focusableElements.length;
                break;
            case 'ArrowUp':
            case 'ArrowLeft':
                nextIndex = (currentIndex - 1 + focusableElements.length) % focusableElements.length;
                break;
        }
        
        if (nextIndex !== undefined) {
            e.preventDefault();
            focusableElements[nextIndex].focus();
        }
    }
}

// ===== DEMO CONTROLLER =====
class DemoController {
    constructor() {
        this.neuralNetwork = null;
        this.particleSystem = null;
        this.quantumWaves = null;
        this.currentDemo = 'neural';
        
        this.setupDemoButtons();
    }
    
    setupDemoButtons() {
        $$('.demo-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const action = e.target.getAttribute('data-action');
                this.switchDemo(action);
                this.updateFeedback(action);
            });
        });
    }
    
    switchDemo(demoType) {
        const canvas = $('#quantum-canvas');
        this.currentDemo = demoType;
        
        // Clear existing demo
        if (this.particleSystem || this.quantumWaves) {
            canvas.getContext('2d').clearRect(0, 0, canvas.width, canvas.height);
        }
        
        // Start new demo
        switch (demoType) {
            case 'particles':
                this.particleSystem = new ParticleSystem(canvas);
                this.particleSystem.animate();
                break;
            case 'waves':
                this.quantumWaves = new QuantumWaves(canvas);
                this.quantumWaves.animate();
                break;
            case 'neural':
                // Neural network is already running in hero section
                this.showNeuralInfo();
                break;
        }
    }
    
    updateFeedback(action) {
        const feedback = $('#demo-feedback');
        const messages = {
            particles: 'Floating particles respond to your mouse movement with gentle attraction forces.',
            waves: 'Quantum wave fields create ripples when you click. Move your mouse to influence the waves.',
            neural: 'The neural network in the hero section shows adaptive connections. Try moving your mouse over it!'
        };
        
        feedback.textContent = messages[action];
        
        // Announce for screen readers
        if (CONFIG.SPEECH_ENABLED) {
            setTimeout(() => {
                new AccessibilityManager().speak(messages[action]);
            }, 500);
        }
    }
    
    showNeuralInfo() {
        const canvas = $('#quantum-canvas');
        const ctx = canvas.getContext('2d');
        
        // Clear canvas
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Show info text
        ctx.fillStyle = '#6366f1';
        ctx.font = '24px Open Sans';
        ctx.textAlign = 'center';
        ctx.fillText('Check out the neural network', canvas.width / 2, canvas.height / 2 - 20);
        ctx.fillText('in the hero section above!', canvas.width / 2, canvas.height / 2 + 20);
    }
}

// ===== MAIN APPLICATION INITIALIZATION =====
class AllieDigitalApp {
    constructor() {
        this.accessibility = new AccessibilityManager();
        this.demoController = new DemoController();
        this.neuralNetwork = null;
        
        this.setupEventListeners();
        this.initializeComponents();
        this.setupIntersectionObserver();
    }
    
    setupEventListeners() {
        // Theme toggle
        $('#theme-toggle').addEventListener('click', () => {
            this.accessibility.toggleTheme();
        });
        
        // Accessibility panel
        $('#accessibility-btn').addEventListener('click', () => {
            this.accessibility.openAccessibilityPanel();
        });
        
        $('#close-accessibility').addEventListener('click', () => {
            this.accessibility.closeAccessibilityPanel();
        });
        
        // Speech toggle
        $('#speech-toggle').addEventListener('click', () => {
            CONFIG.SPEECH_ENABLED = !CONFIG.SPEECH_ENABLED;
            $('#speech-toggle .icon').textContent = CONFIG.SPEECH_ENABLED ? '🔊' : '🔇';
            this.accessibility.saveUserPreferences();
        });
        
        // Accessibility controls
        $('#font-size-slider').addEventListener('input', (e) => {
            this.accessibility.setFontSize(parseInt(e.target.value));
        });
        
        $('#contrast-toggle').addEventListener('change', (e) => {
            CONFIG.HIGH_CONTRAST = e.target.checked;
            document.documentElement.setAttribute('data-theme', 
                CONFIG.HIGH_CONTRAST ? 'high-contrast' : AppState.currentTheme);
            this.accessibility.saveUserPreferences();
        });
        
        $('#motion-toggle').addEventListener('change', (e) => {
            CONFIG.REDUCED_MOTION = e.target.checked;
            document.documentElement.style.setProperty('--transition-fast', 
                CONFIG.REDUCED_MOTION ? '0s' : '0.15s ease-in-out');
            this.accessibility.saveUserPreferences();
        });
        
        $('#reading-guide-toggle').addEventListener('change', (e) => {
            CONFIG.READING_GUIDE = e.target.checked;
            this.accessibility.saveUserPreferences();
        });
        
        // Action buttons
        $('#start-journey').addEventListener('click', () => {
            this.startLearningJourney();
        });
        
        $('#learn-more').addEventListener('click', () => {
            this.scrollToFeatures();
        });
        
        // Voice activation
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.key === ' ') {
                e.preventDefault();
                this.startVoiceRecognition();
            }
        });
    }
    
    initializeComponents() {
        // Initialize neural network
        const neuralCanvas = $('#neural-canvas');
        if (neuralCanvas) {
            this.neuralNetwork = new NeuralNetwork(neuralCanvas);
        }
        
        // Add animation classes to elements as they come into view
        this.setupAnimations();
        
        // Set up responsive canvas resizing
        window.addEventListener('resize', debounce(() => {
            this.handleResize();
        }, 250));
    }
    
    setupAnimations() {
        const animatedElements = $$('.feature-card, .community-card');
        animatedElements.forEach((el, index) => {
            el.style.opacity = '0';
            el.style.transform = 'translateY(30px)';
            el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            el.style.transitionDelay = `${index * 0.1}s`;
        });
    }
    
    setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                    
                    // Announce section for screen readers
                    if (CONFIG.SPEECH_ENABLED && entry.target.querySelector('h2')) {
                        const heading = entry.target.querySelector('h2').textContent;
                        setTimeout(() => {
                            this.accessibility.speak(`Entering section: ${heading}`);
                        }, 1000);
                    }
                }
            });
        }, { threshold: 0.1 });
        
        $$('section').forEach(section => observer.observe(section));
        $$('.feature-card, .community-card').forEach(card => observer.observe(card));
    }
    
    handleResize() {
        if (this.neuralNetwork) {
            this.neuralNetwork.setupCanvas();
        }
        if (this.demoController.particleSystem) {
            this.demoController.particleSystem.setupCanvas();
        }
        if (this.demoController.quantumWaves) {
            this.demoController.quantumWaves.setupCanvas();
        }
    }
    
    startLearningJourney() {
        // Simulate starting the learning journey
        this.accessibility.speak('Welcome to your personalized learning journey! Let me guide you through our features.');
        
        // Scroll to features section
        setTimeout(() => {
            this.scrollToFeatures();
        }, 2000);
        
        // Highlight neural network
        if (this.neuralNetwork) {
            this.neuralNetwork.triggerNetworkPulse();
        }
    }
    
    scrollToFeatures() {
        $('.features').scrollIntoView({ 
            behavior: CONFIG.REDUCED_MOTION ? 'auto' : 'smooth' 
        });
    }
    
    startVoiceRecognition() {
        if (AppState.speechRecognition) {
            this.accessibility.speak('Listening for voice command...');
            AppState.speechRecognition.start();
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    // Check for reduced motion preference
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        CONFIG.REDUCED_MOTION = true;
    }
    
    // Initialize the application
    const app = new AllieDigitalApp();
    
    // Global error handling
    window.addEventListener('error', (e) => {
        console.error('Application error:', e.error);
        // Fallback for accessibility
        if (CONFIG.SPEECH_ENABLED) {
            app.accessibility.speak('Sorry, there was an error. Please try refreshing the page.');
        }
    });
    
    // Service worker for offline functionality (if needed)
    if ('serviceWorker' in navigator) {
        navigator.serviceWorker.register('/sw.js').catch(err => {
            console.log('Service worker registration failed:', err);
        });
    }
    
    console.log('AllieDigital platform initialized successfully!');
});