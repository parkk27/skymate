// SkyMate Travel Assistant JavaScript

class SkyMateApp {
    constructor() {
        this.currentScreen = 'welcome-screen';
        this.userData = {
            name: 'Priya Sharma',
            type: 'Family Traveler',
            loyaltyNumber: '6E12345678',
            preferences: ['Family amenities', 'Security updates', 'Gate notifications']
        };
        
        this.flightData = {
            number: '6E203',
            airline: 'Indigo',
            departure: {
                airport: 'BLR',
                city: 'Bangalore',
                time: '17:40',
                gate: 'A17',
                terminal: 'Terminal 1'
            },
            arrival: {
                airport: 'BOM',
                city: 'Mumbai',
                time: '19:30'
            },
            status: 'On Time',
            boarding: '17:10',
            baggage: 'Carousel 3'
        };
        
        this.notifications = [
            {
                type: 'info',
                message: 'Gate changed to A17 (3 mins away)',
                time: '15 minutes ago',
                read: false
            },
            {
                type: 'security',
                message: 'Security wait time: 10-12 mins',
                time: '5 minutes ago',
                read: false
            },
            {
                type: 'weather',
                message: 'Clear weather, 27°C in Mumbai',
                time: '1 hour ago',
                read: false
            }
        ];
        
        this.amenities = [
            {
                id: 'indigo-lounge',
                name: 'IndiGo Lounge',
                type: 'Lounge',
                location: 'Gate A15',
                distance: '250m',
                waitTime: '5 min',
                features: ['Free WiFi', 'Beverages', 'Work Space'],
                access: 'Credit Card or Membership'
            },
            {
                id: 'chai-point',
                name: 'Chai Point',
                type: 'Restaurant',
                location: 'Gate A5',
                distance: '100m',
                rating: 4.2,
                cuisine: 'Indian Snacks'
            },
            {
                id: 'family-restroom',
                name: 'Family Restroom',
                type: 'Facilities',
                location: 'Near Security',
                distance: '40m',
                features: ['Baby changing', 'Family friendly']
            },
            {
                id: 'kids-play',
                name: 'Kids Play Area',
                type: 'Entertainment',
                location: 'Gate A10',
                distance: '150m',
                features: ['Safe play zone', 'Age 2-12']
            }
        ];
        
        this.chatMessages = [
            {
                type: 'assistant',
                content: "Hi Priya! I'm your SkyMate assistant. How can I help you today?",
                timestamp: new Date()
            }
        ];
        
        this.virtualQueue = {
            security: {
                currentWait: '18 min',
                availableSlots: ['16:00-16:15', '16:15-16:30', '16:30-16:45'],
                recommendation: '16:15-16:30',
                booked: null
            },
            checkin: {
                currentWait: '12 min',
                availableSlots: ['15:30-15:45', '15:45-16:00'],
                recommendation: '15:45-16:00',
                booked: null
            }
        };
    }
    
    init() {
        // Load saved data
        this.loadUserData();
        
        // Set up event listeners
        this.setupEventListeners();
        
        // Start real-time updates
        this.startRealtimeUpdates();
        
        // Initialize chat input
        this.initializeChatInput();
        
        // Initialize screen state
        this.initializeScreenState();
    }
    
    initializeScreenState() {
        // Ensure welcome screen is shown initially
        this.showScreen('welcome-screen');
    }
    
    loadUserData() {
        // In a real app, this would load from an API
        // For demo purposes, we'll use the sample data
        console.log('SkyMate initialized for:', this.userData.name);
    }
    
