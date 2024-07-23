const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
recognition.lang = 'en-US';
recognition.interimResults = false;
recognition.maxAlternatives = 1;

recognition.onresult = async (event) => {
    const transcript = event.results[0][0].transcript;
    document.getElementById('transcript').textContent = 'You: ' + transcript;

    const response = await fetch('http://localhost:5005/webhooks/rest/webhook', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ "sender": "user", "message": transcript })
    });
    const data = await response.json();
    document.getElementById('response').textContent = 'Bot: ' + data[0].text;

    speak(data[0].text);
};

recognition.onspeechend = () => {
    recognition.stop();
};

recognition.onerror = (event) => {
    console.error('Error occurred in recognition: ' + event.error);
};

function startRecognition() {
    recognition.start();
}

function speak(text) {
    const synth = window.speechSynthesis;
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';
    synth.speak(utterance);
}
