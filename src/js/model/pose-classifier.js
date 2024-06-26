const POSE_CLASSIFIER_MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/NX1Rf2z6f/"
const POSE_CLASSIFIER_MODEL_CHECKPOINT_URL = POSE_CLASSIFIER_MODEL_BASE_URL + "model.json" // model topology
const POSE_CLASSIFIER_MODEL_METADATA_URL = POSE_CLASSIFIER_MODEL_BASE_URL + "metadata.json" // model metadata

let model, webcam, ctx, labelContainer, maxPredictions
let currentState = "Idle"
let intervalId

async function initPoseModel() {
    model = await tmPose.load(POSE_CLASSIFIER_MODEL_CHECKPOINT_URL, POSE_CLASSIFIER_MODEL_METADATA_URL)
    maxPredictions = model.getTotalClasses()

    const size = 200
    const flip = true
    webcam = new tmPose.Webcam(size, size, flip)
    await webcam.setup()
    await webcam.play()
    window.requestAnimationFrame(loop)

    const canvas = document.getElementById("canvas")
    canvas.width = size
    canvas.height = size
    ctx = canvas.getContext("2d")
    labelContainer = document.getElementById("label-container")
    for (let i = 0; i < maxPredictions; i++) {
        labelContainer.appendChild(document.createElement("div"))
    }
}

async function loop(timestamp) {
    webcam.update()
    await predict()
    window.requestAnimationFrame(loop)
}

async function predict() {
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas)
    const prediction = await model.predict(posenetOutput)

    let newState = "Idle"

    for (let i = 0; i < maxPredictions; i++) {
        const classPrediction = prediction[i].className + ": " + prediction[i].probability.toFixed(2)
        labelContainer.childNodes[i].innerHTML = classPrediction

        if (prediction[i].probability >= 0.95) {
            showTextOverlay(classPrediction)

            if (prediction[i].className === "Up") {
                newState = "Up"
            } else if (prediction[i].className === "Down") {
                newState = "Down"
            } else if (prediction[i].className === "Right") {
                newState = "Right"
            } else if (prediction[i].className === "Left") {
                newState = "Left"
            }
        }
    }

    if (newState !== currentState) {
        clearInterval(intervalId)
        currentState = newState

        switch (currentState) {
            case "Up":
                moveVideoUp()
                break
            case "Down":
                moveVideoDown()
                break
            case "Right":
                moveVideoRight()
                break
            case "Left":
                moveVideoLeft()
                break
            case "Idle":
            default:
                break
        }
    }

    drawPose(pose)
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0)
        if (pose) {
            const minPartConfidence = 0.5
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx)
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx)
        }
    }
}
