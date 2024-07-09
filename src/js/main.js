const DEBUG_MODE = false

const PITCH_STEP = 0.2
const YAW_STEP = 0.2
const FOV_STEP = 1
const MAX_PITCH = 90
const MIN_PITCH = -90
const MAX_YAW = 360
const MIN_FOV = 30
const MAX_FOV = 120
const INTERVAL_TIME = 0.09

let pitch = 0
let yaw = 0
let fov = 100

let player

function init() {
    initAudioModel()
    initPoseModel()
}

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

function showTextOverlay(text) {
    const overlay = document.getElementById("text-overlay")
    overlay.textContent = text
    overlay.classList.add("show")

    setTimeout(() => {
        overlay.classList.remove("show")
    }, 1000)
}

const playVideo = () => {
    showTextOverlay("PLAY")
    player.playVideo()
}
const pauseVideo = () => {
    showTextOverlay("PAUSE")
    player.pauseVideo()
}
const stopVideo = () => {
    showTextOverlay("STOP")
    player.stopVideo()
}
const nextVideo = () => {
    showTextOverlay("NEXT VIDEO")
    player.nextVideo()
}
const previousVideo = () => {
    showTextOverlay("PREVIOUS VIDEO")
    player.previousVideo()
}
const muteVideo = () => player.mute()
const unmuteVideo = () => player.unMute()

const moveVideoUp = () => {
    intervalId = setInterval(increasePitch, INTERVAL_TIME)
}
const moveVideoDown = () => {
    intervalId = setInterval(decreasePitch, INTERVAL_TIME)
}
const moveVideoRight = () => {
    intervalId = setInterval(increaseYaw, INTERVAL_TIME)
}
const moveVideoLeft = () => {
    intervalId = setInterval(decreaseYaw, INTERVAL_TIME)
}

document.getElementById("playButton").addEventListener("click", playVideo)
document.getElementById("pauseButton").addEventListener("click", pauseVideo)
document.getElementById("stopButton").addEventListener("click", stopVideo)
document.getElementById("nextButton").addEventListener("click", nextVideo)
document.getElementById("previousButton").addEventListener("click", previousVideo)

const increasePitch = () => {
    if (pitch < MAX_PITCH) {
        pitch = Math.min(pitch + PITCH_STEP, MAX_PITCH)
        player.setSphericalProperties({ pitch })
    }
}

const decreasePitch = () => {
    if (pitch > MIN_PITCH) {
        pitch = Math.max(pitch - PITCH_STEP, MIN_PITCH)
        player.setSphericalProperties({ pitch })
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
    }
}

const zoomOut = () => {
    if (fov < MAX_FOV) {
        fov = Math.min(fov + FOV_STEP, MAX_FOV)
        player.setSphericalProperties({ fov })
    }
}

document.addEventListener("DOMContentLoaded", () => {
    init()

    const videoControls = document.querySelector(".controls")
    if (DEBUG_MODE) videoControls.removeAttribute("hidden")

    const overlay = document.getElementById("overlay")
    const closeButton = document.getElementById("closeButton")
    const infoButton = document.getElementById("infoButton")
    const muteButton = document.getElementById("muteButton")
    const muteIcon = document.getElementById("muteIcon")

    overlay.classList.add("visible")

    closeButton.addEventListener("click", () => {
        overlay.classList.remove("visible")
    })

    infoButton.addEventListener("click", () => {
        overlay.classList.add("visible")
    })

    muteButton.addEventListener("click", () => {
        if (player.isMuted()) {
            unmuteVideo()
            muteIcon.src = "svg/mute.svg"
            muteButton.setAttribute("aria-label", "Mute")
            muteButton.setAttribute("title", "Mute")
        } else {
            muteVideo()
            muteIcon.src = "svg/unmute.svg"
            muteButton.setAttribute("aria-label", "Unmute")
            muteButton.setAttribute("title", "Unmute")
        }
    })

    overlay.addEventListener("click", (e) => {
        if (e.target === overlay) {
            overlay.classList.remove("visible")
            poseCaptureWrapper.style.visibility = "visible"
        }
    })

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
