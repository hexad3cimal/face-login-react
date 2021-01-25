import React, { useEffect, useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

import { Button, makeStyles, Paper } from "@material-ui/core";
import {createFaceMatcher, getImageDetails} from "../utils/helper"

const useStyles = makeStyles(() => ({
  video: {
      width:'500',
      height:'500'
  },
  }));

const LandingPage = () => {
  const [userId, setUserId] = useState(null);
  const [userDetails, setUserDetails] = useState({ fullName: "" });
  const [userDescriptors, setUserDescriptors] = useState([]);
  const [signUp, setSignUp] = useState(true);
  const faceMatcher = useRef({})

  const cameraRef = useRef(null)
  const canvasRef = useRef(null)
  const canvasRef1 = useRef(null)
  const login = async() =>{
  canvasRef1.current.getContext( '2d' )
    .drawImage( cameraRef.current, 0, 0, 320,240 );
    const image = document.createElement('img');
    image.src = canvasRef1.current.toDataURL();
    const a = await getImageDetails(canvasRef1.current,image,faceMatcher.current)
  }
  const next = () => {
      setUserId("123")
    // fetch({
    //   url: "http://localhost:4000/v1/signup",
    //   method: "POST",
    //   body: JSON.stringify(userDetails),
    // })
    //   .then((response) => {
    //     return response.json();
    //   })
    //   .then((json) => {
    //     setUserId(json.id);
    //   });
  };

  const capture = async() => {
    
    canvasRef.current.getContext( '2d' ).drawImage( cameraRef.current, 0, 0, 320,240 );
    const image = document.createElement('img');
    image.src = canvasRef.current.toDataURL();
    faceMatcher.current = await createFaceMatcher(image,userId)
    setUserDescriptors([...userDescriptors, faceMatcher.current._labeledDescriptors[0]])
    setSignUp(false)
  }

  useEffect(()=>{
    const mediaSupport = 'mediaDevices' in navigator;
    mediaSupport && navigator.mediaDevices.getUserMedia( { video: true } )
		.then( function( mediaStream ) {
			cameraRef.current.srcObject = mediaStream;
			cameraRef.current.play();
		})
		.catch( function( err ) {
			console.log( "Unable to access camera: " + err );
		});
	
  },[userId])

  const classes = useStyles();
  
  return (
    <form>
      <Paper>
        {userId ? (
          <Box>
              <video ref={cameraRef} className={classes.video}></video>
              <canvas ref={canvasRef} width="320" height="240"></canvas>

              <Button
              variant="contained"
              onClick={() => {
                capture();
              }}
            >
              Capture
            </Button>
          </Box>
        ) : (
          <Box>
            <TextField
              label="Full Name"
              name="fullName"
              onChange={(event) => {
                setUserDetails({ fullName: event.target.value });
              }}
              defaultValue="Jovin Thariyath"
            />
            <Button
              variant="contained"
              onClick={() => {
                next();
              }}
            >
              Next
            </Button>
          </Box>
        )}
        {!signUp ?  <Box>
              <canvas ref={canvasRef1} width="320" height="240"></canvas>
              <Button
              variant="contained"
              onClick={() => {
                login()
              }}
            >
              Login
            </Button> </Box> : null}
      </Paper>
    </form>
  );
};

export default LandingPage