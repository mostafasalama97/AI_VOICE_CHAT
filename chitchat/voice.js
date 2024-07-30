let currentLang = 'en-US'; // Default language

const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
console.log("recognition:", recognition);
recognition.interimResults = false;
recognition.maxAlternatives = 1;

let voices = [];

window.speechSynthesis.onvoiceschanged = () => {
    voices = window.speechSynthesis.getVoices();
    console.log("Available voices:", voices);
};

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.trim();
    appendMessage('You: ' + transcript, 'user-message');

    const requestPayload = { 
        "sender": "user", 
        "message": transcript,
        "metadata": { "lang": currentLang }
    };
    console.log('Request Payload:', JSON.stringify(requestPayload));

    try {
        const response = await fetch('http://localhost:5008/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });
        console.log('Response:', response);
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        console.log('Data:', data);

        if (data.length === 0) {
            console.error('Received empty response:', data);
        }

        const botResponse = data[0]?.text || "Sorry, I didn't get that.";
        appendMessage('Bot: ' + botResponse, 'bot-message');
        console.log('Bot Response:', botResponse);

        speak(botResponse, currentLang);  // Ensure it speaks in the current language
    } catch (error) {
        console.error('Fetch error:', error);
        appendMessage('Error: Failed to fetch response from server', 'bot-message');
    }
};

recognition.onspeechend = () => {
    recognition.stop();
};

recognition.onend = () => {
    updateButtonLabel();
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
    updateButtonLabel();
};

function startRecognition(lang) {
    currentLang = lang;
    recognition.lang = lang;
    recognition.start();
    updateButtonLabel();
}

function speak(text, lang) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = lang;

    const selectedVoice = voices.find(voice => voice.lang === lang);
    if (selectedVoice) {
        utterance.voice = selectedVoice;
    } else {
        console.warn(`No voice found for language: ${lang}. Using default voice.`);
    }

    synth.speak(utterance);
}

function appendMessage(message, className) {
    const chatLog = document.getElementById('chat-log');
    const messageElement = document.createElement('div');
    messageElement.textContent = message;
    messageElement.className = className;
    chatLog.appendChild(messageElement);
    chatLog.scrollTop = chatLog.scrollHeight; // Scroll to the bottom
}

function updateButtonLabel() {
    document.getElementById('record-button-ar').textContent = 'Start Voice Recognition (Arabic)';
    document.getElementById('record-button-en').textContent = 'Start Voice Recognition (English)';
}

document.getElementById('record-button-ar').addEventListener('click', () => startRecognition('ar-SA'));
document.getElementById('record-button-en').addEventListener('click', () => startRecognition('en-US'));
