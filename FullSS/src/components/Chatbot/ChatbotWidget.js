// ChatbotWidget.js
import { restaurants } from '../../data/restaurants.js';

class ChatbotWidget {
    constructor() {
        this.createChatbotUI();
        this.isOpen = false;
    }

    createChatbotUI() {
        // Create floating button
        const floatingBtn = document.createElement('button');
        floatingBtn.className = 'chatbot-btn';
        floatingBtn.innerHTML = '<i class="fas fa-comments"></i>';
        document.body.appendChild(floatingBtn);

        // Create chat container
        const chatContainer = document.createElement('div');
        chatContainer.className = 'chatbot-container';
        chatContainer.style.display = 'none';
        chatContainer.innerHTML = `
            <div class="chatbot-header">
                <h5>DineEase Assistant</h5>
                <button class="close-btn"><i class="fas fa-times"></i></button>
            </div>
            <div class="chatbot-messages"></div>
            <div class="chatbot-input">
                <input type="text" placeholder="Ask about restaurants, cuisines, or areas...">
                <button><i class="fas fa-paper-plane"></i></button>
            </div>
        `;
        document.body.appendChild(chatContainer);

        // Add event listeners
        floatingBtn.addEventListener('click', () => this.toggleChat());
        chatContainer.querySelector('.close-btn').addEventListener('click', () => this.toggleChat());
        chatContainer.querySelector('.chatbot-input button').addEventListener('click', () => this.handleUserInput());
        chatContainer.querySelector('.chatbot-input input').addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.handleUserInput();
        });
    }

    toggleChat() {
        const chatContainer = document.querySelector('.chatbot-container');
        this.isOpen = !this.isOpen;
        chatContainer.style.display = this.isOpen ? 'flex' : 'none';
        if (this.isOpen) {
            this.addMessage('bot', 'Hello! I can help you find restaurants based on area and cuisine. What are you looking for?');
        }
    }

    addMessage(sender, text) {
        const messagesContainer = document.querySelector('.chatbot-messages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        messageDiv.textContent = text;
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
    }

    handleUserInput() {
        const input = document.querySelector('.chatbot-input input');
        const userMessage = input.value.trim();
        if (!userMessage) return;

        this.addMessage('user', userMessage);
        input.value = '';

        // Process user input and generate response
        const response = this.processUserInput(userMessage.toLowerCase());
        setTimeout(() => this.addMessage('bot', response), 500);
    }

    processUserInput(input) {
        // Store conversation context
        if (!this.context) this.context = { lastQuery: null, lastRestaurants: null };

        // Handle greetings
        if (input.match(/\b(hi|hello|hey)\b/i)) {
            this.context = { lastQuery: 'greeting', lastRestaurants: null };
            return "Hello! I can help you find restaurants. You can ask about specific locations, cuisines, or popular dishes!";
        }

        // Handle follow-up questions about previous restaurants
        if (this.context.lastRestaurants && input.match(/\b(yes|tell me more|more info|about these)\b/i)) {
            const restaurantDetails = this.context.lastRestaurants
                .map(r => `${r.name}: ${r.popularDishes.join(', ')} (Rating: ${r.rating}/5)`)
                .join('\n');
            return `Here are more details about those restaurants:\n${restaurantDetails}`;
        }

        // Handle location queries with improved context
        const locations = restaurants.map(r => r.location.toLowerCase());
        for (const location of locations) {
            if (input.includes(location.toLowerCase())) {
                const matchingRestaurants = restaurants.filter(r => 
                    r.location.toLowerCase() === location.toLowerCase()
                );
                this.context = { lastQuery: 'location', lastRestaurants: matchingRestaurants };
                return `In ${location}, you can find: ${matchingRestaurants.map(r => r.name).join(', ')}. Would you like to know more about these restaurants?`;
            }
        }

        // Handle cuisine queries with context awareness
        const cuisines = [...new Set(restaurants.map(r => r.cuisine.toLowerCase()))];
        for (const cuisine of cuisines) {
            if (input.includes(cuisine.toLowerCase())) {
                const matchingRestaurants = restaurants.filter(r => 
                    r.cuisine.toLowerCase() === cuisine.toLowerCase()
                );
                this.context = { lastQuery: 'cuisine', lastRestaurants: matchingRestaurants };
                const response = `For ${cuisine} cuisine, I recommend: ${matchingRestaurants.map(r => r.name).join(', ')}. `;
                return response + 'Would you like to know their popular dishes and ratings?';
            }
        }

        // Handle dish queries with enhanced context
        const allDishes = restaurants.reduce((dishes, restaurant) => {
            return dishes.concat(restaurant.popularDishes.map(dish => ({ dish, restaurant })));
        }, []);

        for (const {dish, restaurant} of allDishes) {
            if (input.includes(dish.toLowerCase())) {
                this.context = { lastQuery: 'dish', lastRestaurants: [restaurant] };
                return `${dish} is a popular dish at ${restaurant.name} (${restaurant.cuisine} restaurant in ${restaurant.location}, Rating: ${restaurant.rating}/5). Would you like to make a reservation or know about other dishes they serve?`;
            }
        }

        // Handle reservation intent
        if (input.match(/\b(reserve|reservation|book|booking)\b/i) && this.context.lastRestaurants) {
            const restaurant = this.context.lastRestaurants[0];
            return `Great choice! You can make a reservation at ${restaurant.name} by clicking the 'Make Reservation' button on their card, or visit directly at ${restaurant.location}.`;
        }

        // Default response with context-aware suggestions
        const randomCuisine = cuisines[Math.floor(Math.random() * cuisines.length)];
        const randomLocation = locations[Math.floor(Math.random() * locations.length)];
        return `I can help you find restaurants by location, cuisine type, or specific dishes. For example, try asking about ${randomCuisine} cuisine or restaurants in ${randomLocation}.`;
    }
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatbotWidget();
});