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

// Logo animation variables
let logoFloatY = 0;
let logoRotation = 0;
let gradientPosition = 0;

// Global state management
const AppState = {
    currentTheme: 'light',
    fontSize: 16,
    animations: [],
    speechSynthesis: null,
    speechRecognition: null,
    currentDemo: null,
    quizResults: {}
};

// Quiz Implementation
const quizQuestions = [
    {
        question: "How do you prefer to absorb new information?",
        options: [
            { text: "Visual diagrams and infographics", type: "visual" },
            { text: "Listening to explanations or discussions", type: "auditory" },
            { text: "Hands-on practice and experimentation", type: "kinesthetic" },
            { text: "Reading detailed written explanations", type: "reading" }
        ]
    },
    {
        question: "What helps you maintain focus during learning?",
        options: [
            { text: "Frequent breaks and movement", type: "adhd" },
            { text: "Clear structure and predictable routines", type: "autism" },
            { text: "Minimal distractions and quiet environment", type: "sensory" },
            { text: "Interactive and engaging content", type: "engagement" }
        ]
    },
    {
        question: "How do you prefer to demonstrate understanding?",
        options: [
            { text: "Multiple choice or structured formats", type: "structured" },
            { text: "Creative projects and presentations", type: "creative" },
            { text: "Verbal explanations or discussions", type: "verbal" },
            { text: "Written reports or essays", type: "written" }
        ]
    },
    {
        question: "What's your ideal learning pace?",
        options: [
            { text: "Self-paced with flexibility to revisit", type: "flexible" },
            { text: "Structured timeline with clear milestones", type: "structured" },
            { text: "Intensive bursts with breaks between", type: "intensive" },
            { text: "Steady, consistent daily progress", type: "consistent" }
        ]
    },
    {
        question: "Which environment helps you learn best?",
        options: [
            { text: "Quiet, organized space with minimal stimulation", type: "calm" },
            { text: "Collaborative spaces with peer interaction", type: "social" },
            { text: "Flexible spaces where I can move around", type: "mobile" },
            { text: "Technology-rich environment with digital tools", type: "digital" }
        ]
    },
    {
        question: "How do you process complex information?",
        options: [
            { text: "Break it into smaller, manageable chunks", type: "chunked" },
            { text: "See the big picture first, then details", type: "holistic" },
            { text: "Work through step-by-step sequences", type: "sequential" },
            { text: "Connect it to existing knowledge", type: "connected" }
        ]
    },
    {
        question: "What motivates you most in learning?",
        options: [
            { text: "Clear progress tracking and achievements", type: "progress" },
            { text: "Real-world applications and relevance", type: "practical" },
            { text: "Personal interest and curiosity", type: "intrinsic" },
            { text: "Support and encouragement from others", type: "social_support" }
        ]
    },
    {
        question: "How do you handle new challenges?",
        options: [
            { text: "Take time to plan and prepare thoroughly", type: "methodical" },
            { text: "Jump in and learn by doing", type: "experimental" },
            { text: "Seek guidance and support from mentors", type: "guided" },
            { text: "Research extensively before starting", type: "research" }
        ]
    }
];

const quizRecommendations = {
    visual: {
        title: "Visual Learner",
        description: "You learn best through diagrams, charts, and visual representations.",
        recommendations: ["Mind mapping tools", "Infographic summaries", "Video content", "Color-coded materials"]
    },
    auditory: {
        title: "Auditory Learner",
        description: "You process information effectively through listening and discussion.",
        recommendations: ["Audio lectures", "Discussion groups", "Voice recordings", "Music-based learning"]
    },
    kinesthetic: {
        title: "Kinesthetic Learner",
        description: "You learn through hands-on experience and physical activity.",
        recommendations: ["Interactive simulations", "Physical models", "Movement breaks", "Practical exercises"]
    },
    reading: {
        title: "Reading/Writing Learner",
        description: "You prefer text-based learning and written communication.",
        recommendations: ["Detailed notes", "Written summaries", "Text-based resources", "Journaling exercises"]
    },
    adhd: {
        title: "ADHD-Friendly Approach",
        description: "You benefit from movement, breaks, and engaging content.",
        recommendations: ["Pomodoro technique", "Fidget tools", "Gamified learning", "Regular movement breaks"]
    },
    autism: {
        title: "Autism-Friendly Approach",
        description: "You thrive with structure, predictability, and clear expectations.",
        recommendations: ["Detailed schedules", "Visual timetables", "Sensory accommodations", "Clear instructions"]
    },
    sensory: {
        title: "Sensory-Sensitive Approach",
        description: "You need controlled environments with minimal sensory overload.",
        recommendations: ["Noise-cancelling headphones", "Adjustable lighting", "Calm spaces", "Sensory breaks"]
    }
};

