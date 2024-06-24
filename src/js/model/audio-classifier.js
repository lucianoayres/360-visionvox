async function createModel() {
    const recognizer = speechCommands.create("BROWSER_FFT", undefined, AUDIO_CLASSIFIER_MODEL_CHECKPOINT_URL, AUDIO_CLASSIFIER_MODEL_METADATA_URL)
    await recognizer.ensureModelLoaded()
    return recognizer
}

async function init() {
    const recognizer = await createModel()
    const classLabels = recognizer.wordLabels() // get class labels

    recognizer.listen(
        (result) => {
            const scores = result.scores // probability of prediction for each class
            // render the probability scores per class
            for (let i = 0; i < classLabels.length; i++) {
                //const classPrediction = classLabels[i] + ": " + result.scores[i].toFixed(2)
                // labelContainer.childNodes[i].innerHTML = classPrediction
                const classPrediction = {
                    label: classLabels[i],
                    score: result.scores[i],
                }

                if (classPrediction.score >= 0.96) {
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
