const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('transcript').textContent = 'You: ' + transcript;

    try {
        const response = await fetch('http://localhost:5006/webhooks/rest/webhook', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ "sender": "user", "message": transcript })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }

        const data = await response.json();
        const botResponse = data[0]?.text || "Sorry, I didn't get that.";
        document.getElementById('response').textContent = 'Bot: ' + botResponse;

        speak(botResponse);
    } catch (error) {
        console.error('Fetch error:', error);
        document.getElementById('response').textContent = 'Error: Failed to fetch response from server';
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
    console.log('Speaking: ' + text);
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}

document.getElementById('record-button').addEventListener('click', startRecognition);
