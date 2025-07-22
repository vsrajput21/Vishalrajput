// Chatbot for Vishal's Portfolio Website

// DOM Elements
let chatbotContainer;
let chatbotToggle;
let chatbotMessages;
let chatbotInput;
let chatbotSendBtn;

// Chatbot Configuration
const chatbotConfig = {
    name: "Vishal's AI Assistant",
    currentLanguage: "english", // Default language is now English
    theme: {
        primary: "#0078d4",
        secondary: "#00a2ff",
        accent: "#f8f9fa"
    },
    animation: {
        enabled: true,
        speed: 500 // milliseconds
    },
    autoOpen: {
        enabled: true,
        delay: 3000 // milliseconds
    },
    welcomeMessage: {
        hindi: "नमस्ते! मैं विशाल का AI असिस्टेंट हूँ। मैं आपको विशाल के तकनीकी कौशल, प्रोजेक्ट्स, या संपर्क जानकारी के बारे में बता सकता हूँ। मैं आपकी कैसे मदद कर सकता हूँ?",
        english: "Hello! I'm Vishal's AI Assistant. I can help you learn about Vishal's technical expertise, projects, or connect you with him. How can I assist you today?"
    },
    placeholderText: {
        hindi: "अपना प्रश्न यहां टाइप करें...",
        english: "Type your question here..."
    },
    suggestions: {
        hindi: [
            "विशाल के बारे में बताएं",
            "विशाल के कौशल क्या हैं?",
            "पोर्टफोलियो प्रोजेक्ट्स दिखाएं",
            "संपर्क जानकारी"
        ],
        english: [
            "Tell me about Vishal",
            "What are Vishal's skills?",
            "Show portfolio projects",
            "Contact information"
        ]
    }
};

// Language toggle function
function toggleLanguage() {
    chatbotConfig.currentLanguage = chatbotConfig.currentLanguage === "hindi" ? "english" : "hindi";
    updateChatbotLanguage();
}

// Knowledge Base
const knowledgeBase = {
    about: {
        keywords: ["about", "who", "विशाल", "कौन", "बारे में", "परिचय", "introduction"],
        response: {
            hindi: "विशाल एक तकनीकी पेशेवर हैं जिन्हें MS Office सुइट, Power BI के साथ डेटा विज़ुअलाइज़ेशन और कंप्यूटर ऑपरेशंस में विशेषज्ञता है। वे वेब डेवलपमेंट और AI-संचालित समाधानों में भी कुशल हैं, जहां वे उपयोगकर्ता-अनुकूल वेबसाइटें और Android एप्लिकेशन बनाते हैं।",
            english: "Vishal is a tech professional with expertise in MS Office suite, data visualization with Power BI, and computer operations. He is also skilled in web development and AI-powered solutions, where he creates user-friendly websites and Android applications."
        }
    },
    skills: {
        keywords: ["skills", "कौशल", "expertise", "specialization", "विशेषज्ञता", "क्या कर सकते हैं"],
        response: {
            hindi: "विशाल के प्रमुख कौशल हैं: MS Office Suite (95%), Power BI (85%), HTML/CSS (90%), JavaScript (75%), संचार (85%), टीमवर्क (90%), समस्या समाधान (80%), और रचनात्मकता (95%)।",
            english: "Vishal's key skills include: MS Office Suite (95%), Power BI (85%), HTML/CSS (90%), JavaScript (75%), Communication (85%), Teamwork (90%), Problem Solving (80%), and Creativity (95%)."
        }
    },
    portfolio: {
        keywords: ["portfolio", "projects", "work", "पोर्टफोलियो", "प्रोजेक्ट", "काम", "परियोजनाएं"],
        response: {
            hindi: "विशाल के प्रमुख प्रोजेक्ट्स हैं: NSTI कॉलेज कानपुर के लिए लीव मैनेजमेंट सिस्टम, कॉर्पोरेट डैशबोर्ड (Power BI), इन्वेंटरी मैनेजमेंट ऐप, AI-पावर्ड चैटबॉट, सेल्स एनालिसिस रिपोर्ट, और ई-लर्निंग प्लेटफॉर्म।",
            english: "Vishal's key projects include: Leave Management System for NSTI College Kanpur, Corporate Dashboard (Power BI), Inventory Management App, AI-Powered Chatbot, Sales Analysis Report, and E-Learning Platform."
        }
    },
    contact: {
        keywords: ["contact", "email", "phone", "संपर्क", "ईमेल", "फोन", "संपर्क करें", "बात करें"],
        response: {
            hindi: "आप विशाल से ईमेल: vsrajput21@gmail.com या फोन: +91 9927982020 पर संपर्क कर सकते हैं। वे भारत में स्थित हैं।",
            english: "You can contact Vishal via email: vsrajput21@gmail.com or phone: +91 9927982020. He is located in India."
        }
    },
    default: {
        response: {
            hindi: "मुझे आपका प्रश्न समझ नहीं आया। क्या आप विशाल के बारे में, उनके कौशल, पोर्टफोलियो या संपर्क जानकारी के बारे में जानना चाहते हैं?",
            english: "I didn't understand your question. Would you like to know about Vishal, his skills, portfolio, or contact information?"
        }
    }
};

// Initialize Chatbot
function initChatbot() {
    // Create chatbot HTML structure
    createChatbotHTML();
    
    // Get DOM elements
    chatbotContainer = document.querySelector('.chatbot-container');
    chatbotToggle = document.querySelector('.chatbot-toggle');
    chatbotMessages = document.querySelector('.chatbot-messages');
    chatbotInput = document.querySelector('.chatbot-input');
    chatbotSendBtn = document.querySelector('.chatbot-send');
    chatbotLangToggle = document.querySelector('.chatbot-lang-toggle');
    
    // Add event listeners
    chatbotToggle.addEventListener('click', toggleChatbot);
    chatbotSendBtn.addEventListener('click', handleUserMessage);
    chatbotInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            handleUserMessage();
        }
    });
    chatbotLangToggle.addEventListener('click', toggleLanguage);
    
    // Add welcome message
    addBotMessage(chatbotConfig.welcomeMessage[chatbotConfig.currentLanguage]);
    
    // Add suggestion buttons
    addSuggestionButtons();
}

