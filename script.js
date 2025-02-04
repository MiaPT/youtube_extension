let minimumLength = 0
let oldMinimumLength = 0
chrome.storage.local.get(["minimumLength"]).then(res => {
    minimumLength = Number(res.minimumLength)
})

chrome.storage.onChanged.addListener((changes) => {
    if (changes.minimumLength){
        oldMinimumLength = minimumLength
        minimumLength = Number(changes.minimumLength.newValue)
    }
})

setInterval(updateVideoVisibility, 500)


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


function unhideVids(videos){
    videos = videos.filter(v => {
        const timeStatus = v.querySelector("#time-status")
        if (!timeStatus){
            return null
        }
        const time = v.querySelector("#time-status").innerText.trim()
        
        return Number(time.replace(":", "")) >= minimumLength
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

        return Number(time.replace(":", "")) < minimumLength
    })

    shortVideos.forEach(v => {
        v.style['display'] = 'none'
    });
}



function getFrontPageVids(){
    const contents = document.getElementById("contents")
    const videos = Array.from(contents.querySelectorAll("#content").values())

    return videos.map(v => v.parentElement)
}

function getWatchPageVids(){
    const videos = document.querySelectorAll("#dismissible")
    return Array.from(videos.values())
}

