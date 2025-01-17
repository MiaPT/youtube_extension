
document.getElementById("save").addEventListener("click", saveTimeInput);

document.getElementById("minutes").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        saveTimeInput();
    }
});

function saveTimeInput(){
    const minutes = document.getElementById("minutes").value;
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, {minutes: minutes});
    });
}
