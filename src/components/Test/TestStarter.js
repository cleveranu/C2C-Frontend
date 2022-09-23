import {
  Box,
  Button,
  Chip,
  Fade,
  IconButton,
  Link,
  Modal,
  Skeleton,
  Stack,
  Tooltip,
  Typography,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import TimerIcon from "@mui/icons-material/Timer";
import React, { useRef } from "react";
import { useEffect } from "react";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFetch } from "../Hooks/useFetch";
import LanguageSharpIcon from '@mui/icons-material/LanguageSharp';
import InstagramIcon from '@mui/icons-material/Instagram';
import TwitterIcon from '@mui/icons-material/Twitter';
import HelpIcon from '@mui/icons-material/Help';
import Leaderboard from '../Dashboard/Leaderboard';
// import useWindowSize from "react-use/lib/useWindowSize";
// import Confetti from "react-confetti";
// import ExamIcon from "../Icons/ExamIcon";
import Instructions from "./Exam/Instructions";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 400,
  bgcolor: "background.paper",
  border: "2px solid #000",
  borderRadius: "1.2rem",
  boxShadow: 24,
  p: 4,
};
function TestStarter() {
  const navigate = useNavigate();
  const theme = useTheme();
  const matches = useMediaQuery(theme.breakpoints.up("sm"));
  const { data, isLoading } = useFetch(
    "https://c2c-backend.vercel.app/user/checkauth"
  );
  const round1Time = new Date("Sep 30, 2022 14:00:00");
  const round2Time = new Date("Sep 30, 2022 16:20:00");
  const round3Time = new Date("Sep 30, 2022 18:00:00");

  const [timer, setTimer] = useState(0);
  const [open, setOpen] = useState(false);
  const [open2, setOpen2] = useState(false);
  const Ref = useRef(null);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const handleOpen2 = () => setOpen2(true);
  const handleClose2 = () => setOpen2(false);
  const getTimeRemaining = (e) => {
    const total = Date.parse(e) - Date.parse(new Date());
    const days = Math.floor(total / 1000 / 60 / 60 / 24);
    const seconds = Math.floor((total / 1000) % 60);
    const minutes = Math.floor((total / 1000 / 60) % 60);
    const hours = Math.floor((total / 1000 / 60 / 60) % 24);
    return {
      total,
      days,
      hours,
      minutes,
      seconds,
    };
  };
  const handleCloning = () => {
    console.log(data.data.data[`round${getCurrentRound()}`]);

    if (data.data.data[`round${getCurrentRound()}`]) {
      navigate(`exam/${getCurrentRound()}`);
    } else {
      console.log("not allowed");
    }
  };
  const getCurrentRound = () => {
    const currentRound =
      new Date().getTime() < round1Time.getTime() + 60000 * 60 &&
      new Date().getTime() > round1Time.getTime()
        ? "1"
        : new Date().getTime() < round2Time.getTime() + 60000 * 60 &&
          new Date().getTime() > round2Time.getTime()
        ? "2"
        : new Date().getTime() < round3Time.getTime() + 60000 * 60 &&
          new Date().getTime() > round3Time.getTime()
        ? "3"
        : "0";
    return currentRound;
  };
  const startTimer = (e) => {
    let { total, days, hours, minutes, seconds } = getTimeRemaining(e);
    if (total >= 0) {
      setTimer(
        (days > 9 ? days : "0" + days) +
          `d : ` +
          (hours > 9 ? hours : "0" + hours) +
          `h : ` +
          (minutes > 9 ? minutes : "0" + minutes) +
          `m : ` +
          (seconds > 9 ? seconds : "0" + seconds) +
          "s"
      );
    }
  };

  const clearTimer = (e) => {
    setTimer("00 : 00 : 00 : 00");
    if (Ref.current) clearInterval(Ref.current);
    const id = setInterval(() => {
      startTimer(e);
    }, 1000);
    Ref.current = id;
  };

  const getDeadTime = (n) => {
    let deadline = round1Time;
    if (n === 1) deadline = round1Time;
    else if (n === 2) deadline = round2Time;
    else if (n === 3) deadline = round3Time;
    else deadline = Date.now();
    sessionStorage.setItem("startTime", deadline);
    return deadline;
  };

  useEffect(() => {

    clearTimer(
      getDeadTime(
        new Date().getTime() < round1Time.getTime()
          ? 1
          : new Date().getTime() < round2Time.getTime()
          ? 2
          : 3
      )
    );
  }, [data]);

  return (
    <Stack
      marginLeft="2rem"
      marginRight="2rem"
      direction={matches ? "row" : "column"}
      alignItems="center"
      justifyContent="space-between"
    >
      {/* left side */}
      <Stack
        spacing={4}
        alignItems="center"
        justifyContent="center"
        minHeight={matches ? "80vh" : "100vh"}
        width="50%"
        color="white"
        sx={{ fontFamily: "Audiowide", textAlign: "center" }}
      >
        <Typography
          variant={matches ? "h2" : "h4"}
          sx={{ fontFamily: "Audiowide" }}
        >
          Welcome to Code2Clone!
        </Typography>
        
        <Box
          sx={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            gap: "2rem",
            flexDirection: "column",
          }}
        >
          {data && getCurrentRound() === "0" && (
            <>
              <div style={{ fontFamily: "Audiowide" }}>
                Next Round Begins in{" "}
              </div>
              <Chip
                label={timer}
                color="error"
                sx={{
                  fontSize: matches ? "30px" : "20px",
                  padding: "2rem",
                  fontFamily: "Audiowide",
                }}
              ></Chip>
            </>
          )}
          {!data && <Skeleton height="100px" width="500px" />}
        </Box>

        {/* start cloning button */}
        <Stack direction="row" spacing={4}>
          {!isLoading && getCurrentRound() !== "0" && (
            <>
              <Button
                color="warning"
                variant="contained"
                size="large"
                onClick={handleOpen2}
              >
                Start Cloning
              </Button>
            </>
          )}
          {!isLoading &&
            getCurrentRound() === "0" &&
            (
              <>
                <Button
                  color="warning"
                  variant="contained"
                  size="large"
                  onClick={handleOpen}
                >
                  View Results
                </Button>
              </>
            )}

          {/* MODAL */}
          {/* RESULTS */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open}
            onClose={handleClose}
            closeAfterTransition
          >
            {/* <Confetti width={width} height={height} tweenDuration={2000}/> */}
            <Fade in={open}>
              <Box sx={style}>
                <Typography
                  id="transition-modal-title"
                  variant="h4"
                  component="h2"
                  sx={{ width: "100%", textAlign: "center" }}
                >
                  Round-Wise Results
                </Typography>
                {data && (
                  <Typography
                    component="div"
                    id="transition-modal-description"
                    sx={{
                      mt: 2,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexDirection: "column",
                      gap: "2rem",
                    }}
                  >
                    <Box
                      component="div"
                      w="100%"
                      textAlign="center"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1.2rem",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6">Round 1</Typography>
                      <Typography>
                        {new Date().getTime() >
                        round1Time.getTime() + 60000 * 65
                          ? data.data.data.round2
                            ? "Qualified"
                            : "Disqualified"
                          : "Yet to be disclosed"}
                      </Typography>
                      {new Date().getTime() >
                      round1Time.getTime() + 60000 * 65 ? (
                        data.data.data.round2 ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )
                      ) : (
                        <TimerIcon color="warning" />
                      )}
                    </Box>
                    <Box
                      component="div"
                      textAlign="center"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1.2rem",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6">Round 2</Typography>
                      <Typography>
                        {new Date().getTime() >
                        round2Time.getTime() + 60000 * 65
                          ? data.data.data.round3
                            ? "Qualified"
                            : "Disqualified"
                          : "Yet to be disclosed"}
                      </Typography>
                      {new Date().getTime() >
                      round2Time.getTime() + 60000 * 65 ? (
                        data.data.data.round3 ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )
                      ) : (
                        <TimerIcon color="warning" />
                      )}
                    </Box>
                    <Box
                      component="div"
                      w="100%"
                      textAlign="center"
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        gap: "1.2rem",
                        width: "100%",
                      }}
                    >
                      <Typography variant="h6">Round 3</Typography>
                      <Typography>
                        {new Date().getTime() >
                        round3Time.getTime() + 60000 * 65
                          ? data.data.data.round3
                            ? "Qualified"
                            : "Disqualified"
                          : "Yet to be disclosed"}
                      </Typography>
                      {new Date().getTime() >
                      round3Time.getTime() + 60000 * 65 ? (
                        data.data.data.round3 ? (
                          <CheckCircleIcon color="success" />
                        ) : (
                          <CancelIcon color="error" />
                        )
                      ) : (
                        <>
                          <TimerIcon color="warning" />
                        </>
                      )}
                    </Box>
                  </Typography>
                )}
              </Box>
            </Fade>
          </Modal>

          {/* INSTRUCTIONS FOR EXAM */}
          <Modal
            aria-labelledby="transition-modal-title"
            aria-describedby="transition-modal-description"
            open={open2}
            onClose={handleClose2}
            closeAfterTransition
          >
            {/* <Confetti width={width} height={height} tweenDuration={2000}/> */}
            <Fade in={open2}>
              <Box sx={style}>
                {data && (
                  <>
                    <Typography
                      id="transition-modal-title"
                      variant="h4"
                      component="h2"
                      sx={{ width: "100%", textAlign: "center" }}
                    >
                      Instructions for the exam
                    </Typography>
                    <Instructions />
                    <Box sx={{ width: "100%", textAlign: "center" }}>
                      <Button
                        variant="contained"
                        color="error"
                        onClick={handleCloning}
                      >
                        Start Now
                      </Button>
                    </Box>
                  </>
                )}
              </Box>
            </Fade>
          </Modal>
        </Stack>

        {/* view results button */}
        <Stack direction="row">
          <IconButton area-label="web">
            <Tooltip title="Web Site" followCursor={true} arrow>
            <Link href="https://nandurijv.codes" target="_blank"><LanguageSharpIcon sx={{fontSize:"3rem",color:"gray",'&:hover':{color:"white"}}}/></Link></Tooltip>
          </IconButton>
          <IconButton area-label="insta">
            <Tooltip title="Instagram" followCursor={true} arrow>
            <Link href="https://nandurijv.codes" target="_blank"><InstagramIcon sx={{fontSize:"3rem",color:"gray",'&:hover':{color:"white"}}}/></Link></Tooltip>
          </IconButton>
          <IconButton area-label="twitter">
            <Tooltip title="Twitter" followCursor={true} arrow>
            <Link href="https://nandurijv.codes" target="_blank"><TwitterIcon sx={{fontSize:"3rem",color:"gray",'&:hover':{color:"white"}}}/></Link></Tooltip>
          </IconButton>
          <IconButton area-label="help">
            <Tooltip title="HelpDesk" followCursor={true} arrow>
            <Link href="https://help.com" target="_blank"><HelpIcon sx={{fontSize:"3rem",color:"gray",'&:hover':{color:"white"}}}/></Link></Tooltip>
          </IconButton>
        </Stack>
      </Stack>

      {/* right side */}
      <Stack
        spacing={4}
        alignItems="center"
        justifyContent="center"
        minHeight="80vh"
        width="50%"
        color="white"
      >
        <Typography variant="h4" sx={{ fontFamily: "Audiowide" }}>
          Leaderboard
        </Typography>
        <Leaderboard/>
      </Stack>
    </Stack>
  );
}

export default TestStarter;