// Create Chatbot HTML
function createChatbotHTML() {
    const chatbotHTML = `
        <div class="chatbot-container">
            <div class="chatbot-toggle">
                <i class="fas fa-robot"></i>
            </div>
            <div class="chatbot-box">
                <div class="chatbot-header">
                    <h3><i class="fas fa-brain"></i> ${chatbotConfig.name}</h3>
                    <div class="chatbot-controls">
                        <button class="chatbot-lang-toggle">${chatbotConfig.currentLanguage === "hindi" ? "EN" : "हिं"}</button>
                        <div class="chatbot-close">&times;</div>
                    </div>
                </div>
                <div class="chatbot-messages"></div>
                <div class="chatbot-suggestions"></div>
                <div class="chatbot-input-container">
                    <input type="text" class="chatbot-input" placeholder="${chatbotConfig.placeholderText[chatbotConfig.currentLanguage]}">
                    <button class="chatbot-send"><i class="fas fa-paper-plane"></i></button>
                </div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', chatbotHTML);
    
    // Add close button functionality
    setTimeout(() => {
        const closeBtn = document.querySelector('.chatbot-close');
        closeBtn.addEventListener('click', toggleChatbot);
    }, 100);
}

// Toggle Chatbot Visibility
function toggleChatbot() {
    chatbotContainer.classList.toggle('active');
}

// Add Bot Message
function addBotMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.className = 'chatbot-message bot';
    msgElement.innerHTML = `<div class="message-content">${message}</div>`;
    chatbotMessages.appendChild(msgElement);
    
    // Add animation if enabled
    if (chatbotConfig.animation.enabled) {
        msgElement.style.opacity = '0';
        msgElement.style.transform = 'translateY(10px)';
        setTimeout(() => {
            msgElement.style.transition = `all ${chatbotConfig.animation.speed/1000}s ease-out`;
            msgElement.style.opacity = '1';
            msgElement.style.transform = 'translateY(0)';
        }, 50);
    }
    
    scrollToBottom();
}

// Add User Message
function addUserMessage(message) {
    const msgElement = document.createElement('div');
    msgElement.className = 'chatbot-message user';
    msgElement.innerHTML = `<div class="message-content">${message}</div>`;
    chatbotMessages.appendChild(msgElement);
    scrollToBottom();
}

// Handle User Message
function handleUserMessage() {
    const userMessage = chatbotInput.value.trim();
    if (userMessage === '') return;
    
    // Add user message to chat
    addUserMessage(userMessage);
    chatbotInput.value = '';
    
    // Process user message and get response
    const botResponse = processUserMessage(userMessage);
    
    // Simulate typing delay
    setTimeout(() => {
        addBotMessage(botResponse);
    }, 500);
}

// Process User Message
function processUserMessage(message) {
    // Convert message to lowercase for easier matching
    const lowerMessage = message.toLowerCase();
    
    // Check each knowledge base category
    for (const category in knowledgeBase) {
        if (category === 'default') continue;
        
        const keywords = knowledgeBase[category].keywords;
        if (keywords && keywords.some(keyword => lowerMessage.includes(keyword.toLowerCase()))) {
            return knowledgeBase[category].response[chatbotConfig.currentLanguage];
        }
    }
    
    // If no match found, return default response
    return knowledgeBase.default.response[chatbotConfig.currentLanguage];
}

// Add Suggestion Buttons
function addSuggestionButtons() {
    const suggestionsContainer = document.querySelector('.chatbot-suggestions');
    suggestionsContainer.innerHTML = '';
    
    chatbotConfig.suggestions[chatbotConfig.currentLanguage].forEach(suggestion => {
        const button = document.createElement('button');
        button.className = 'suggestion-btn';
        button.textContent = suggestion;
        button.addEventListener('click', () => {
            chatbotInput.value = suggestion;
            handleUserMessage();
        });
        suggestionsContainer.appendChild(button);
    });
}

// Scroll to Bottom of Messages
function scrollToBottom() {
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
}

// Update Chatbot Language
function updateChatbotLanguage() {
    // Update language toggle button text
    document.querySelector('.chatbot-lang-toggle').textContent = 
        chatbotConfig.currentLanguage === "hindi" ? "EN" : "हिं";
    
    // Update input placeholder
    document.querySelector('.chatbot-input').placeholder = 
        chatbotConfig.placeholderText[chatbotConfig.currentLanguage];
    
    // Update suggestion buttons
    addSuggestionButtons();
    
    // Add language change notification message
    const langMessage = chatbotConfig.currentLanguage === "hindi" ? 
        "भाषा हिंदी में बदल दी गई है।" : 
        "Language changed to English.";
    addBotMessage(langMessage);
    
    // Show welcome message in the new language
    addBotMessage(chatbotConfig.welcomeMessage[chatbotConfig.currentLanguage]);
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    // Initialize the chatbot
    initChatbot();
    
    // Automatically open the chatbot after 3 seconds when website loads
    setTimeout(() => {
        if (chatbotContainer) {
            chatbotContainer.classList.add('active');
            // Add a welcome animation to the bot message
            const firstBotMessage = document.querySelector('.chatbot-message.bot');
            if (firstBotMessage) {
                firstBotMessage.style.animation = 'fadeIn 0.5s ease-out';
            }
        }
    }, 3000);
});