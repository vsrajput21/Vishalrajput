// DOM Elements
const header = document.getElementById('header');
const hamburger = document.querySelector('.hamburger');
const navbar = document.querySelector('.navbar');
const navLinks = document.querySelectorAll('.navbar a');
const skillProgress = document.querySelectorAll('.skill-progress');
const filterItems = document.querySelectorAll('.filter-item');
const portfolioItems = document.querySelectorAll('.portfolio-item');
const dots = document.querySelectorAll('.dot');
const testimonialItems = document.querySelectorAll('.testimonial-item');
const testimonialSlider = document.querySelector('.testimonial-slider');
const contactForm = document.getElementById('contactForm');

// Helper Functions
function isInViewport(element) {
    const rect = element.getBoundingClientRect();
    return (
        rect.top <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.bottom >= 0
    );
}

// Sticky Header with class
window.addEventListener('scroll', () => {
    if (window.scrollY > 100) {
        header.style.padding = '0.5rem 0';
        header.classList.add('scrolled');
    } else {
        header.style.padding = '1rem 0';
        header.classList.remove('scrolled');
    }
});

// Mobile Navigation Toggle
hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navbar.classList.toggle('active');
});

// Close mobile menu when clicking a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        navbar.classList.remove('active');
    });
});

// Active navigation on scroll
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY;

    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        const sectionHeight = section.clientHeight;
        const sectionId = section.getAttribute('id');

        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
});

// Animate skill bars and circles when in viewport using Intersection Observer
const skillsSection = document.getElementById('skills');
const skillCircles = document.querySelectorAll('.skill-circle');

const animateSkillsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Animate skill bars
            skillProgress.forEach(progress => {
                // Store original width if not already stored
                if (!progress.dataset.originalWidth) {
                    const originalWidth = progress.getAttribute('style').split('width:')[1].split(';')[0].trim();
                    progress.dataset.originalWidth = originalWidth;
                }
                
                // Animate from 0 to original width
                progress.style.width = "0";
                setTimeout(() => {
                    progress.style.width = progress.dataset.originalWidth;
                }, 200);
            });
            
            // Reset and restart circle animations
            skillCircles.forEach(circle => {
                const maskFull = circle.querySelector('.mask.full');
                const fill = circle.querySelector('.fill');
                
                // Reset animation
                maskFull.style.animation = 'none';
                fill.style.animation = 'none';
                
                // Trigger reflow
                void maskFull.offsetWidth;
                void fill.offsetWidth;
                
                // Restart animation
                maskFull.style.animation = 'fill 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
                fill.style.animation = 'fill 2s cubic-bezier(0.34, 1.56, 0.64, 1) forwards';
            });
            
            // Set CSS var --rotation on mask.full and fill based on percentage
            skillCircles.forEach(circle => {
                const percent = parseFloat(circle.querySelector('.inside-circle').textContent);
                const rotation = (percent / 100) * 360;
                circle.querySelectorAll('.mask.full, .fill').forEach(el => el.style.setProperty('--rotation', `${rotation}deg`));
            });
            
            // Don't unobserve - we want the animation to trigger again when scrolling back
            // This ensures the skill bars remain visible when scrolling
        }
    });
}, { threshold: 0.2 });

// Observe skills section
if (skillsSection) {
    animateSkillsObserver.observe(skillsSection);
}

// Portfolio filtering
filterItems.forEach(item => {
    item.addEventListener('click', () => {
        // Update active state
        filterItems.forEach(filter => filter.classList.remove('active'));
        item.classList.add('active');

        // Filter items
        const filterValue = item.getAttribute('data-filter');
        
        portfolioItems.forEach(portfolioItem => {
            if (filterValue === 'all' || portfolioItem.getAttribute('data-category') === filterValue) {
                portfolioItem.style.display = 'block';
                setTimeout(() => {
                    portfolioItem.style.opacity = '1';
                    portfolioItem.style.transform = 'scale(1)';
                }, 100);
            } else {
                portfolioItem.style.opacity = '0';
                portfolioItem.style.transform = 'scale(0.8)';
                setTimeout(() => {
                    portfolioItem.style.display = 'none';
                }, 300);
            }
        });
    });
});

