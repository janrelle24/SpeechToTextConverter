const microphoneIcon = document.getElementById("mic");
const textArea = document.getElementById("text");


//initialize speechrecognition
const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
const recognition = new SpeechRecognition();

recognition.continuous = true;
recognition.interimResults = false;
recognition.lang = "en-US";

let isListening = false;

microphoneIcon.addEventListener("click", toggleSpeech);

function toggleSpeech(){
    if(!("webkitSpeechRecognition" in window) && !("SpeechRecognition" in window)){
        alert("Sorry, your browser does not support Speech Recognition.");
        return;
    }
    if(!isListening){
        recognition.start();
    }
    else{
        recognition.stop();
    }
    isListening = !isListening;
}
//when speech is recognized
recognition.onresult = function(event){
    const transcript = event.results[event.results.length - 1][0].transcript;
    textArea.value += (textArea.value ? " " : "") + transcript;
};

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

