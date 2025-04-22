// Image Carousel Module for Restaurant Cards

const UNSPLASH_API_KEY = 'Ow_QGxGpVZEPXKKxXpylGtIZhF9xAJkGqFVYqAGvPGc'; // Unsplash API key
const IMAGES_PER_RESTAURANT = 5;

// Cache for storing fetched images
const imageCache = new Map();

// Fetch images from Unsplash for a restaurant
async function fetchRestaurantImages(restaurant) {
    if (imageCache.has(restaurant.id)) {
        return imageCache.get(restaurant.id);
    }

    try {
        const query = `${restaurant.cuisine} restaurant food`;
        const response = await fetch(
            `https://api.unsplash.com/search/photos?query=${encodeURIComponent(query)}&per_page=${IMAGES_PER_RESTAURANT}`,
            {
                headers: {
                    'Authorization': `Client-ID ${UNSPLASH_API_KEY}`
                }
            }
        );

        if (!response.ok) throw new Error('Failed to fetch images');

        const data = await response.json();
        const images = data.results.map(result => result.urls.regular);
        imageCache.set(restaurant.id, images);
        return images;
    } catch (error) {
        console.error('Error fetching images:', error);
        return [restaurant.image]; // Fallback to original image
    }
}

// Initialize carousel for a restaurant card
function initializeCarousel(cardElement, restaurant) {
    const imgElement = cardElement.querySelector('.card-img-top');
    let currentImageIndex = 0;
    let images = [restaurant.image];
    let isTransitioning = false;
    let preloadedImages = [];

    // Create carousel controls
    const prevButton = document.createElement('button');
    prevButton.className = 'carousel-control prev';
    prevButton.innerHTML = '❮';
    
    const nextButton = document.createElement('button');
    nextButton.className = 'carousel-control next';
    nextButton.innerHTML = '❯';

    // Add controls to card
    const imageContainer = cardElement.querySelector('.card-img-top').parentElement;
    imageContainer.style.position = 'relative';
    imageContainer.appendChild(prevButton);
    imageContainer.appendChild(nextButton);

    // Load and preload images from Unsplash
    fetchRestaurantImages(restaurant).then(fetchedImages => {
        images = fetchedImages;
        if (images.length > 1) {
            // Preload all images
            preloadedImages = images.map(src => {
                const img = new Image();
                img.src = src;
                return img;
            });
            prevButton.style.display = 'block';
            nextButton.style.display = 'block';
            // Start automatic rotation after images are loaded
            Promise.all(preloadedImages.map(img => {
                return new Promise((resolve) => {
                    if (img.complete) resolve();
                    else img.onload = resolve;
                });
            })).then(() => {
                intervalId = startAutoRotation();
                // Show first image immediately
                showImage(0);
            });
        }
    });

    // Handle image navigation with smooth transition
    function showImage(index, direction = 'next') {
        if (isTransitioning || index === currentImageIndex) return;
        isTransitioning = true;

        const newImage = preloadedImages[index];
        if (!newImage) return;

        imgElement.style.transform = direction === 'next' ? 'translateX(100%)' : 'translateX(-100%)';
        imgElement.style.opacity = '0';
        
        setTimeout(() => {
            currentImageIndex = index;
            imgElement.src = newImage.src;
            imgElement.style.transform = 'translateX(0)';
            imgElement.style.opacity = '1';
            setTimeout(() => {
                isTransitioning = false;
            }, 300);
        }, 300); // Match this with CSS transition duration
    }

    function startAutoRotation() {
        return setInterval(() => {
            if (!isTransitioning) {
                const nextIndex = (currentImageIndex + 1) % images.length;
                showImage(nextIndex, 'next');
            }
        }, 5000);
    }

    prevButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isTransitioning) {
            const prevIndex = (currentImageIndex - 1 + images.length) % images.length;
            showImage(prevIndex, 'prev');
        }
    });

    nextButton.addEventListener('click', (e) => {
        e.preventDefault();
        if (!isTransitioning) {
            const nextIndex = (currentImageIndex + 1) % images.length;
            showImage(nextIndex, 'next');
        }
    });

    let intervalId = null;

    // Pause rotation on hover
    cardElement.addEventListener('mouseenter', () => {
        if (intervalId) clearInterval(intervalId);
    });
    
    cardElement.addEventListener('mouseleave', () => {
        if (intervalId) clearInterval(intervalId);
        intervalId = startAutoRotation();
    });
}

export { initializeCarousel };