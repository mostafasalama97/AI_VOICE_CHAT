const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript.trim();
    appendMessage('You: ' + transcript, 'user-message');

    const requestPayload = { "sender": "user", "message": transcript };
    console.log('Request Payload:', JSON.stringify(requestPayload));

    try {
        const response = await fetch('http://localhost:5008/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestPayload)
        });

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

        speak(botResponse);
    } catch (error) {
        console.error('Fetch error:', error);
        appendMessage('Error: Failed to fetch response from server', 'bot-message');
    }
};

recognition.onspeechend = () => {
    recognition.stop();
};

recognition.onend = () => {
    document.getElementById('record-button').textContent = 'Start Voice Recognition';
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
    document.getElementById('record-button').textContent = 'Start Voice Recognition';
};

function startRecognition() {
    recognition.start();
    document.getElementById('record-button').textContent = 'Listening...';
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
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

document.getElementById('record-button').addEventListener('click', startRecognition);
