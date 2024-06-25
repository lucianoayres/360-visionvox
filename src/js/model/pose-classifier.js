let model, webcam, ctx, labelContainer, maxPredictions
let currentState = "Idle" // Variable to keep track of current state
let intervalId

async function initPoseModel() {
    // load the model and metadata
    // Refer to tmImage.loadFromFiles() in the API to support files from a file picker
    // Note: the pose library adds a tmPose object to your window (window.tmPose)
    model = await tmPose.load(POSE_CLASSIFIER_MODEL_CHECKPOINT_URL, POSE_CLASSIFIER_MODEL_METADATA_URL)
    maxPredictions = model.getTotalClasses()

    // Convenience function to setup a webcam
    const size = 200
    const flip = true // whether to flip the webcam
    webcam = new tmPose.Webcam(size, size, flip) // width, height, flip
    await webcam.setup() // request access to the webcam
    await webcam.play()
    window.requestAnimationFrame(loop)

    // append/get elements to the DOM
    const canvas = document.getElementById("canvas")
    canvas.width = size
    canvas.height = size
    ctx = canvas.getContext("2d")
    labelContainer = document.getElementById("label-container")
    for (let i = 0; i < maxPredictions; i++) {
        // and class labels
        labelContainer.appendChild(document.createElement("div"))
    }
}

async function loop(timestamp) {
    webcam.update() // update the webcam frame
    await predict()
    window.requestAnimationFrame(loop)
}

async function predict() {
    // Prediction #1: run input through posenet
    // estimatePose can take in an image, video or canvas html element
    const { pose, posenetOutput } = await model.estimatePose(webcam.canvas)
    // Prediction 2: run input through teachable machine classification model
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
                // Do nothing or stop the video movement
                break
        }
    }

    // finally draw the poses
    drawPose(pose)
}

function drawPose(pose) {
    if (webcam.canvas) {
        ctx.drawImage(webcam.canvas, 0, 0)
        // draw the keypoints and skeleton
        if (pose) {
            const minPartConfidence = 0.5
            tmPose.drawKeypoints(pose.keypoints, minPartConfidence, ctx)
            tmPose.drawSkeleton(pose.keypoints, minPartConfidence, ctx)
        }
    }
}
