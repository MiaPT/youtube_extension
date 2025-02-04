

document.getElementById("time-form").addEventListener("submit", function(event){
    event.preventDefault();
    saveTimeInput();
});

function fetchTimeInput(){
    chrome.storage.local.get("minimumLength", function(result){
        document.getElementById("minutes").value = result.minimumLength.slice(0,2);
        document.getElementById("seconds").value = result.minimumLength.slice(2,4);
    });
}

document.addEventListener("DOMContentLoaded", fetchTimeInput);

function saveTimeInput(){
    let minutes = document.getElementById("minutes").value || "00";
    if (minutes.length == 1) { minutes = "0" + minutes }

    let seconds = document.getElementById("seconds").value || "00";
    if (seconds.length == 1){ seconds = "0" + seconds}

    chrome.storage.local.set({minimumLength: minutes + seconds});
}
