let player

function onYouTubeIframeAPIReady() {
    player = new YT.Player("player", {
        height: "390",
        width: "640",
        playerVars: {
            playsinline: 1,
            controls: 0,
            listType: "playlist",
            list: "PLTyk5Ytz7SLM11N0pGkxoUKpiXzCpo5c-",
        },
        events: {
            onReady: onPlayerReady,
            onStateChange: onPlayerStateChange,
        },
    })
}

const onPlayerReady = (event) => {
    console.log("Player ready event")
    // event.target.playVideo();
}

let done = false
const onPlayerStateChange = (event) => {
    if (event.data === YT.PlayerState.PLAYING && !done) {
        done = true
    }
}

// Functions to control the player
const playVideo = () => player.playVideo()
const pauseVideo = () => player.pauseVideo()
const stopVideo = () => player.stopVideo()
const nextVideo = () => player.nextVideo()
const previousVideo = () => player.previousVideo()

document.getElementById("playButton").addEventListener("click", playVideo)
document.getElementById("pauseButton").addEventListener("click", pauseVideo)
document.getElementById("stopButton").addEventListener("click", stopVideo)
document.getElementById("nextButton").addEventListener("click", nextVideo)
document.getElementById("previousButton").addEventListener("click", previousVideo)

document.addEventListener("DOMContentLoaded", () => {
    const PITCH_STEP = 0.5
    const YAW_STEP = 0.5
    const FOV_STEP = 1
    const MAX_PITCH = 90
    const MIN_PITCH = -90
    const MAX_YAW = 360
    const MIN_FOV = 30
    const MAX_FOV = 120
    const INTERVAL_TIME = 10

    let pitch = 0
    let yaw = 0
    let fov = 100
    let intervalId

    const increasePitch = () => {
        if (pitch < MAX_PITCH) {
            pitch = Math.min(pitch + PITCH_STEP, MAX_PITCH)
            player.setSphericalProperties({ pitch })
        } else {
            clearInterval(intervalId)
        }
    }

    const decreasePitch = () => {
        if (pitch > MIN_PITCH) {
            pitch = Math.max(pitch - PITCH_STEP, MIN_PITCH)
            player.setSphericalProperties({ pitch })
        } else {
            clearInterval(intervalId)
        }
    }

    const increaseYaw = () => {
        yaw = (yaw - YAW_STEP + MAX_YAW) % MAX_YAW
        player.setSphericalProperties({ yaw })
    }

    const decreaseYaw = () => {
        yaw = (yaw + YAW_STEP) % MAX_YAW
        player.setSphericalProperties({ yaw })
    }

    const zoomIn = () => {
        if (fov > MIN_FOV) {
            fov = Math.max(fov - FOV_STEP, MIN_FOV)
            player.setSphericalProperties({ fov })
        } else {
            clearInterval(intervalId)
        }
    }

    const zoomOut = () => {
        if (fov < MAX_FOV) {
            fov = Math.min(fov + FOV_STEP, MAX_FOV)
            player.setSphericalProperties({ fov })
        } else {
            clearInterval(intervalId)
        }
    }

    const setupButtonListeners = (buttonId, onMouseDown, onMouseUp) => {
        const button = document.getElementById(buttonId)
        button.addEventListener("mousedown", onMouseDown)
        button.addEventListener("mouseup", onMouseUp)
        button.addEventListener("mouseleave", onMouseUp)
    }

    setupButtonListeners(
        "upButton",
        () => (intervalId = setInterval(increasePitch, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
    setupButtonListeners(
        "downButton",
        () => (intervalId = setInterval(decreasePitch, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
    setupButtonListeners(
        "leftButton",
        () => (intervalId = setInterval(decreaseYaw, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
    setupButtonListeners(
        "rightButton",
        () => (intervalId = setInterval(increaseYaw, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
    setupButtonListeners(
        "zoomInButton",
        () => (intervalId = setInterval(zoomIn, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
    setupButtonListeners(
        "zoomOutButton",
        () => (intervalId = setInterval(zoomOut, INTERVAL_TIME)),
        () => clearInterval(intervalId)
    )
})

document.addEventListener("DOMContentLoaded", (event) => {
    const overlay = document.getElementById("overlay")
    const closeButton = document.getElementById("closeButton")
    const infoButton = document.getElementById("infoButton")
    const muteButton = document.getElementById("muteButton")

    // Show overlay on page load
    overlay.classList.add("visible")

    // Close button event
    closeButton.addEventListener("click", () => {
        overlay.classList.remove("visible")
    })

    // Info button event
    infoButton.addEventListener("click", () => {
        overlay.classList.add("visible")
    })

    muteButton.addEventListener("click", () => {
        if (player.isMuted()) {
            player.unMute()
            muteButton.textContent = "Mute"
        } else {
            player.mute()
            muteButton.textContent = "Unmute"
        }
    })

    // Close overlay if click outside of the content
    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("visible")
        }
    })
})