// Testimonial slider
let currentSlide = 0;
let isAnimating = false;
const animationDuration = 400; // ms

function showSlide(index, direction = 'next') {
    if (isAnimating) return;
    isAnimating = true;

    if (index < 0) {
        currentSlide = testimonialItems.length - 1;
    } else if (index >= testimonialItems.length) {
        currentSlide = 0;
    } else {
        currentSlide = index;
    }

    // Hide all testimonials
    testimonialItems.forEach((item, i) => {
        item.style.opacity = '0';
        item.style.zIndex = '0';
        item.style.transform = 'translateX(100%)';
    });

    // Show current testimonial
    testimonialItems[currentSlide].style.opacity = '1';
    testimonialItems[currentSlide].style.zIndex = '1';
    testimonialItems[currentSlide].style.transform = 'translateX(0)';

    // Update dots
    dots.forEach((dot, i) => {
        dot.classList.toggle('active', i === currentSlide);
    });

    // Reset animation flag after transition
    setTimeout(() => {
        isAnimating = false;
    }, animationDuration);
    
    // Preload next image for smoother transitions
    preloadNextImage(currentSlide);
}

// Initialize testimonial slider with responsive width and touch support
function initTestimonialSlider() {
    if (!testimonialSlider || testimonialItems.length === 0) return;
    
    // Set initial styles for testimonial items
    testimonialItems.forEach((item, index) => {
        item.style.position = 'absolute';
        item.style.top = '0';
        item.style.left = '0';
        item.style.width = '100%';
        item.style.opacity = index === 0 ? '1' : '0';
        item.style.zIndex = index === 0 ? '1' : '0';
        item.style.transform = index === 0 ? 'translateX(0)' : 'translateX(100%)';
        item.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
    });
    
    // Set testimonial slider styles
    testimonialSlider.style.position = 'relative';
    testimonialSlider.style.overflow = 'hidden';
    testimonialSlider.style.height = `${testimonialItems[0].offsetHeight}px`;
    
    // Create dots container if it doesn't exist
    let dotsContainer = document.querySelector('.testimonial-dots');
    if (!dotsContainer) {
        dotsContainer = document.createElement('div');
        dotsContainer.className = 'testimonial-dots';
        testimonialSlider.parentNode.appendChild(dotsContainer);
    }
    
    // Clear existing dots
    dotsContainer.innerHTML = '';
    
    // Create new dots
    for (let i = 0; i < testimonialItems.length; i++) {
        const dot = document.createElement('span');
        dot.className = i === 0 ? 'dot active' : 'dot';
        dot.addEventListener('click', () => {
            showSlide(i);
        });
        dotsContainer.appendChild(dot);
    }
    
    // Show first slide
    showSlide(0);
    
    // Start auto-slide
    startAutoSlide();
}

// Initialize on page load
window.addEventListener('DOMContentLoaded', initTestimonialSlider);

// Reinitialize on window resize
window.addEventListener('resize', debounce(() => {
    if (testimonialSlider && testimonialItems.length > 0) {
        testimonialSlider.style.height = `${testimonialItems[currentSlide].offsetHeight}px`;
    }
}, 250));

// Auto slide with pause on hover
let testimonialInterval;

function startAutoSlide() {
    clearInterval(testimonialInterval);
    testimonialInterval = setInterval(() => {
        showSlide(currentSlide + 1);
    }, 5000);
}

testimonialSlider.addEventListener('mouseenter', () => {
    clearInterval(testimonialInterval);
});

testimonialSlider.addEventListener('mouseleave', startAutoSlide);

// Touch events for mobile swipe
let touchStartX = 0;
let touchEndX = 0;

testimonialSlider.addEventListener('touchstart', (e) => {
    touchStartX = e.touches[0].clientX;
    clearInterval(testimonialInterval);
}, { passive: true });

