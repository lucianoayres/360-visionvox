const AUDIO_CLASSIFIER_MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/8NWN8Sc2n/"
const AUDIO_CLASSIFIER_MODEL_CHECKPOINT_URL = AUDIO_CLASSIFIER_MODEL_BASE_URL + "model.json" // model topology
const AUDIO_CLASSIFIER_MODEL_METADATA_URL = AUDIO_CLASSIFIER_MODEL_BASE_URL + "metadata.json" // model metadata

const POSE_CLASSIFIER_MODEL_BASE_URL = "https://teachablemachine.withgoogle.com/models/NX1Rf2z6f/"
const POSE_CLASSIFIER_MODEL_CHECKPOINT_URL = POSE_CLASSIFIER_MODEL_BASE_URL + "model.json" // model topology
const POSE_CLASSIFIER_MODEL_METADATA_URL = POSE_CLASSIFIER_MODEL_BASE_URL + "metadata.json" // model metadata

const PITCH_STEP = 0.2
const YAW_STEP = 0.2
const FOV_STEP = 1
const MAX_PITCH = 90
const MIN_PITCH = -90
const MAX_YAW = 360
const MIN_FOV = 30
const MAX_FOV = 120
const INTERVAL_TIME = 0.09
