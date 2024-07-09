const AUDIO_CLASSIFIER_MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/8NWN8Sc2n/"
const AUDIO_CLASSIFIER_MODEL_CHECKPOINT_URL = AUDIO_CLASSIFIER_MODEL_BASE_URL + "model.json" // model topology
const AUDIO_CLASSIFIER_MODEL_METADATA_URL = AUDIO_CLASSIFIER_MODEL_BASE_URL + "metadata.json" // model metadata

let lastCommandTime = 0
const commandCooldown = 2000 // 2 seconds

async function createModel() {
    const recognizer = speechCommands.create("BROWSER_FFT", undefined, AUDIO_CLASSIFIER_MODEL_CHECKPOINT_URL, AUDIO_CLASSIFIER_MODEL_METADATA_URL)
    await recognizer.ensureModelLoaded()
    return recognizer
}

async function initAudioModel() {
    const recognizer = await createModel()
    const classLabels = recognizer.wordLabels()

    recognizer.listen(
        (result) => {
            const scores = result.scores
            for (let i = 0; i < classLabels.length; i++) {
                const classPrediction = {
                    label: classLabels[i],
                    score: result.scores[i],
                }

                if (classPrediction.score >= 0.99) {
                    const currentTime = Date.now()
                    if (currentTime - lastCommandTime >= commandCooldown) {
                        lastCommandTime = currentTime
                        console.log(classPrediction)

                        if (classPrediction.label === "Play") {
                            console.log(classPrediction)
                            playVideo()
                        }
                        if (classPrediction.label === "Stop") {
                            console.log(classPrediction)
                            stopVideo()
                        }
                        if (classPrediction.label === "Pause") {
                            console.log(classPrediction)
                            pauseVideo()
                        }
                        if (classPrediction.label === "Next") {
                            console.log(classPrediction)
                            nextVideo()
                        }
                        if (classPrediction.label === "Back") {
                            console.log(classPrediction)
                            previousVideo()
                        }
                        if (classPrediction.label === "Debug") {
                            console.log(classPrediction)
                        }
                    }
                }
            }
        },
        {
            includeSpectrogram: true,
            probabilityThreshold: 0.75,
            invokeCallbackOnNoiseAndUnknown: true,
            overlapFactor: 0.65,
        }
    )
}
