let minimumLength = 0
let oldMinimumLength = 0
let includeSearchResults = false
let inclSearchChanged = false
chrome.storage.local.get(["minimumLength", "includeSearchResults"]).then(res => {
    minimumLength = Number(res.minimumLength)
    includeSearchResults = res.includeSearchResults
})

chrome.storage.onChanged.addListener((changes) => {
    if (changes.minimumLength){
        oldMinimumLength = minimumLength
        minimumLength = Number(changes.minimumLength.newValue)
    }
    if (changes.includeSearchResults){
        includeSearchResults = changes.includeSearchResults.newValue
        inclSearchChanged = true
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
        case "/results":
            videos = getWatchPageVids()

            const shortShelves = getShortShelves()
            
            if (!includeSearchResults){
                if (inclSearchChanged){
                    shortShelves.concat(videos) .forEach(v => {
                        v.style.removeProperty('display')
                    });
                    inclSearchChanged = false
                }
                return
            }
            shortShelves.forEach(s => s.style["display"] = "none")

            break
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

function getShortShelves(){
    const shorts = document.getElementsByTagName("ytd-reel-shelf-renderer")
    return Array.from(shorts)
}