class QuizManager {
    constructor() {
        this.currentQuestion = 0;
        this.answers = [];
        this.results = {};
        this.isActive = false;
    }

    init() {
        this.createQuizUI();
        this.bindEvents();
    }

    createQuizUI() {
        const quizHTML = `
            <div id="quiz-container" class="quiz-container" aria-hidden="true">
                <div class="quiz-content">
                    <div class="quiz-header">
                        <h2>Learning Style Assessment</h2>
                        <p>Discover your personalised learning preferences</p>
                        <div class="quiz-progress">
                            <div class="progress-bar">
                                <div class="progress-fill" id="quiz-progress"></div>
                            </div>
                            <span class="progress-text" id="progress-text">Question 1 of ${quizQuestions.length}</span>
                        </div>
                    </div>
                    
                    <div class="quiz-body" id="quiz-body">
                        <div class="question-container" id="question-container">
                            <!-- Questions will be populated here -->
                        </div>
                    </div>
                    
                    <div class="quiz-controls">
                        <button id="quiz-prev" class="btn-secondary" disabled>Previous</button>
                        <button id="quiz-next" class="btn-primary" disabled>Next</button>
                        <button id="quiz-submit" class="btn-primary" style="display: none;">View Results</button>
                    </div>
                    
                    <button id="quiz-close" class="quiz-close" aria-label="Close quiz">×</button>
                </div>
            </div>
            
            <div id="quiz-results" class="quiz-results" aria-hidden="true">
                <div class="results-content">
                    <div class="results-header">
                        <h2>Your Learning Profile</h2>
                        <p>Based on your responses, here are your personalised recommendations</p>
                    </div>
                    
                    <div class="results-body" id="results-body">
                        <!-- Results will be populated here -->
                    </div>
                    
                    <div class="results-actions">
                        <button id="retake-quiz" class="btn-secondary">Retake Assessment</button>
                        <button id="save-results" class="btn-primary">Save My Profile</button>
                        <button id="close-results" class="btn-secondary">Close</button>
                    </div>
                </div>
            </div>
        `;

        document.body.insertAdjacentHTML('beforeend', quizHTML);
    }

