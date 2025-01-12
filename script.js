const maxLength = 4

function hideVids(){

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
    
    const shortVideos = videos.filter(v => {
        const timeStatus = v.querySelector("#time-status")
        if (!timeStatus){
            return null
        }
        const time = v.querySelector("#time-status").innerText.trim()
        return time.length == 4 && Number(time[0]) < maxLength
    })
    
    shortVideos.forEach(v => {
        v.style['display'] = 'none'
    });
}


setInterval(hideVids, 500)

function getFrontPageVids(){
    const contents = document.getElementById("contents")
    const videos = Array.from(contents.querySelectorAll("#content").values())

    return videos.map(v => v.parentElement)
}

function getWatchPageVids(){
    const videos = document.querySelectorAll("#dismissible")
    return Array.from(videos.values())
}