testimonialSlider.addEventListener('touchmove', (e) => {
    if (isAnimating) return;
    touchEndX = e.touches[0].clientX;
    const diff = touchStartX - touchEndX;
    
    // Add resistance at the edges
    if ((currentSlide === 0 && diff < 0) || 
        (currentSlide === testimonialItems.length - 1 && diff > 0)) {
        return;
    }
    
    testimonialSlider.style.transition = 'none';
    testimonialSlider.style.transform = `translateX(calc(-${currentSlide * 100}% - ${diff}px))`;
}, { passive: true });

testimonialSlider.addEventListener('touchend', () => {
    const diff = touchStartX - touchEndX;
    const threshold = window.innerWidth * 0.2; // 20% of viewport width
    
    if (Math.abs(diff) > threshold) {
        showSlide(diff > 0 ? currentSlide + 1 : currentSlide - 1);
    } else {
        // Return to current slide if swipe wasn't strong enough
        testimonialSlider.style.transition = `transform ${animationDuration}ms cubic-bezier(0.4, 0, 0.2, 1)`;
        testimonialSlider.style.transform = `translateX(-${currentSlide * 100}%)`;
    }
    
    // Restart auto-slide
    startAutoSlide();
});

// Keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
        showSlide(currentSlide - 1);
    } else if (e.key === 'ArrowRight') {
        showSlide(currentSlide + 1);
    }
});

// Preload next image for smoother transitions
function preloadNextImage(index) {
    if (index < testimonialItems.length - 1) {
        const nextImage = testimonialItems[index + 1].querySelector('img');
        if (nextImage) {
            const img = new Image();
            img.src = nextImage.src;
        }
    }
}

// Contact form submission
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Form validation
        const nameInput = document.getElementById('name');
        const emailInput = document.getElementById('email');
        const subjectInput = document.getElementById('subject');
        const messageInput = document.getElementById('message');
        
        if (!nameInput.value || !emailInput.value || !subjectInput.value || !messageInput.value) {
            alert('Please fill in all fields');
            return;
        }
        
        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            alert('Please enter a valid email address');
            return;
        }
        
        // Here you would typically send the form data to a server
        // For now, we'll just log it and show a success message
        console.log({
            name: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        });
        
        // Show success message
        alert('Message sent successfully!');
        
        // Reset form
        contactForm.reset();
    });
}

// Smooth scrolling for internal links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            window.scrollTo({
                top: targetElement.offsetTop - 70,
                behavior: 'smooth'
            });
        }
    });
});

// Animate elements on scroll
function animateOnScroll() {
    const elements = document.querySelectorAll('.section-header, .about-image, .about-text, .skill-category, .portfolio-item, .testimonial-item, .contact-info, .contact-form');
    
    elements.forEach(element => {
        if (isInViewport(element) && !element.classList.contains('animated')) {
            element.classList.add('animated');
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
    
    // Run enhanced skill animations
    enhancedSkillAnimation();
}

// Start typewriter effect on page load
window.addEventListener('DOMContentLoaded', () => {
    const heroTitle = document.querySelector('.hero-text h1');
    const heroSubtitle = document.querySelector('.hero-text h2');
    
    if (heroTitle) {
        const originalText = heroTitle.textContent;
        heroTitle.innerHTML = '';
        setTimeout(() => {
            typeWriter(heroTitle, originalText, 0, function() {
                // When main title is done, reveal subtitle with class instead of typewriter
                if (heroSubtitle) {
                    heroSubtitle.classList.add('fade-in');
                }
            });
        }, 500);
    }
    
    // Set initial styles for animation
    const elementsToAnimate = document.querySelectorAll('.section-header, .about-image, .about-text, .skill-category, .portfolio-item, .testimonial-item, .contact-info, .contact-form');
    
    elementsToAnimate.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    });
    
    // Start animations
    setTimeout(animateOnScroll, 100);
});

// Add lazy loading to images and handle image loading errors
function setupLazyLoading() {
    const images = document.querySelectorAll('img');
    const placeholderImagePath = 'images/placeholder.svg';
    
    // Function to handle image loading errors
    function handleImageError(img) {
        if (img.src !== placeholderImagePath) {
            console.log('Image failed to load:', img.src);
            img.src = placeholderImagePath;
        }
    }
    
    // Add error handler to all images
    images.forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
    });
    
    if ('loading' in HTMLImageElement.prototype) {
        // Browser supports native lazy loading
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                img.setAttribute('loading', 'lazy');
            }
        });
    } else {
        // Use Intersection Observer as fallback for browsers that don't support lazy loading
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    observer.unobserve(img);
                }
            });
        });
        
        images.forEach(img => {
            if (!img.hasAttribute('loading')) {
                const src = img.getAttribute('src');
                img.setAttribute('data-src', src);
                img.setAttribute('src', 'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1 1"%3E%3C/svg%3E');
                imageObserver.observe(img);
            }
        });
    }
}

