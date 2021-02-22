import React, { useEffect, useRef, useState } from "react";
import TextField from "@material-ui/core/TextField";
import Box from "@material-ui/core/Box";

import {
  Button,
  makeStyles,
  Container,
  Grid,
  Card,
  CardContent,
} from "@material-ui/core";
import {
  getDescriptor,
} from "../utils/helper";

const useStyles = makeStyles(() => ({
  root: {
    margin: "3rem",
    justifyContent: "center",
  },
  buttonBox:{
    display:'flex',
    justifyContent:'space-between'
  },
  video: {
    width: "320",
    height: "240",
  },
  button: { margin: "1rem", width: "10rem" },
  captureButton: { margin: "1rem", width: "15rem", alignSelf: "center" },
}));

const LandingPage = () => {
  const [userDetails, setUserDetails] = useState({
    id: "",
    fullName: "",
    email: "",
  });
  const [signUp, setSignUp] = useState(true);
  const [cameraAccess, setCameraAccess] = useState(false);
  const [loginEmail, setLoginEmail] = useState("");
  const cameraRef = useRef(null);
  const canvasRef = useRef(null);
  const canvasRef1 = useRef(null);
  const login = async () => {
    canvasRef1.current
      .getContext("2d")
      .drawImage(cameraRef.current, 0, 0, 100, 100);
    const image = document.createElement("img");
    image.src = canvasRef1.current.toDataURL();
    const descriptors = await getDescriptor(image);
    if (!descriptors) {
      alert(" Please retake image");
      return;
    }
    fetch("http://localhost:4000/v1/user/login", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email: loginEmail,
        descriptors: Object.values(descriptors[0]),
      }),
    });
  };
  const next = () => {
    fetch("http://localhost:4000/v1/user", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userDetails),
    })
      .then((response) => {
        return response.json();
      })
      .then((json) => {
        setUserDetails({ ...userDetails, ...json.data });
        setCameraAccess(true);
      })
      .catch((e) => {
        alert(JSON.stringify(e));
      });
  };

  const capture = async () => {
    canvasRef.current
      .getContext("2d")
      .drawImage(cameraRef.current, 0, 0, 100, 100);
    const image = document.createElement("img");
    image.src = canvasRef.current.toDataURL();
    const descriptors = await getDescriptor(image);
    if (!descriptors) {
      alert(" Please retake image");
      return;
    }
    fetch("http://localhost:4000/v1/user", {
      method: "PUT",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ...userDetails,
        descriptors: Object.values(descriptors[0]),
      }),
    });

    setSignUp(false);
  };

  useEffect(() => {
    const mediaSupport = "mediaDevices" in navigator;
    if(cameraAccess){
      mediaSupport &&
      navigator.mediaDevices
        .getUserMedia({ video: true })
        .then(function (mediaStream) {
          setCameraAccess(true);
          if (cameraRef.current) {
            cameraRef.current.srcObject = mediaStream;
            cameraRef.current.play();
          }
        })
        .catch(function (err) {
          alert("Unable to access camera: " + err);
        });
    }
     
  }, [cameraAccess]);

  const classes = useStyles();

  return (
    <Container maxWidth={true}>
      <Grid item lg={6} className={classes.root}>
        <Card>
          <CardContent>
            <Box className={classes.buttonBox}>
              <Button
                variant="contained"
                onClick={() => {
                  setSignUp(false);
                  setCameraAccess(true);
                }}
              >
                Login
              </Button>
              <Button
                variant="contained"
                onClick={() => {
                  setSignUp(true);
                  setCameraAccess(false);
                }}
              >
                Sign up
              </Button>
              </Box>

             {cameraAccess ?  <video ref={cameraRef} className={classes.video}></video> : null }

              {userDetails.id && signUp ? (
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <canvas
                    ref={canvasRef}
                    style={{
                      display: "block",
                      width: "500px",
                      height: "500px",
                    }}
                  ></canvas>
                  <Button
                    variant="contained"
                    onClick={() => {
                      capture();
                    }}
                    className={classes.captureButton}
                    disabled={!cameraAccess}
                  >
                    Capture your pic
                  </Button>
                </Box>
              ) : null}
              {signUp ? (
                <Box style={{ display: "flex", flexDirection: "column" }}>
                  <TextField
                    label="Full Name"
                    name="fullName"
                    onChange={(event) => {
                      setUserDetails({ fullName: event.target.value });
                    }}
                  />
                  <TextField
                    label="Email"
                    name="email"
                    onChange={(event) => {
                      setUserDetails({
                        ...userDetails,
                        email: event.target.value,
                      });
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      next();
                    }}
                    className={classes.button}
                  >
                    Next
                  </Button>
                </Box>
              ) : null}
              {!signUp ? (
                <Box>
                  <canvas ref={canvasRef1} width="320" height="240"></canvas>
                  <TextField
                    label="Email"
                    name="email"
                    onChange={(event) => {
                      setLoginEmail(event.target.value);
                    }}
                  />
                  <Button
                    variant="contained"
                    onClick={() => {
                      login();
                    }}
                  >
                    Login
                  </Button>
                </Box>
              ) : null}
          </CardContent>
        </Card>
      </Grid>
    </Container>
  );
};

export default LandingPage;
