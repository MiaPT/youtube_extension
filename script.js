let minimumLength = 4
let oldMinimumLength = 4

function updateVideoVisibility(){

    const url = new URL(window.location.href)

    let videos = null
    switch (url.pathname){
        case "/":
            videos = getFrontPageVids()
            break;
        case "/watch":
            videos = getWatchPageVids()
            break;
        default: return
    }

    if (minimumLength < oldMinimumLength){
        unhideVids(videos)
        oldMinimumLength = minimumLength
    }
    
    hideShortVids(videos)

}


chrome.runtime.onMessage.addListener((message) => {
    if (message.minutes){
        oldMinimumLength = minimumLength
        minimumLength = message.minutes
    }
});



function unhideVids(videos){
    videos = videos.filter(v => {
        const timeStatus = v.querySelector("#time-status")
        if (!timeStatus){
            return null
        }
        const time = v.querySelector("#time-status").innerText.trim()

        return time.length == 4 && Number(time[0]) >= minimumLength
    })
    videos.forEach(v => {
        v.style.removeProperty('display')
    });
}



function hideShortVids(videos){
    const shortVideos = videos.filter(v => {
        const timeStatus = v.querySelector("#time-status")
        if (!timeStatus){
            return null
        }
        const time = v.querySelector("#time-status").innerText.trim()

        return time.length == 4 && Number(time[0]) < minimumLength
    })

    shortVideos.forEach(v => {
        v.style['display'] = 'none'
    });
}


setInterval(updateVideoVisibility, 500)

function getFrontPageVids(){
    const contents = document.getElementById("contents")
    const videos = Array.from(contents.querySelectorAll("#content").values())

    return videos.map(v => v.parentElement)
}

function getWatchPageVids(){
    const videos = document.querySelectorAll("#dismissible")
    return Array.from(videos.values())
}