// Performance optimization for particle effect
function optimizedCreateParticles() {
    const heroSection = document.querySelector('.hero');
    if (!heroSection) return;
    
    // Check if we're on a mobile device
    const isMobile = window.innerWidth < 768;
    // Reduce particle count on mobile
    const particleCount = isMobile ? 20 : 50;
    
    const particleContainer = document.createElement('div');
    particleContainer.className = 'particles-container';
    heroSection.appendChild(particleContainer);
    
    // Create particles with requestAnimationFrame for better performance
    let particlesCreated = 0;
    
    function createParticlesBatch() {
        const fragment = document.createDocumentFragment();
        const batchSize = isMobile ? 5 : 10;
        const remainingParticles = Math.min(batchSize, particleCount - particlesCreated);
        
        for (let i = 0; i < remainingParticles; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            const size = Math.random() * 5 + 2;
            const posX = Math.random() * 100;
            const posY = Math.random() * 100;
            const animationDuration = Math.random() * 20 + 10;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${posX}%`;
            particle.style.top = `${posY}%`;
            particle.style.animationDuration = `${animationDuration}s`;
            particle.style.opacity = Math.random() * 0.5 + 0.1;
            
            fragment.appendChild(particle);
            particlesCreated++;
        }
        
        particleContainer.appendChild(fragment);
        
        if (particlesCreated < particleCount) {
            requestAnimationFrame(createParticlesBatch);
        }
    }
    
    requestAnimationFrame(createParticlesBatch);
}

// Debounce function to limit the rate at which a function can fire
function debounce(func, wait) {
    let timeout;
    return function() {
        const context = this;
        const args = arguments;
        clearTimeout(timeout);
        timeout = setTimeout(() => func.apply(context, args), wait);
    };
}

// Debounced scroll listener
const debouncedAnimateOnScroll = debounce(animateOnScroll, 20);
window.addEventListener('scroll', debouncedAnimateOnScroll);

// Function to add error handlers to dynamically added images
function addImageErrorHandlers(container = document) {
    const images = container.querySelectorAll('img');
    const placeholderImagePath = 'images/placeholder.svg';
    
    images.forEach(img => {
        // Only add the handler if it doesn't already have one
        if (!img.hasAttribute('data-error-handler-added')) {
            img.addEventListener('error', function() {
                if (this.src !== placeholderImagePath) {
                    console.log('Image failed to load:', this.src);
                    this.src = placeholderImagePath;
                }
            });
            img.setAttribute('data-error-handler-added', 'true');
        }
    });
}

// Setup MutationObserver to watch for dynamically added images
function setupImageObserver() {
    // Create a MutationObserver to watch for new images added to the DOM
    const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
            // Check if nodes were added
            if (mutation.addedNodes && mutation.addedNodes.length > 0) {
                // Check each added node
                mutation.addedNodes.forEach(node => {
                    // If the added node is an element node
                    if (node.nodeType === Node.ELEMENT_NODE) {
                        // If the node is an image
                        if (node.tagName === 'IMG') {
                            addImageErrorHandlers(node.parentNode);
                        } else {
                            // If the node might contain images
                            const images = node.querySelectorAll('img');
                            if (images.length > 0) {
                                addImageErrorHandlers(node);
                            }
                        }
                    }
                });
            }
        });
    });

    // Start observing the document with the configured parameters
    observer.observe(document.body, {
        childList: true,
        subtree: true
    });
}

// Initialize functions on page load
window.addEventListener('load', () => {
    optimizedCreateParticles();
    setupLazyLoading();
    setupImageObserver();
    document.body.classList.add('loaded');
});

// Replace the original createParticles function
function createParticles() {
    optimizedCreateParticles();
}

// Create skill animations with counter effect
function animateCounter(element, start, end, duration) {
    let startTime = null;
    
    function animation(currentTime) {
        if (!startTime) startTime = currentTime;
        const timeElapsed = currentTime - startTime;
        const progress = Math.min(timeElapsed / duration, 1);
        const value = Math.floor(progress * (end - start) + start);
        
        element.textContent = value + '%';
        
        if (progress < 1) {
            requestAnimationFrame(animation);
        }
    }
    
    requestAnimationFrame(animation);
}

// Enhance skill animations
function enhancedSkillAnimation() {
    const skillInfoSpans = document.querySelectorAll('.skill-info > span:nth-child(2)');
    const insideCircles = document.querySelectorAll('.inside-circle');
    
    skillInfoSpans.forEach(span => {
        if (isInViewport(span) && !span.classList.contains('animated')) {
            span.classList.add('animated');
            const percentValue = parseInt(span.textContent);
            span.textContent = '0%';
            animateCounter(span, 0, percentValue, 1500);
        }
    });
    
    insideCircles.forEach(circle => {
        if (isInViewport(circle) && !circle.classList.contains('animated')) {
            circle.classList.add('animated');
            const percentValue = parseInt(circle.textContent);
            circle.textContent = '0%';
            animateCounter(circle, 0, percentValue, 1500);
        }
    });
    
    // Ensure skill bars are always visible after animation
    const skillBars = document.querySelectorAll('.skill-progress');
    skillBars.forEach(bar => {
        if (isInViewport(bar)) {
            // If the bar has an original width stored, ensure it's set
            if (bar.dataset.originalWidth) {
                bar.style.width = bar.dataset.originalWidth;
            } else {
                // Store original width if not already stored
                const originalWidth = bar.getAttribute('style').split('width:')[1].split(';')[0].trim();
                bar.dataset.originalWidth = originalWidth;
                bar.style.width = originalWidth;
            }
        }
    });
}

// Enhanced portfolio hover effects
portfolioItems.forEach(item => {
    const img = item.querySelector('img');
    const info = item.querySelector('.portfolio-info');
    
    item.addEventListener('mouseenter', () => {
        img.style.transform = 'scale(1.1)';
        info.style.opacity = '1';
    });
    
    item.addEventListener('mouseleave', () => {
        img.style.transform = 'scale(1)';
    });
});

// Add typewriter effect to hero heading
function typeWriter(element, text, i, fnCallback) {
    if (i < text.length) {
        element.innerHTML = text.substring(0, i+1) + '<span class="blinking-cursor">|</span>';
        
        // Random typing speed effect
        setTimeout(function() {
            typeWriter(element, text, i + 1, fnCallback)
        }, 50 + Math.random() * 100);
    } else if (typeof fnCallback == 'function') {
        setTimeout(fnCallback, 700);
    }
}

// Portfolio project modal
const portfolioViewButtons = document.querySelectorAll('.portfolio-view');
const modalOverlay = document.createElement('div');
modalOverlay.className = 'modal-overlay';
document.body.appendChild(modalOverlay);

const projectDetails = {
    'Leave Management System': {
        title: 'Leave Management System for NSTI College Kanpur',
        description: `<p>This Android application was designed and developed to streamline the leave application process for students and staff at NSTI College Kanpur.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>User authentication with different access levels (students, faculty, admin)</li>
            <li>Intuitive interface for submitting leave applications</li>
            <li>Real-time notifications for application status updates</li>
            <li>Admin dashboard for reviewing and approving/rejecting applications</li>
            <li>Report generation and printing functionality</li>
            <li>Leave history tracking and analytics</li>
            <li>Offline capability with data synchronization</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>Java for Android development</li>
            <li>Firebase for backend database and authentication</li>
            <li>Material Design components for UI</li>
            <li>PDF generation for printing leave records</li>
        </ul>
        <p>This project significantly reduced paperwork and administrative overhead, decreasing the leave processing time by 70% and improving overall institutional efficiency.</p>`,
        image: 'images/portfolio/leave-app-details.jpg'
    },
    'Corporate Dashboard': {
        title: 'Corporate Performance Dashboard',
        description: `<p>An interactive Power BI dashboard designed to visualize key corporate performance metrics and KPIs in real-time.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Real-time data visualization with dynamic filtering</li>
            <li>Multiple interactive reports for sales, finance, and operations</li>
            <li>Drill-through capabilities for detailed analysis</li>
            <li>Customizable alerts for performance thresholds</li>
            <li>Mobile-responsive design for on-the-go access</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>Power BI for visualization</li>
            <li>SQL Server for data storage</li>
            <li>DAX for advanced calculations</li>
            <li>Power Query for data transformation</li>
        </ul>
        <p>This dashboard has helped management make data-driven decisions more efficiently, leading to a 25% improvement in response time to market changes.</p>`,
        image: 'images/portfolio/project1-details.jpg'
    },
    'Inventory Management App': {
        title: 'Inventory Management Application',
        description: `<p>A comprehensive Android application for tracking inventory levels, orders, and supply chain logistics.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Barcode/QR code scanning for quick item identification</li>
            <li>Automated inventory alerts for low stock levels</li>
            <li>Purchase order generation and tracking</li>
            <li>Supplier management system</li>
            <li>Analytics dashboard with inventory trends</li>
            <li>Multi-location inventory support</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>Kotlin for Android development</li>
            <li>Room Database for local storage</li>
            <li>Retrofit for API integration</li>
            <li>ZXing for barcode scanning</li>
            <li>MPAndroidChart for analytics visualization</li>
        </ul>
        <p>This application helped businesses reduce inventory management time by 60% and decrease stockouts by 45%.</p>`,
        image: 'images/portfolio/project2-details.jpg'
    },
    'AI-Powered Chatbot': {
        title: 'AI-Powered Customer Service Chatbot',
        description: `<p>A sophisticated chatbot using natural language processing to provide automated customer service 24/7.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Natural language understanding for conversational interaction</li>
            <li>Intent recognition and contextual responses</li>
            <li>Integration with knowledge base for accurate information</li>
            <li>Seamless handoff to human agents when needed</li>
            <li>Multi-language support</li>
            <li>Analytics dashboard to track common queries</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>Python for backend processing</li>
            <li>TensorFlow for NLP models</li>
            <li>React.js for frontend interface</li>
            <li>Node.js for API development</li>
            <li>MongoDB for data storage</li>
        </ul>
        <p>This chatbot resolved 78% of customer inquiries without human intervention, significantly reducing support costs.</p>`,
        image: 'images/portfolio/project3-details.jpg'
    },
    'Sales Analysis Report': {
        title: 'Sales Analysis Reporting System',
        description: `<p>A comprehensive sales analysis reporting system using MS Excel and Power BI for data-driven decision making.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Automated data collection from multiple sources</li>
            <li>Advanced Excel formulas and macros for complex calculations</li>
            <li>Interactive Power BI dashboards for visualization</li>
            <li>Sales forecasting using historical data analysis</li>
            <li>Territory and representative performance tracking</li>
            <li>Customizable reporting periods and metrics</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>MS Excel with VBA</li>
            <li>Power BI for visualization</li>
            <li>Power Query for ETL processes</li>
            <li>DAX for calculations</li>
            <li>SQL for data queries</li>
        </ul>
        <p>This reporting system has helped identify sales trends and opportunities, leading to a 15% increase in quarterly sales.</p>`,
        image: 'images/portfolio/project4-details.jpg'
    },
    'E-Learning Platform': {
        title: 'Responsive E-Learning Platform',
        description: `<p>A fully responsive web-based e-learning platform designed to provide engaging educational content across all devices.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>Responsive design optimized for mobile, tablet, and desktop</li>
            <li>Video course delivery with progress tracking</li>
            <li>Interactive quizzes and assessments</li>
            <li>User profile and learning path customization</li>
            <li>Certificate generation upon course completion</li>
            <li>Discussion forums and peer collaboration tools</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>HTML5, CSS3, and JavaScript</li>
            <li>React.js for frontend development</li>
            <li>Node.js and Express for backend</li>
            <li>MongoDB for database management</li>
            <li>AWS S3 for video content storage</li>
        </ul>
        <p>This platform has successfully served over 5,000 students with a 92% course completion rate.</p>`,
        image: 'images/portfolio/project5-details.jpg'
    },
    'AI Content Generator': {
        title: 'AI-Powered Content Generation Tool',
        description: `<p>A web application that leverages artificial intelligence to generate high-quality, customized content for various business needs.</p>
        <h4>Key Features:</h4>
        <ul>
            <li>AI-powered text generation for various content types</li>
            <li>Customizable tone and style settings</li>
            <li>SEO optimization suggestions</li>
            <li>Plagiarism checking integration</li>
            <li>Content editing and refinement tools</li>
            <li>Template library for quick starts</li>
        </ul>
        <h4>Technologies Used:</h4>
        <ul>
            <li>GPT-3/4 API integration</li>
            <li>JavaScript and React for frontend</li>
            <li>Python and Flask for backend</li>
            <li>PostgreSQL for data storage</li>
            <li>Docker for containerization</li>
        </ul>
        <p>This tool has helped marketing teams reduce content creation time by 65% while maintaining high quality standards.</p>`,
        image: 'images/portfolio/project6-details.jpg'
    }
    // Add other projects as needed
};

portfolioViewButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const portfolioItem = this.closest('.portfolio-item');
        const projectTitle = portfolioItem.querySelector('h3').textContent;
        const projectData = projectDetails[projectTitle] || {
            title: projectTitle,
            description: '<p>Detailed project information coming soon.</p>',
            image: portfolioItem.querySelector('img').src
        };
        
        // Create modal content
        const modalContent = document.createElement('div');
        modalContent.className = 'modal-content';
        modalContent.innerHTML = `
            <span class="close-modal">&times;</span>
            <div class="modal-body">
                <div class="modal-image">
                    <img src="${projectData.image}" alt="${projectData.title}">
                </div>
                <div class="modal-text">
                    <h3>${projectData.title}</h3>
                    <div class="modal-description">${projectData.description}</div>
                </div>
            </div>
        `;
        
        // Show modal
        modalOverlay.appendChild(modalContent);
        modalOverlay.style.display = 'flex';
        document.body.style.overflow = 'hidden'; // Prevent scrolling
        
        // Add error handlers to any images in the modal
        addImageErrorHandlers(modalContent);
        
        // Close button functionality
        const closeBtn = modalContent.querySelector('.close-modal');
        closeBtn.addEventListener('click', closeModal);
        
        // Close when clicking outside
        modalOverlay.addEventListener('click', function(e) {
            if (e.target === modalOverlay) {
                closeModal();
            }
        });
    });
});

function closeModal() {
    modalOverlay.style.display = 'none';
    modalOverlay.innerHTML = '';
    document.body.style.overflow = 'auto'; // Enable scrolling again
}

// Add escape key functionality to close modal
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape' && modalOverlay.style.display === 'flex') {
        closeModal();
    }
});

// Enhanced scroll handling with proper performance
const scrollHandler = {
    ticking: false,
    lastScrollY: 0,
    init() {
        window.addEventListener('scroll', () => {
            this.lastScrollY = window.scrollY;
            if (!this.ticking) {
                window.requestAnimationFrame(() => {
                    this.handleScroll();
                    this.ticking = false;
                });
                this.ticking = true;
            }
        }, { passive: true });
    },
    handleScroll() {
        // Header scroll effect
        if (this.lastScrollY > 100) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }

        // Animate elements on scroll
        this.animateOnScroll();
    },
    animateOnScroll() {
        const elements = document.querySelectorAll('.section-header, .about-image, .about-text, .skill-category, .portfolio-item, .testimonial-item, .contact-info, .contact-form');
        
        elements.forEach(element => {
            if (this.isInViewport(element) && !element.classList.contains('animated')) {
                this.animateElement(element);
            }
        });
    },
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top <= (window.innerHeight || document.documentElement.clientHeight) * 0.8 &&
            rect.bottom >= 0
        );
    },
    animateElement(element) {
        element.classList.add('animated');
        element.style.opacity = '1';
        element.style.transform = 'translate3d(0, 0, 0)';
        
        // Animate children with stagger effect
        const children = element.querySelectorAll('*');
        children.forEach((child, index) => {
            child.style.transitionDelay = `${index * 0.1}s`;
            child.style.opacity = '1';
            child.style.transform = 'translate3d(0, 0, 0)';
        });
    }
};

// Initialize scroll handler
scrollHandler.init();

// Enhanced smooth scrolling
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        
        const targetId = this.getAttribute('href');
        if (targetId === '#') return;
        
        const targetElement = document.querySelector(targetId);
        if (targetElement) {
            const headerOffset = 80;
            const elementPosition = targetElement.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Enhanced skill animations
const skillAnimations = {
    init() {
        this.animateSkillBars();
        this.animateSkillCircles();
        
        // Add scroll event listener to ensure animations work when scrolling
        window.addEventListener('scroll', () => {
            this.animateSkillBars();
            this.animateSkillCircles();
        }, { passive: true });
    },
    animateSkillBars() {
        const skillBars = document.querySelectorAll('.skill-progress');
        skillBars.forEach(bar => {
            // Store original width if not already stored
            if (!bar.dataset.originalWidth && bar.style.width) {
                bar.dataset.originalWidth = bar.style.width;
            }
            
            if (scrollHandler.isInViewport(bar)) {
                if (!bar.classList.contains('animated')) {
                    bar.classList.add('animated');
                    const width = bar.dataset.originalWidth || bar.style.width;
                    bar.style.width = '0';
                    requestAnimationFrame(() => {
                        bar.style.width = width;
                    });
                } else {
                    // Ensure width is set even after animation
                    if (bar.dataset.originalWidth && bar.style.width === '0px') {
                        bar.style.width = bar.dataset.originalWidth;
                    }
                }
            }
        });
    },
    animateSkillCircles() {
        const circles = document.querySelectorAll('.inside-circle');
        circles.forEach(circle => {
            if (scrollHandler.isInViewport(circle) && !circle.classList.contains('animated')) {
                circle.classList.add('animated');
                const value = parseInt(circle.textContent);
                this.animateCounter(circle, 0, value, 1500);
            }
        });
    },
    animateCounter(element, start, end, duration) {
        let startTime = null;
        const easing = t => t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        
        function animation(currentTime) {
            if (!startTime) startTime = currentTime;
            const timeElapsed = currentTime - startTime;
            const progress = Math.min(timeElapsed / duration, 1);
            const easedProgress = easing(progress);
            const value = Math.floor(easedProgress * (end - start) + start);
            
            element.textContent = value + '%';
            
            if (progress < 1) {
                requestAnimationFrame(animation);
            }
        }
        
        requestAnimationFrame(animation);
    }
};

// Initialize skill animations
skillAnimations.init();

// Google Form auto-redirect to new form after submit
// Target the Google Form iframe
const googleFormIframe = document.querySelector('.google-form-container iframe');
if (googleFormIframe) {
    // Listen for form submission event by monitoring the iframe's load event
    googleFormIframe.addEventListener('load', function () {
        // Check if the form has been submitted by inspecting the URL
        if (googleFormIframe.contentWindow.location.href.includes('formResponse')) {
            // Replace with your Google Form link (edit as needed)
            setTimeout(() => {
                googleFormIframe.src = 'https://docs.google.com/forms/d/e/1FAIpQLSfjM6n1xs5zszBN0_MDbrlB_RKLD8DDW6WQ29ufYLrMl2tU-A/viewform?embedded=true';
            }, 2000); // Wait 2 seconds before resetting
        }
    });
}