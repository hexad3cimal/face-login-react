import * as faceapi from "face-api.js";

export async function loadModels() {
  const MODEL_URL = "/models";
  await faceapi.loadTinyFaceDetectorModel(MODEL_URL);
 await  faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL);
  await faceapi.loadFaceLandmarkTinyModel(MODEL_URL);
  await faceapi.loadFaceRecognitionModel(MODEL_URL);
}

export const getImageDetails = async (imageElement, faceMatcher) => {
  await loadModels();
  const singleResult = await faceapi
    .detectSingleFace(imageElement, getTinyFaceDetectorOptions())
    .withFaceLandmarks()
    .withFaceDescriptor();

  if (singleResult) {
    return {message: "success", data: faceMatcher.findBestMatch(singleResult.descriptor).toString()};
  }else{
    return {message: "error", data: "", error: "Could not detect any faces"};
  }
};

export const createFaceMatcher = async (descriptor, label) => {
  await loadModels();
  const labeledDescriptor = [
    new faceapi.LabeledFaceDescriptors(label, descriptor),
  ];
  return new faceapi.FaceMatcher(labeledDescriptor);
};

export const getDescriptor = async (image) => {
  await loadModels()
  const results = await faceapi
  .detectAllFaces(image, getTinyFaceDetectorOptions())
  .withFaceLandmarks()
  .withFaceDescriptors();

return results.length && [new Float32Array(results[0].descriptor)];
  
  
};

const getTinyFaceDetectorOptions = () =>{
 return new faceapi.TinyFaceDetectorOptions({
    inputSize : 512,
    scoreThreshold: 0.5,
  });
}