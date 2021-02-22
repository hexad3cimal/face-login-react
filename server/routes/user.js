const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { v4: uuid } = require('uuid');
const faceapi =  require("face-api.js");

router.post('/', async function(req, res, next) {
  try{
    const user = {id: uuid(), fullName: req.body.fullName, email : req.body.email}
    await new User(user).save()
    return res.status(200).json({"data": user})
  }catch(e){
    console.log(e)
    next(e)
  }
})


router.put('/', async function(req, res, next) {
  try{
    const user = req.body
    await User.findOneAndUpdate({id: user.id },user)
    res.status(204).json({"data": user})
  }catch(e){
    next(e)
  }
});

router.post('/login', async function(req, res, next) {
  try{
    const user =  await User.findOne({email: req.body.email })

    if(user){
      const labeledDescriptor = [
        new faceapi.LabeledFaceDescriptors(user.email,[new Float32Array(user.descriptors)]),
      ];
      const faceMatcher =  new faceapi.FaceMatcher(labeledDescriptor);
      const match = faceMatcher.findBestMatch(req.body.descriptors);
      if(match._label===req.body.email) return res.status(200).json({"data": user})

    }
   res.status(401).json({"data": "error"})

  }catch(e){
    console.log(e)
    next(e)
  }
});

module.exports = router;
