// Import restaurant data
import restaurants from '../data/restaurants.js';


// FAQ data for chatbot
const faqData = {
    'make reservation': 'Click on a restaurant card and select "Make Reservation". Choose your date, time, and number of guests.',
    'modify reservation': 'Visit your profile page to modify your existing reservations.',
    'cancel reservation': 'Go to your profile page and use the cancel option under your bookings.',
    'check status': 'Your reservation status can be viewed in the profile page under "My Reservations".',
    'table preference': 'You can specify your table preference in the special requests field while making a reservation.',
    'large group': 'For groups larger than 10 people, please contact the restaurant directly.'
};

// DOM Elements
const restaurantGrid = document.getElementById('restaurantGrid');
const chatbotButton = document.getElementById('chatbotButton');
const chatbotModal = new bootstrap.Modal(document.getElementById('chatbotModal'));
const chatMessages = document.getElementById('chatMessages');
const chatInput = document.getElementById('chatInput');
const sendMessage = document.getElementById('sendMessage');

// Authentication check
function checkAuth() {
    const isAuthenticated = localStorage.getItem('isAuthenticated') === 'true';
    if (!isAuthenticated) {
        window.location.href = '/login.html';
    }
}

// Filter restaurants based on search query
function filterRestaurants(query) {
    if (!query) return restaurants;
    query = query.toLowerCase();
    return restaurants.filter(restaurant => {
        const locationMatch = restaurant.location.toLowerCase().includes(query);
        const cuisineMatch = restaurant.cuisine.toLowerCase().includes(query);
        const dishMatch = restaurant.popularDishes.some(dish => 
            dish.toLowerCase().includes(query)
        );
        return locationMatch || cuisineMatch || dishMatch;
    });
}

// Display restaurants
function displayRestaurants(restaurantsToDisplay = restaurants) {
    restaurantGrid.innerHTML = restaurantsToDisplay.map(restaurant => `
        <div class="col-12 col-md-6 col-lg-4">
            <div class="card restaurant-card h-100" data-id="${restaurant.id}">
                <img src="${restaurant.image}" class="card-img-top" alt="${restaurant.name}">
                <div class="card-body">
                    <h5 class="card-title">${restaurant.name}</h5>
                    <span class="badge bg-primary cuisine-badge">
                        <i class="fas fa-utensils me-1"></i>${restaurant.cuisine}
                    </span>
                    <p class="card-text">
                        <i class="fas fa-map-marker-alt me-1"></i>${restaurant.location}
                    </p>
                    <div class="restaurant-details" id="details-${restaurant.id}">
                        <h6 class="text-primary">Popular Dishes</h6>
                        <div class="mb-3">
                            ${restaurant.popularDishes.map(dish => 
                                `<span class="dish-chip">${dish}</span>`
                            ).join('')}
                        </div>
                        <a href="/reservation.html?id=${restaurant.id}" class="btn btn-primary w-100">
                            <i class="fas fa-clock me-1"></i>Make Reservation
                        </a>
                    </div>
                </div>
            </div>
        </div>
    `).join('');

    // Add click handlers to restaurant cards
    document.querySelectorAll('.restaurant-card').forEach(card => {
        card.addEventListener('click', () => {
            const details = document.getElementById(`details-${card.dataset.id}`);
            details.classList.toggle('show');
        });
    });
}

// Chatbot functionality
function addChatMessage(message, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}`;
    messageDiv.textContent = message;
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function handleChatbotResponse(query) {
    const response = findResponse(query.toLowerCase());
    setTimeout(() => addChatMessage(response, 'bot'), 500);
}

function findResponse(query) {
    const matchingKey = Object.keys(faqData).find(key => query.includes(key));
    return matchingKey
        ? faqData[matchingKey]
        : 'I apologize, but I don\'t have information about that. Please try asking about reservations, restaurant timings, or special requests.';
}

// Event Listeners
chatbotButton.addEventListener('click', () => chatbotModal.show());

sendMessage.addEventListener('click', () => {
    const message = chatInput.value.trim();
    if (message) {
        addChatMessage(message, 'user');
        handleChatbotResponse(message);
        chatInput.value = '';
    }
});

chatInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage.click();
    }
});

// Handle search
function handleSearch(e) {
    e.preventDefault();
    const searchQuery = document.getElementById('searchInput').value.trim();
    const filteredRestaurants = filterRestaurants(searchQuery);
    displayRestaurants(filteredRestaurants);
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    checkAuth();
    displayRestaurants();
    // Add initial chatbot message
    addChatMessage('Hi! How can I help you today?', 'bot');
    
    // Add search event listener
    document.getElementById('searchForm').addEventListener('submit', handleSearch);
    document.getElementById('searchInput').addEventListener('input', (e) => {
        const searchQuery = e.target.value.trim();
        const filteredRestaurants = filterRestaurants(searchQuery);
        displayRestaurants(filteredRestaurants);
    });
});