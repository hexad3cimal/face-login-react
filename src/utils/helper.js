import * as faceapi from "face-api.js";

export async function loadModels() {
  const MODEL_URL = "/models";
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export const getImageDetails = async (imageElement, faceMatcher) => {
  await loadModels();
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize : 512,
    scoreThreshold: 0.5,
  });

  const singleResult = await faceapi
    .detectSingleFace(imageElement, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (singleResult) {
    return {message: "success", data: faceMatcher.findBestMatch(singleResult.descriptor).toString()};
  }else{
    return {message: "error", data: "", error: "Could not detect any faces"};
  }
};

export const createFaceMatcher = async (image, label) => {
  await loadModels();
  const options = new faceapi.TinyFaceDetectorOptions({
    inputSize : 512,
    scoreThreshold: 0.5,
  });
  
  const result = await faceapi
    .detectAllFaces(image, options)
    .withFaceLandmarks()
    .withFaceDescriptor();

  const currentUserDescriptor = [new Float32Array(result.descriptor)];
  const labeledDescriptor = [
    new faceapi.LabeledFaceDescriptors(label, currentUserDescriptor),
  ];
  return new faceapi.FaceMatcher(labeledDescriptor);
};
