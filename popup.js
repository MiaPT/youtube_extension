

document.getElementById("time-form").addEventListener("submit", function(event){
    event.preventDefault();
    saveTimeInput();
});

document.addEventListener("DOMContentLoaded", fillPopupFields);

document.getElementById("include-search-results").addEventListener("change", saveIncludeSearchInput)

function fillPopupFields(){
    chrome.storage.local.get(["minimumLength", "includeSearchResults"]).then(result => {
        document.getElementById("minutes").value = result.minimumLength.slice(0,2);
        document.getElementById("seconds").value = result.minimumLength.slice(2,4);
        document.getElementById("include-search-results").checked = result.includeSearchResults;
    });
}


function saveTimeInput(){
    let minutes = document.getElementById("minutes").value || "00";
    if (minutes.length == 1) { minutes = "0" + minutes }

    let seconds = document.getElementById("seconds").value || "00";
    if (seconds.length == 1){ seconds = "0" + seconds}    

    chrome.storage.local.set({minimumLength: minutes + seconds})
}

function saveIncludeSearchInput(){
    const includeSearchResults = document.getElementById("include-search-results").checked;
    chrome.storage.local.set({includeSearchResults: includeSearchResults});
}
