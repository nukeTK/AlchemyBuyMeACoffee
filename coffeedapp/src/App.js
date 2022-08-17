import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import coffee from "./artifacts/contracts/BuyMeCoffee.sol/BuyMeCoffee.json";
import Button from "@mui/material/Button";
import { Alert, Box, Paper, Stack, Typography } from "@mui/material";
import MainPage from "./components/MainPage";
const coffeeAddress = "0x4E4f6b2D616848FD8d44445e54007AB2bDbB590a";
const App = () => {
  const [web3, setWeb3] = useState({
    provider: "",
    contract: "",
  });
  const [chainID, setChainID] = useState(false);
  const [account, setAccount] = useState("");
 
  const [change,setChange] =useState(false);
  const [admin, setAdmin] = useState("");
  const connectToWallet = async () => {
    const _provider = new ethers.providers.Web3Provider(window.ethereum);
    if (_provider) {
      await _provider.send("eth_requestAccounts", []);
      const _contract = new ethers.Contract(
        coffeeAddress,
        coffee.abi,
        _provider
      );
      const _signer = _provider.getSigner();
      const _account = await _signer.getAddress();
      const _admin = await _contract.owner();
      setAdmin(_admin);
      setAccount(_account);
      setWeb3({
        provider: _provider,
        contract: _contract,
      });
      setChange(true);
    }
  };
  useEffect(() => {
    const accountsChanged = () => {
      window.ethereum.on("accountsChanged", async (acc) => {
        if (acc.length === 0) console.log("please connect to accounts");
        else if (acc[0] !== account) setAccount(acc[0]);
      });
    };
    web3.provider && accountsChanged();
  }, [web3.provider, account]);

  useEffect(() => {
    const checkChainID = async () => {
      if (window.ethereum) {
        const currentChainId = await window.ethereum.request({
          method: "eth_chainId",
        });
        const chain = parseInt(currentChainId);
        if (chain.toString() === "5") setChainID(true);
        else setChainID(false);
      }
    };
    web3.provider && checkChainID();
  }, [web3.provider, account, chainID]);




  return (
    <Box>
     { !account &&  <Paper
          elevation={10}
          sx={{
            margin: "200px 200px",
            position: "absolute",
            width: "20%",
            height: "40%",
            borderRadius: "10px",
            bgcolor: "#724928",
          }}
        >
          <Stack
            spacing={2}
            sx={{
              margin: "50px auto",
              textAlign: "center",
              alignItems: "center",
            }}
          >
            <Typography variant="h3">Buy nukeTK a Coffee!!!!</Typography>
            <Button
              variant=""
              size="small"
              sx={{ width: "50%" }}
              onClick={() => connectToWallet()}
            >
              Connect To Wallet
            </Button>
          </Stack>
        </Paper>
}

      {change && (
        <MainPage web3={web3} account={account} owner={admin}/>
      )}
      {!chainID && <Alert variant="filled" severity="warning" sx={{justifyContent:"center"}}>
      Install MetaMask Wallet, Switch to Goerli Network, if you already did that,click on connect to wallet warning will disappear automatically!!!
    </Alert>}
    </Box>
  );
};

export default App;
