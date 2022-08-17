import styled from "@emotion/styled";
import {
  Alert,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControlLabel,
  Paper,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import ArrowCircleLeftIcon from "@mui/icons-material/ArrowCircleLeft";
import ArrowCircleRightIcon from "@mui/icons-material/ArrowCircleRight";
import { Stack } from "@mui/system";
import { ethers } from "ethers";
import React, { useEffect, useState } from "react";

const ColorButton = styled(Button)(({ theme }) => ({
  backgroundColor: "brown",
  "&:hover": {
    backgroundColor: "brown",
  },
}));

const MainPage = (props) => {
  const [messages, setMessages] = useState({
    name: "",
    message: "",
  });
  const [index, setIndex] = useState(0);
  const [state, setState] = React.useState(true);
  const [progress, setProgress] = useState(false);
  const [coffee, setCoffee] = useState("");
  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [open2, setOpen2] = useState(false);
  const [owner, setOwner] = useState("");
  const [memos, setMemos] = useState([
    {
      name: "ABC",
      message: "Have a nice Day",
      from: "0xa2b2....sb121ac",
    },
  ]);
  const getMemo = async () => {
    const arrayMemo = await props.web3.contract.getMemos();
    if (arrayMemo.length > 0) setMemos(arrayMemo);
  };

  useEffect(() => {
    props.web3.contract && getMemo();
  }, [props.web3.contract, props.account]);

  const { name, message, from } = memos[index];

  const handleMessage = (event) => {
    const { name, value } = event.target;
    setMessages((prevState) => {
      return {
        ...prevState,
        [name]: value,
      };
    });
  };
  const moveRight = () => {
    if (index < props.memos.length - 1) setIndex(index + 1);
    else setIndex(0);
  };
  const moveLeft = () => {
    if (index === 0) setIndex(props.memos.length - 1);
    else setIndex(index - 1);
  };
  const selectCoffee = (event) => {
    setCoffee(event.target.value);
  };
  const handleChange = () => {
    setState(!state);
  };
  const buyCoffee = async (event) => {
    event.preventDefault();
    setProgress(true);
    const { name, message } = messages;
    const signer = await props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    if (coffee === "regular") {
      const tx = await contractInstance.buyCoffeeSmall(name, message, {
        value: ethers.utils.parseEther("0.001"),
      });
      await tx.wait();
    } else {
      const tx = await contractInstance.buyCoffeeLarge(name, message, {
        value: ethers.utils.parseEther("0.003"),
      });
      await tx.wait();
    }
    setTimeout(() => {
      setProgress(false);
      setOpen(true);
      setMessages({ name: "", message: "" });
      getMemo();
    }, 2000);
  };

  const handleClose = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpen(false);
  };

  const withdrawMoney = async () => {
    setProgress(true);
    const signer = await props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    const tx = await contractInstance.withdraw();
    await tx.wait();
    setTimeout(() => {
      setProgress(false);
      setOpen1(true);
    }, 2000);
  };
  const updateOwner = async () => {
    setProgress(true);
    const signer = await props.web3.provider.getSigner();
    const contractInstance = props.web3.contract.connect(signer);
    const tx = await contractInstance.updateOwner(owner);
    await tx.wait();
    setTimeout(() => {
      setProgress(false);
      setOpen2(true);
      setOwner("");
    }, 2000);
  };
  return (
    <Box sx={{ margin: "50px", position: "absolute" }}>
      <ColorButton
        size="large"
        variant="contained"
        onClick={() => handleChange()}
        sx={{ margin: "30px" }}
      >
        {state ? "Withdraw / Change the Owner" : "Switch Back"}
      </ColorButton>
      {state ? (
        <Stack direction="row" spacing={5}>
          <Paper
            elevation={10}
            sx={{
              width: "400px",
              height: "400px",
              borderRadius: "20px",
              bgcolor: "#A97A56",
              textAlign: "center",
            }}
          >
            <Typography variant="h6" mt={2}>
              Leave a note!!
            </Typography>
            <form onSubmit={buyCoffee}>
              <Stack spacing={3} sx={{ width: "80%", margin: "auto" }}>
                <TextField
                  name="name"
                  id="standard-basic"
                  label="Name"
                  variant="standard"
                  color="secondary"
                  value={messages.name}
                  onChange={handleMessage}
                  required
                />
                <TextField
                  name="message"
                  id="standard-basic"
                  label="Message"
                  variant="standard"
                  color="secondary"
                  value={messages.message}
                  onChange={handleMessage}
                  required
                />
                <RadioGroup
                  aria-labelledby="demo-error-radios"
                  name="BuyCoffee"
                  value={coffee}
                  onChange={selectCoffee}
                  defaultValue={coffee}
                >
                  <FormControlLabel
                    value="regular"
                    control={<Radio />}
                    label="Regular Coffee 0.001 ETH"
                  />
                  <FormControlLabel
                    value="large"
                    control={<Radio />}
                    label="Large Coffee 0.003 ETH"
                  />
                </RadioGroup>
                <Button type="submit" variant="">
                  Buy
                </Button>
              </Stack>
            </form>
          </Paper>
          <Paper
            elevation={10}
            sx={{
              width: "400px",
              height: "400px",
              borderRadius: "20px",
              bgcolor: "#A97A56",
              textAlign: "center",
            }}
          >
            {memos.length !== 0 ? (
              <>
                <Typography variant="h3" sx={{ color: "brown" }}>
                  Memos
                </Typography>
                <Box sx={{ margin: "50px auto" }}>
                  <Stack spacing={2}>
                    <Typography variant="caption">{from}</Typography>
                    <Typography variant="h5">{name}</Typography>
                    <Typography variant="h5">{message}</Typography>
                  </Stack>
                </Box>
                <Button onClick={moveLeft}>
                  <ArrowCircleLeftIcon
                    sx={{ color: "white", fontSize: "1cm" }}
                  />
                </Button>
                <Button onClick={moveRight}>
                  <ArrowCircleRightIcon
                    sx={{ color: "white", fontSize: "1cm" }}
                  />
                </Button>
              </>
            ) : (
              <Typography variant="h4" color="white">
                NO MEMOS!!!
              </Typography>
            )}
          </Paper>
        </Stack>
      ) : (
        <>
          {props.account === props.owner ? (
            <Paper
              sx={{
                padding: "20px",
                borderRadius: "20px",
                bgcolor: "#A97A56",
              }}
            >
              <Stack spacing={3}>
                <TextField
                  color="secondary"
                  size="small"
                  label="Address 0x1213..."
                  value={owner}
                  onChange={(event) => setOwner(event.target.value)}
                />
                <ColorButton
                  size="large"
                  variant="contained"
                  onClick={() => updateOwner()}
                >
                  Update owner
                </ColorButton>
                <ColorButton
                  size="large"
                  variant="contained"
                  onClick={() => withdrawMoney()}
                >
                  Withdraw Money
                </ColorButton>
              </Stack>
            </Paper>
          ) : (
            <Typography variant="h4" color="white">
              YOU ARE NOT AUTHORIZED
            </Typography>
          )}
        </>
      )}

      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={progress}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <Snackbar open={open} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Thanks For the Coffee!!!
        </Alert>
      </Snackbar>
      <Snackbar open={open1} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Money Successfully Withdraw!!!
        </Alert>
      </Snackbar>
      <Snackbar open={open2} autoHideDuration={4000} onClose={handleClose}>
        <Alert onClose={handleClose} severity="success" sx={{ width: "100%" }}>
          Owner Updated Successfully!!!
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default MainPage;