    bindEvents() {
        $('#learn-more')?.addEventListener('click', () => this.startQuiz());
        $('#quiz-close')?.addEventListener('click', () => this.closeQuiz());
        $('#quiz-prev')?.addEventListener('click', () => this.previousQuestion());
        $('#quiz-next')?.addEventListener('click', () => this.nextQuestion());
        $('#quiz-submit')?.addEventListener('click', () => this.showResults());
        $('#retake-quiz')?.addEventListener('click', () => this.restartQuiz());
        $('#save-results')?.addEventListener('click', () => this.saveResults());
        $('#close-results')?.addEventListener('click', () => this.closeResults());

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (this.isActive) {
                if (e.key === 'Escape') {
                    this.closeQuiz();
                } else if (e.key === 'ArrowLeft' && !$('#quiz-prev').disabled) {
                    this.previousQuestion();
                } else if (e.key === 'ArrowRight' && !$('#quiz-next').disabled) {
                    this.nextQuestion();
                }
            }
        });
    }

    startQuiz() {
        this.isActive = true;
        this.currentQuestion = 0;
        this.answers = [];
        $('#quiz-container').style.display = 'flex';
        $('#quiz-container').setAttribute('aria-hidden', 'false');
        this.displayQuestion();
        
        // Accessibility announcement
        this.announceToScreenReader('Learning style assessment started. Navigate through questions using the Previous and Next buttons or arrow keys.');
    }

    displayQuestion() {
        const question = quizQuestions[this.currentQuestion];
        const container = $('#question-container');
        
        container.innerHTML = `
            <div class="question">
                <h3>${question.question}</h3>
                <div class="options" role="radiogroup" aria-labelledby="question-${this.currentQuestion}">
                    ${question.options.map((option, index) => `
                        <label class="option-label">
                            <input type="radio" 
                                   name="question-${this.currentQuestion}" 
                                   value="${option.type}" 
                                   id="option-${this.currentQuestion}-${index}"
                                   aria-describedby="question-${this.currentQuestion}">
                            <span class="option-text">${option.text}</span>
                        </label>
                    `).join('')}
                </div>
            </div>
        `;

        // Update progress
        const progress = ((this.currentQuestion + 1) / quizQuestions.length) * 100;
        $('#quiz-progress').style.width = progress + '%';
        $('#progress-text').textContent = `Question ${this.currentQuestion + 1} of ${quizQuestions.length}`;

        // Update controls
        $('#quiz-prev').disabled = this.currentQuestion === 0;
        $('#quiz-next').style.display = this.currentQuestion === quizQuestions.length - 1 ? 'none' : 'inline-block';
        $('#quiz-submit').style.display = this.currentQuestion === quizQuestions.length - 1 ? 'inline-block' : 'none';

        // Restore previous answer if exists
        if (this.answers[this.currentQuestion]) {
            const input = container.querySelector(`input[value="${this.answers[this.currentQuestion]}"]`);
            if (input) input.checked = true;
            this.updateNextButton();
        } else {
            $('#quiz-next').disabled = true;
            $('#quiz-submit').disabled = true;
        }

        // Bind option change events
        container.querySelectorAll('input[type="radio"]').forEach(input => {
            input.addEventListener('change', () => {
                this.answers[this.currentQuestion] = input.value;
                this.updateNextButton();
            });
        });
    }

    updateNextButton() {
        const hasAnswer = this.answers[this.currentQuestion] !== undefined;
        $('#quiz-next').disabled = !hasAnswer;
        $('#quiz-submit').disabled = !hasAnswer;
    }

    previousQuestion() {
        if (this.currentQuestion > 0) {
            this.currentQuestion--;
            this.displayQuestion();
        }
    }

    nextQuestion() {
        if (this.currentQuestion < quizQuestions.length - 1) {
            this.currentQuestion++;
            this.displayQuestion();
        }
    }

    calculateResults() {
        const typeCounts = {};
        
        this.answers.forEach(answer => {
            typeCounts[answer] = (typeCounts[answer] || 0) + 1;
        });

        // Find dominant types
        const sortedTypes = Object.entries(typeCounts)
            .sort(([,a], [,b]) => b - a)
            .slice(0, 3);

        return sortedTypes.map(([type, count]) => ({
            type,
            count,
            percentage: (count / this.answers.length) * 100,
            ...quizRecommendations[type]
        }));
    }

    showResults() {
        this.results = this.calculateResults();
        AppState.quizResults = this.results;
        
        $('#quiz-container').style.display = 'none';
        $('#quiz-container').setAttribute('aria-hidden', 'true');
        
        const resultsBody = $('#results-body');
        resultsBody.innerHTML = this.results.map(result => `
            <div class="result-card">
                <div class="result-header">
                    <h3>${result.title}</h3>
                    <div class="result-percentage">${Math.round(result.percentage)}%</div>
                </div>
                <p class="result-description">${result.description}</p>
                <div class="recommendations">
                    <h4>Recommendations for you:</h4>
                    <ul>
                        ${result.recommendations.map(rec => `<li>${rec}</li>`).join('')}
                    </ul>
                </div>
            </div>
        `).join('');

        $('#quiz-results').style.display = 'flex';
        $('#quiz-results').setAttribute('aria-hidden', 'false');
        
        this.announceToScreenReader('Quiz completed. Your personalised learning profile is ready.');
    }

    saveResults() {
        try {
            localStorage.setItem('allieDigitalQuizResults', JSON.stringify(this.results));
            localStorage.setItem('allieDigitalQuizDate', new Date().toISOString());
            this.announceToScreenReader('Your learning profile has been saved successfully.');
            
            // Visual feedback
            const saveButton = $('#save-results');
            const originalText = saveButton.textContent;
            saveButton.textContent = 'Saved!';
            saveButton.disabled = true;
            
            setTimeout(() => {
                saveButton.textContent = originalText;
                saveButton.disabled = false;
            }, 2000);
        } catch (error) {
            console.error('Failed to save quiz results:', error);
            this.announceToScreenReader('Failed to save results. Please try again.');
        }
    }

    restartQuiz() {
        this.closeResults();
        this.startQuiz();
    }

    closeQuiz() {
        this.isActive = false;
        $('#quiz-container').style.display = 'none';
        $('#quiz-container').setAttribute('aria-hidden', 'true');
    }

    closeResults() {
        $('#quiz-results').style.display = 'none';
        $('#quiz-results').setAttribute('aria-hidden', 'true');
    }

    announceToScreenReader(message) {
        // Create a temporary element for screen reader announcements
        const announcement = document.createElement('div');
        announcement.setAttribute('aria-live', 'polite');
        announcement.setAttribute('aria-atomic', 'true');
        announcement.className = 'sr-only';
        announcement.textContent = message;
        
        document.body.appendChild(announcement);
        
        setTimeout(() => {
            document.body.removeChild(announcement);
        }, 1000);
    }
}

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
        this.initializeLogoAnimation();
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
            
            // Dispatch event for logo animation
            document.dispatchEvent(new CustomEvent('motionPreferenceChanged'));
            
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
        this.accessibility.speak('Welcome to your personalised learning journey! Let me guide you through our features.');
        
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
    
    initializeLogoAnimation() {
        // Initialize logo animation if motion is not reduced
        if (!CONFIG.REDUCED_MOTION) {
            this.animateLogo();
        }
        
        // Update logo animation when motion preference changes
        document.addEventListener('motionPreferenceChanged', () => {
            if (CONFIG.REDUCED_MOTION) {
                this.resetLogoAnimation();
            } else {
                this.animateLogo();
            }
        });
    }
    
    animateLogo() {
        const logoElement = $('.nav-brand h1');
        if (!logoElement) return;
        
        const animate = () => {
            if (CONFIG.REDUCED_MOTION) return;
            
            // Update animation variables
            logoFloatY += 0.02;
            logoRotation += 0.005;
            gradientPosition += 0.01;
            
            // Apply floating animation
            const floatOffset = Math.sin(logoFloatY) * 3;
            const rotateOffset = Math.sin(logoRotation) * 2;
            
            // Apply transforms
            logoElement.style.transform = `translateY(${floatOffset}px) rotate(${rotateOffset}deg)`;
            
            // Apply gradient animation
            const gradientAngle = (gradientPosition * 180) % 360;
            logoElement.style.background = `linear-gradient(${gradientAngle}deg, var(--primary-color) 0%, var(--secondary-color) 50%, var(--accent-color) 100%)`;
            logoElement.style.webkitBackgroundClip = 'text';
            logoElement.style.webkitTextFillColor = 'transparent';
            logoElement.style.backgroundClip = 'text';
            
            requestAnimationFrame(animate);
        };
        
        animate();
    }
    
    resetLogoAnimation() {
        const logoElement = $('.nav-brand h1');
        if (!logoElement) return;
        
        // Reset animation variables
        logoFloatY = 0;
        logoRotation = 0;
        gradientPosition = 0;
        
        // Reset styles
        logoElement.style.transform = '';
        logoElement.style.background = '';
        logoElement.style.webkitBackgroundClip = '';
        logoElement.style.webkitTextFillColor = '';
        logoElement.style.backgroundClip = '';
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
    
    // Initialize quiz manager
    const quizManager = new QuizManager();
    quizManager.init();
    
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
    
    console.log('Allie Digital platform with quiz functionality initialized successfully!');
});