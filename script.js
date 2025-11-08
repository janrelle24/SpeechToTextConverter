const microphoneIcon = document.getElementById("mic");
const textArea = document.getElementById("text");
const voiceWave = document.getElementById("voice");
const tapRecord = document.getElementById("tap");


//initialize speechrecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

let isListening = false;
let lastSpeechTime = Date.now();
let pauseTimer;

microphoneIcon.addEventListener("click", toggleSpeech);

function toggleSpeech(){
    if(!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)){
        alert("Sorry, your browser does not support Speech Recognition.");
        return;
    }
    if(!isListening){
        recognition.start();
        voiceWave.style.display = "flex";
        tapRecord.style.display = "none";
    }
    else{
        recognition.stop();
        voiceWave.style.display = "none";
        tapRecord.style.display = "block";
    }
    isListening = !isListening;
}
//when speech is recognized
recognition.onresult = function(event){
    const transcript = event.results[event.results.length - 1][0].transcript.trim();
    const punctuated = addSmartPunctuation(transcript);

    // Add a space if text already exists
    textArea.value += (textArea.value ? " " : "") + punctuated;
    lastSpeechTime = Date.now();

    // reset pause timer
    clearTimeout(pauseTimer);
    pauseTimer = setTimeout(insertPausePeriod, 3000);
};
function addSmartPunctuation(text){
    // Capitalize first letter
    text = text.charAt(0).toUpperCase() + text.slice(1);

    // Add question mark for question-like phrases
    if (/\b(what|why|how|who|where|when|is|can|do|did|will|are)\b/i.test(text)) {
        if (!/[?.!]$/.test(text)) text += "?";
    }
    else if(!/[.?!]$/.test(text)){
        text += ".";
    }
    return text;
}
function insertPausePeriod() {
    const currentText = textArea.value.trim();
    if (currentText && !/[.?!]$/.test(currentText)) {
        textArea.value = currentText + ".";
    }
}

//when recognition starts
recognition.onstart = function(){
    microphoneIcon.classList.add("active");
    console.log("🎙 Listening...");
};
//when recognition stops
recognition.onend = function(){
    microphoneIcon.classList.remove("active");
    console.log("🛑 Stopped listening.");
    isListening = false;
    clearTimeout(pauseTimer);
};

//handle possible errors
recognition.onerror = function(event){
    console.error("Speech recognition error:", event.error);
    microphoneIcon.classList.remove("active");
    isListening = false;
};

const copyBtn = document.getElementById("copy");
const deleteBtn = document.getElementById("delete");
const statusMsg = document.getElementById("statusMessage");

copyBtn.addEventListener("click", function(){
    const textToCopy = textArea.value.trim();

    navigator.clipboard.writeText(textToCopy).then(() =>{
        statusMsg.textContent = "Text successfully copied to clipboard!";
        setTimeout(() =>{
            statusMsg.textContent = "";
        }, 3000);
    }).catch(err =>{
        console.error("Could not copy text: ", err);
        statusMsg.textContent = "Failed to copy text";
    });
});

deleteBtn.addEventListener("click", function(){
    const textToDelete = textArea.value.trim();

    if(textToDelete){
        //clear textArea
        textArea.value = "";
        statusMsg.textContent = "Text successfully deleted!"
        setTimeout(() =>{
            statusMsg.textContent = "";
        }, 3000);
    }else{
        console.log("Nothing to delete.");
        statusMsg.textContent = "No text to delete.";
        setTimeout(() => {
            statusMsg.textContent = "";
        }, 3000);
    }
});