    setupEventListeners() {
        // Search functionality
        const searchInput = document.querySelector('.search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => this.filterAmenities(e.target.value));
        }
        
        // Category filters
        const categoryBtns = document.querySelectorAll('.category-btn');
        categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => this.filterByCategory(e.target.textContent));
        });
        
        // Chat input enter key
        const chatInput = document.getElementById('chat-input');
        if (chatInput) {
            chatInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    this.sendMessage();
                }
            });
        }
        
        // Settings toggles
        const toggles = document.querySelectorAll('.toggle input');
        toggles.forEach(toggle => {
            toggle.addEventListener('change', (e) => this.updateNotificationSetting(e));
        });
    }
    
    startRealtimeUpdates() {
        // Simulate real-time flight updates
        setInterval(() => {
            this.updateFlightStatus();
        }, 30000); // Update every 30 seconds
        
        // Update security wait times
        setInterval(() => {
            this.updateWaitTimes();
        }, 60000); // Update every minute
    }
    
    updateFlightStatus() {
        // Simulate random status updates
        const updates = [
            { type: 'gate', message: 'Gate confirmed: A17' },
            { type: 'boarding', message: 'Boarding starts in 45 minutes' },
            { type: 'weather', message: 'Weather update: Clear skies in Mumbai' }
        ];
        
        const randomUpdate = updates[Math.floor(Math.random() * updates.length)];
        console.log('Flight update:', randomUpdate.message);
        
        // In a real app, this would update the UI
        this.showToastNotification(randomUpdate.message);
    }
    
    updateWaitTimes() {
        // Simulate changing wait times
        const newWaitTime = Math.floor(Math.random() * 20) + 10;
        this.virtualQueue.security.currentWait = `${newWaitTime} min`;
        
        // Update UI if on virtual queue screen
        const waitTimeElement = document.querySelector('.wait-time');
        if (waitTimeElement && this.currentScreen === 'virtual-queue') {
            waitTimeElement.textContent = `${newWaitTime} min`;
        }
    }
    
    showToastNotification(message) {
        // Create toast notification
        const toast = document.createElement('div');
        toast.className = 'toast-notification';
        toast.textContent = message;
        toast.style.cssText = `
            position: fixed;
            top: 20px;
            left: 50%;
            transform: translateX(-50%);
            background: var(--color-primary);
            color: var(--color-btn-primary-text);
            padding: var(--space-12) var(--space-20);
            border-radius: var(--radius-base);
            z-index: 10000;
            opacity: 0;
            transition: opacity 0.3s ease;
        `;
        
        document.body.appendChild(toast);
        
        // Animate in
        requestAnimationFrame(() => {
            toast.style.opacity = '1';
        });
        
        // Remove after 3 seconds
        setTimeout(() => {
            toast.style.opacity = '0';
            setTimeout(() => {
                if (document.body.contains(toast)) {
                    document.body.removeChild(toast);
                }
            }, 300);
        }, 3000);
    }
    
    initializeChatInput() {
        const chatMessages = document.getElementById('chat-messages');
        if (chatMessages) {
            this.renderChatMessages();
        }
    }
    
    renderChatMessages() {
        const chatMessages = document.getElementById('chat-messages');
        if (!chatMessages) return;
        
        chatMessages.innerHTML = '';
        
        this.chatMessages.forEach(message => {
            const messageEl = document.createElement('div');
            messageEl.className = `message ${message.type}-message`;
            
            const avatar = document.createElement('div');
            avatar.className = 'message-avatar';
            avatar.textContent = message.type === 'assistant' ? '🤖' : '👤';
            
            const content = document.createElement('div');
            content.className = 'message-content';
            const p = document.createElement('p');
            p.textContent = message.content;
            content.appendChild(p);
            
            messageEl.appendChild(avatar);
            messageEl.appendChild(content);
            
            chatMessages.appendChild(messageEl);
        });
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }
    
    showScreen(screenId) {
        console.log(`Switching to screen: ${screenId}`);
        
        // Hide all screens
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        
        // Show target screen
        const targetScreen = document.getElementById(screenId);
        if (targetScreen) {
            targetScreen.classList.add('active');
            this.currentScreen = screenId;
        } else {
            console.error(`Screen with id "${screenId}" not found`);
            return;
        }
        
        // Update bottom navigation
        this.updateBottomNav(screenId);
        
        // Perform screen-specific actions
        switch(screenId) {
            case 'amenity-finder':
                this.renderAmenities();
                break;
            case 'assistant':
                this.renderChatMessages();
                break;
        }
    }
    
    updateBottomNav(screenId) {
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
        });
        
        // Map screens to nav items
        const navMap = {
            'dashboard': 0,
            'terminal-map': 1,
            'assistant': 2,
            'settings': 3
        };
        
        if (navMap.hasOwnProperty(screenId)) {
            const navItems = document.querySelectorAll('.nav-item');
            if (navItems[navMap[screenId]]) {
                navItems[navMap[screenId]].classList.add('active');
            }
        }
    }
    
    filterAmenities(query) {
        const filteredAmenities = this.amenities.filter(amenity => 
            amenity.name.toLowerCase().includes(query.toLowerCase()) ||
            amenity.type.toLowerCase().includes(query.toLowerCase()) ||
            (amenity.features && amenity.features.some(feature => 
                feature.toLowerCase().includes(query.toLowerCase())
            ))
        );
        
        this.renderAmenities(filteredAmenities);
    }
    
    filterByCategory(category) {
        // Update active category button
        document.querySelectorAll('.category-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        event.target.classList.add('active');
        
        let filteredAmenities;
        if (category === 'All') {
            filteredAmenities = this.amenities;
        } else {
            filteredAmenities = this.amenities.filter(amenity => {
                if (category === 'Food') return amenity.type === 'Restaurant';
                if (category === 'Lounge') return amenity.type === 'Lounge';
                if (category === 'Facilities') return amenity.type === 'Facilities';
                if (category === 'Kids') return amenity.type === 'Entertainment';
                return false;
            });
        }
        
        this.renderAmenities(filteredAmenities);
    }
    
    renderAmenities(amenities = this.amenities) {
        const amenityList = document.querySelector('.amenity-list');
        if (!amenityList) return;
        
        amenityList.innerHTML = '';
        
        amenities.forEach(amenity => {
            const amenityEl = document.createElement('div');
            amenityEl.className = 'amenity-card';
            
            let featuresHtml = '';
            if (amenity.features) {
                featuresHtml = `
                    <div class="amenity-features">
                        ${amenity.features.map(feature => `<span class="feature-tag">${feature}</span>`).join('')}
                    </div>
                `;
            }
            
            let ratingHtml = '';
            if (amenity.rating) {
                const stars = '★'.repeat(Math.floor(amenity.rating)) + '☆'.repeat(5 - Math.floor(amenity.rating));
                ratingHtml = `
                    <div class="amenity-rating">
                        <span class="rating-stars">${stars}</span>
                        <span class="rating-value">${amenity.rating}</span>
                    </div>
                `;
            }
            
            let additionalInfo = '';
            if (amenity.cuisine) {
                additionalInfo = `<p class="amenity-cuisine">${amenity.cuisine}</p>`;
            } else if (amenity.waitTime) {
                additionalInfo = `<p class="amenity-wait">Wait time: ${amenity.waitTime}</p>`;
            }
            
            amenityEl.innerHTML = `
                <div class="amenity-info">
                    <h3>${amenity.name}</h3>
                    <p class="amenity-location">${amenity.location} • ${amenity.distance} away</p>
                    ${featuresHtml}
                    ${ratingHtml}
                    ${additionalInfo}
                </div>
                <div class="amenity-actions">
                    <button class="btn btn--sm btn--primary" onclick="app.getDirections('${amenity.location}')">
                        Directions
                    </button>
                </div>
            `;
            
            amenityList.appendChild(amenityEl);
        });
    }
    
    updateNotificationSetting(event) {
        const setting = event.target.closest('.setting-item').querySelector('span').textContent;
        const enabled = event.target.checked;
        
        console.log(`${setting}: ${enabled ? 'enabled' : 'disabled'}`);
        
        // In a real app, this would save to user preferences
        this.showToastNotification(`${setting} notifications ${enabled ? 'enabled' : 'disabled'}`);
    }
    
    sendMessage() {
        const input = document.getElementById('chat-input');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.chatMessages.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        input.value = '';
        
        // Simulate assistant response
        setTimeout(() => {
            const response = this.generateAssistantResponse(message);
            this.chatMessages.push({
                type: 'assistant',
                content: response,
                timestamp: new Date()
            });
            this.renderChatMessages();
        }, 1000);
        
        this.renderChatMessages();
    }
    
    sendQuickMessage(message) {
        // Add user message
        this.chatMessages.push({
            type: 'user',
            content: message,
            timestamp: new Date()
        });
        
        // Generate and add response
        setTimeout(() => {
            const response = this.generateAssistantResponse(message);
            this.chatMessages.push({
                type: 'assistant',
                content: response,
                timestamp: new Date()
            });
            this.renderChatMessages();
        }, 1000);
        
        this.renderChatMessages();
    }
    
    generateAssistantResponse(userMessage) {
        const message = userMessage.toLowerCase();
        
        if (message.includes('gate')) {
            return `Your gate is A17 in Terminal 1. It's about a 3-minute walk from your current location. The gate is near the IndiGo Lounge.`;
        }
        
        if (message.includes('security')) {
            return `Current security wait time is ${this.virtualQueue.security.currentWait}. I can help you book a virtual queue slot to skip the line. Would you like me to book the recommended ${this.virtualQueue.security.recommendation} slot?`;
        }
        
        if (message.includes('food') || message.includes('restaurant')) {
            return `Near Gate A17, I recommend Chai Point (2 minutes away) for Indian snacks. There's also a family-friendly restaurant at Gate A12. Would you like directions to any of these?`;
        }
        
        if (message.includes('flight') || message.includes('status')) {
            return `Your flight 6E203 to Mumbai is on time. Departure is at 5:40 PM from Gate A17, boarding starts at 5:10 PM. Everything looks good for your journey!`;
        }
        
        if (message.includes('baggage')) {
            return `Your baggage pickup from Koramangala was completed at 2:30 PM and is now in transit. It will be delivered to Taj Hotel Mumbai within 90 minutes of your landing. Tracking ID: BLR12345`;
        }
        
        if (message.includes('wifi') || message.includes('internet')) {
            return `Free WiFi is available throughout Terminal 1. The network name is "BLR-FREE-WIFI". The IndiGo Lounge near your gate also has premium WiFi and comfortable seating.`;
        }
        
        if (message.includes('restroom') || message.includes('bathroom')) {
            return `The nearest family restroom is just 40m from your current location, near the security area. It has baby changing facilities and is family-friendly.`;
        }
        
        if (message.includes('kids') || message.includes('children')) {
            return `There's a great Kids Play Area at Gate A10, about 150m from your gate. It's a safe play zone for children aged 2-12. Perfect for keeping little ones entertained before the flight!`;
        }
        
        if (message.includes('lounge')) {
            return `The IndiGo Lounge is at Gate A15, just 250m from your gate A17. It offers free WiFi, beverages, and work space. Access is available with credit card or membership. Current wait time is about 5 minutes.`;
        }
        
        // Default response
        return `I understand you're asking about "${userMessage}". I'm here to help with flight information, airport navigation, amenities, and services. Is there anything specific about your journey I can assist with?`;
    }
    
    getDirections(location) {
        this.showToastNotification(`Getting directions to ${location}...`);
        
        // In a real app, this would integrate with indoor navigation
        setTimeout(() => {
            this.showScreen('terminal-map');
            this.showToastNotification(`Directions to ${location} displayed on map`);
        }, 1000);
    }
}

// Initialize the app
let app;

// Global navigation functions
function showDashboard() {
    console.log('showDashboard called');
    if (app) {
        app.showScreen('dashboard');
    }
}

function showFlightDetails() {
    console.log('showFlightDetails called');
    if (app) {
        app.showScreen('flight-details');
    }
}

function showTerminalMap() {
    console.log('showTerminalMap called');
    if (app) {
        app.showScreen('terminal-map');
    }
}

function showVirtualQueue() {
    console.log('showVirtualQueue called');
    if (app) {
        app.showScreen('virtual-queue');
    }
}

function showAmenityFinder() {
    console.log('showAmenityFinder called');
    if (app) {
        app.showScreen('amenity-finder');
    }
}

function showBaggageService() {
    console.log('showBaggageService called');
    if (app) {
        app.showScreen('baggage-service');
    }
}

function showAssistant() {
    console.log('showAssistant called');
    if (app) {
        app.showScreen('assistant');
    }
}

function showSettings() {
    console.log('showSettings called');
    if (app) {
        app.showScreen('settings');
    }
}

function showNotifications() {
    const modal = document.getElementById('notifications-panel');
    if (modal) {
        modal.classList.remove('hidden');
        
        // Mark notifications as read
        if (app) {
            app.notifications.forEach(notification => {
                notification.read = true;
            });
            
            // Update notification badge
            const badge = document.querySelector('.notification-badge');
            if (badge) {
                badge.style.display = 'none';
            }
        }
    }
}

function hideNotifications() {
    const modal = document.getElementById('notifications-panel');
    if (modal) {
        modal.classList.add('hidden');
    }
}

function bookSecuritySlot() {
    if (!app) return;
    
    const recommendedSlot = app.virtualQueue.security.recommendation;
    app.virtualQueue.security.booked = recommendedSlot;
    
    // Update UI
    const bookBtn = document.querySelector('#virtual-queue .btn--primary');
    if (bookBtn) {
        bookBtn.textContent = `Booked: ${recommendedSlot} ✓`;
        bookBtn.classList.remove('btn--primary');
        bookBtn.classList.add('btn--outline');
        bookBtn.disabled = true;
    }
    
    app.showToastNotification(`Security slot booked for ${recommendedSlot}`);
    
    // Add confirmation notification
    app.notifications.unshift({
        type: 'success',
        message: `Security slot confirmed: ${recommendedSlot}`,
        time: 'Just now',
        read: false
    });
    
    // Show notification badge
    const badge = document.querySelector('.notification-badge');
    if (badge) {
        badge.style.display = 'flex';
        badge.textContent = app.notifications.filter(n => !n.read).length;
    }
}

function getDirections(location) {
    if (app) {
        app.getDirections(location);
    }
}

function sendMessage() {
    if (app) {
        app.sendMessage();
    }
}

function sendQuickMessage(message) {
    if (app) {
        app.sendQuickMessage(message);
    }
}

// Close modal when clicking outside
document.addEventListener('click', (e) => {
    const modal = document.getElementById('notifications-panel');
    if (e.target === modal) {
        hideNotifications();
    }
});

// Handle preference tag clicks
document.addEventListener('click', (e) => {
    if (e.target.classList.contains('preference-tag')) {
        e.target.classList.toggle('active');
        
        const preference = e.target.textContent;
        const isActive = e.target.classList.contains('active');
        
        if (app) {
            app.showToastNotification(`${preference} ${isActive ? 'added to' : 'removed from'} preferences`);
        }
    }
});

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM loaded, initializing SkyMate app...');
    
    // Initialize the app
    app = new SkyMateApp();
    app.init();
    
    console.log('SkyMate app initialized successfully');
});