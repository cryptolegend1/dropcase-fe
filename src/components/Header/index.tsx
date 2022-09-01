import React, { useEffect, useRef, useState } from "react";
import Menu from "@mui/material/Menu";
import { Box, Button, Divider, TextField, Typography } from "@mui/material";
import { formatAddress, toHex } from "utils";
import Web3Modal from "web3modal";
import { ethers } from "ethers";
import { useWalletContext, WalletContextType } from "../../context/wallet";
import {
  useDropcaseContext,
  DropcaseContextType,
} from "../../context/dropcase";
import { providerOptions } from "utils/providerOptions";
import erc721ABI from "abi/erc721.json";
import erc1155ABI from "abi/erc1155.json";
import cpABI from "@charged-particles/protocol-subgraph/abis/ChargedParticles.json";
import dropcaseABI from "abi/dropcase.json";
import NFTList from "components/NFTList";
import SingleNFT from "components/SingleNFT";
import SelectReceivier from "components/SelectReceivier";

import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import networkParams from "config/network";
import nftContracts from "config/nftsContracts";

let web3Modal: Web3Modal;
if (typeof window !== "undefined") {
  web3Modal = new Web3Modal({
    network: "mainnet", // optional
    cacheProvider: true, // optional
    providerOptions, // required
  });
}
import { useRouter } from "next/router";
import { createAlchemyWeb3 } from "@alch/alchemy-web3";

/**
 * Header component
 * @example
 * <Header />
 */
const Header = (): JSX.Element => {
  const {
    provider,
    setProvider,
    library,
    setLibrary,
    account,
    setAccount,
    chainId,
    setChainId,
    network,
    setNetwork,
  } = useWalletContext() as WalletContextType;
  const {
    currentDropcaseId,
    currentNFT,
    isTxnProcessing,
    setIsTxnProcessing,
    alchemyWeb3,
    setAlchemyWeb3,
  } = useDropcaseContext() as DropcaseContextType;
  const [error, setError] = useState("");
  const [nftData, setNftData] = useState<any>([]);
  const [depositAnchorEl, setDepositAnchorEl] = React.useState(null);
  const [sendAnchorEl, setSendAnchorEl] = React.useState(null);
  const [selectedNFT, setSelectedNFT] = useState<any>(null);
  const [depositStep, setDepositStep] = useState(0);
  const [sendStep, setSendStep] = useState(0);
  const [receiverAddress, setReceiverAddress] = useState("");

  const router = useRouter();

  const depositMenuOpen = Boolean(depositAnchorEl);
  const sendMenuOpen = Boolean(sendAnchorEl);

  let nftContract = useRef<any>(null);
  let cpContract = useRef<any>(null);

  const handleClickDeposit = (event: any) => {
    setDepositAnchorEl(event.currentTarget);
  };

  const handleCloseDepositMenu = () => {
    setDepositAnchorEl(null);
  };
  const handleClickSend = (event: any) => {
    setSendAnchorEl(event.currentTarget);
  };

  const handleCloseSendMenu = () => {
    setSendAnchorEl(null);
  };

  const connectWallet = async () => {
    try {
      if (account) {
        disconnect();
        return;
      }
      const provider = await web3Modal.connect();
      const library = new ethers.providers.Web3Provider(provider);
      const accounts = await library.listAccounts();
      const network = await library.getNetwork();
      setNetwork(network.chainId);
      if (
        process.env.NEXT_PUBLIC_CHAIN_ID &&
        network.chainId !== +process.env.NEXT_PUBLIC_CHAIN_ID
      ) {
        console.log("incorrect network");
        switchNetwork();
      }
      setProvider(provider);
      setLibrary(library);
      if (accounts) setAccount(accounts[0]);
      setChainId(network.chainId);
      const web3 = createAlchemyWeb3(process.env.NEXT_PUBLIC_RPC_URL || "");
      setAlchemyWeb3(web3);
    } catch (error: any) {
      setError(error);
    }
  };

  const switchNetwork = async () => {
    try {
      if (
        library &&
        library.provider.request &&
        process.env.NEXT_PUBLIC_CHAIN_ID
      ) {
        await library.provider.request({
          method: "wallet_switchEthereumChain",
          params: [{ chainId: toHex(+process.env.NEXT_PUBLIC_CHAIN_ID) }],
        });
        setNetwork(+process.env.NEXT_PUBLIC_CHAIN_ID);
      }
    } catch (switchError: any) {
      if (
        switchError.code === 4902 &&
        library &&
        library.provider.request &&
        process.env.NEXT_PUBLIC_CHAIN_ID
      ) {
        try {
          await library.provider.request({
            method: "wallet_addEthereumChain",
            params: [networkParams[toHex(+process.env.NEXT_PUBLIC_CHAIN_ID)]],
          });
          setNetwork(+process.env.NEXT_PUBLIC_CHAIN_ID);
        } catch (error: any) {
          setError(error);
        }
      }
    }
  };

  const refreshState = () => {
    setAccount("");
    setChainId(0);
    setNetwork(0);
  };

  const disconnect = async () => {
    await web3Modal.clearCachedProvider();
    refreshState();
  };

  useEffect(() => {
    if (web3Modal.cachedProvider) {
      connectWallet();
    }
  }, []);

  useEffect(() => {
    if (provider?.on) {
      const handleAccountsChanged = (accounts: string[]) => {
        console.log("accountsChanged", accounts);
        if (accounts) setAccount(accounts[0]);
        router.reload();
      };

      const handleChainChanged = (_hexChainId: number) => {
        setChainId(_hexChainId);
      };

      const handleDisconnect = () => {
        console.log("disconnect", error);
        disconnect();
      };

      provider.on("accountsChanged", handleAccountsChanged);
      provider.on("chainChanged", handleChainChanged);
      provider.on("disconnect", handleDisconnect);

      return () => {
        if (provider.removeListener) {
          provider.removeListener("accountsChanged", handleAccountsChanged);
          provider.removeListener("chainChanged", handleChainChanged);
          provider.removeListener("disconnect", handleDisconnect);
        }
      };
    }
  }, [provider]);

  useEffect(() => {
    (async () => {
      try {
        if (
          process.env.NEXT_PUBLIC_CHAIN_ID &&
          account &&
          library &&
          network === +process.env.NEXT_PUBLIC_CHAIN_ID
        ) {
          const nfts = await alchemyWeb3.alchemy.getNfts({
            owner: account,
            contractAddresses: nftContracts[process.env.NEXT_PUBLIC_CHAIN_ID],
          });
          const _nfts = await Promise.all(
            nfts.ownedNfts.map(async (nft: any) => {
              try {
                let nftName;

                nftContract.current = new ethers.Contract(
                  nft.contract.address,
                  nft.id.tokenMetadata.tokenType === "ERC721"
                    ? erc721ABI
                    : erc1155ABI,
                  library
                );
                if (!nft.title && nft.id.tokenMetadata.tokenType === "ERC721") {
                  nftName = await nftContract.current.name();
                } else {
                  nftName = nft.title;
                }

                const res = {
                  tokenId: Number(nft.id.tokenId),
                  name: nftName,
                  image: nft.media[0].gateway || "placeholder.png",
                  balance: +nft.balance,
                  address: nft.contract.address,
                };
                return res;
              } catch (err) {
                console.log(err);
              }
            })
          );
          setNftData(_nfts);
        }
        if (process.env.NEXT_PUBLIC_CP_CONTRACT && account && library) {
          const signer = library.getSigner();
          cpContract.current = new ethers.Contract(
            process.env.NEXT_PUBLIC_CP_CONTRACT,
            cpABI,
            signer
          );
        }
      } catch (err) {
        console.error(err);
      }
    })();
  }, [account, library]);

  const onSelectNFT = (nft: any) => {
    setSelectedNFT(nft);
    setDepositStep(depositStep + 1);
  };

  const handleDepositNFT = async (selectedNFT: any) => {
    if (process.env.NEXT_PUBLIC_CP_CONTRACT && library) {
      setIsTxnProcessing(true);
      toast("Depositing NFT...", { autoClose: false });
      try {
        const txn = await cpContract.current.covalentBond(
          process.env.NEXT_PUBLIC_DROPCASE_CONTRACT,
          currentDropcaseId,
          "generic.B",
          selectedNFT.address,
          +selectedNFT.tokenId,
          selectedNFT.amount
        );
        const depositNFTRes = await txn.wait();

        if (depositNFTRes) {
          toast("Deposited NFT! 👌");

          setDepositStep(0);
          setIsTxnProcessing(false);
          router.reload();
        }
      } catch (err: any) {
        console.log(err);
        toast.dismiss();
        if (err.message) toast(err.message);
        setIsTxnProcessing(false);
      }
    }
  };

  const onSelectReceiver = async (value: string, sendingDropcase: boolean) => {
    if (sendingDropcase) {
      toast("Sending Dropcase...", { autoClose: false });
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DROPCASE_CONTRACT!,
        dropcaseABI,
        library!.getSigner()
      );
      const txn = await contract.transferFrom(
        account,
        value,
        currentDropcaseId
      );
      await txn.wait();
      toast.dismiss();
      toast("Sent Dropcase! 👌");
      router.reload();
    } else {
      setSelectedNFT(currentNFT);

      setReceiverAddress(value);

      setSendStep(sendStep + 1);
    }
  };

  const handleSendNFT = async (selectedNFT: any) => {
    if (process.env.NEXT_PUBLIC_CP_CONTRACT && library) {
      setIsTxnProcessing(true);
      toast("Withdrawing NFT...", { autoClose: false });
      try {
        const txn = await cpContract.current.breakCovalentBond(
          account,
          process.env.NEXT_PUBLIC_DROPCASE_CONTRACT,
          currentDropcaseId,
          "generic.B",
          selectedNFT.address,
          +selectedNFT.tokenId,
          selectedNFT.amount
        );
        const withdrawNFTRes = await txn.wait();

        if (
          withdrawNFTRes &&
          !(
            ethers.utils.isAddress(receiverAddress) &&
            receiverAddress === account
          )
        ) {
          toast.dismiss();
          toast("Withdrew NFT and tranferring NFT...", { autoClose: false });
          nftContract.current = new ethers.Contract(
            selectedNFT.address,
            selectedNFT.tokenType === "ERC721" ? erc721ABI : erc1155ABI,
            library
          );
          if (ethers.utils.isAddress(receiverAddress)) {
            const txn2 =
              selectedNFT.tokenType === "ERC721"
                ? await nftContract.current.safeTransferFrom(
                    account,
                    receiverAddress,
                    selectedNFT.tokenId
                  )
                : await nftContract.current.safeTransferFrom(
                    account,
                    receiverAddress,
                    selectedNFT.tokenId,
                    selectedNFT.amount,
                    "0x0"
                  );
            await txn2.wait();
            toast.dismiss();
            toast("Transferred NFT 👌");
          } else {
            const txn2 = await cpContract.current.covalentBond(
              process.env.NEXT_PUBLIC_DROPCASE_CONTRACT,
              +receiverAddress,
              "generic.B",
              selectedNFT.address,
              +selectedNFT.tokenId,
              selectedNFT.amount
            );
            await txn2.wait();
            toast.dismiss();
            toast("Transferred NFT 👌");
          }
          setSendStep(0);
          setIsTxnProcessing(false);
          router.reload();
        } else if (
          withdrawNFTRes &&
          ethers.utils.isAddress(receiverAddress) &&
          receiverAddress === account
        ) {
          toast.dismiss();
          toast("Successfully withdrew NFT");
          setIsTxnProcessing(false);
          router.reload();
        }
      } catch (err) {
        console.log(err);
        setIsTxnProcessing(false);
      }
    }
  };

  const handleClickMint = async () => {
    try {
      toast("Minting Dropcase...", { autoClose: false });
      const contract = new ethers.Contract(
        process.env.NEXT_PUBLIC_DROPCASE_CONTRACT!,
        dropcaseABI,
        library!.getSigner()
      );
      const txn = await contract.mintNft(account, "");
      await txn.wait();
      toast.dismiss();
      toast("Minted Dropcase! 👌");
      router.reload();
    } catch (err) {
      toast.dismiss();
    }
  };

  return (
    <Box
      sx={{
        display: "flex",
        m: "17px 40px",
        justifyContent: "space-between",
      }}
    >
      <ToastContainer />
      <Box sx={{ display: "flex", gap: "30px" }}>
        <Box>
          <Button
            variant="outlined"
            disabled={!account || !currentDropcaseId}
            onClick={handleClickDeposit}
          >
            Deposit
          </Button>
          <Menu
            id="deposit-menu"
            anchorEl={depositAnchorEl}
            open={depositMenuOpen}
            onClose={handleCloseDepositMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{ mt: "50px" }}
          >
            <Box p="20px" textAlign="center">
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  onClick={() => {
                    setDepositStep(depositStep - 1);
                  }}
                  disabled={!depositStep}
                >
                  <Typography color="primary" sx={{ fontSize: "12px" }}>
                    {!!depositStep && "Back"}
                  </Typography>
                </Button>

                <Box>
                  <Typography variant="h6">Deposit</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    Mumbai testnet
                  </Typography>
                </Box>
                <Button onClick={handleCloseDepositMenu}>
                  <Typography color="primary" sx={{ fontSize: "12px" }}>
                    Cancel
                  </Typography>
                </Button>
              </Box>

              {!depositStep && currentDropcaseId && (
                <NFTList nftData={nftData} onSelectNFT={onSelectNFT} />
              )}

              {depositStep === 1 && (
                <SingleNFT
                  selectedNFT={selectedNFT}
                  setSelectedNFT={setSelectedNFT}
                  handleNext={() => setDepositStep(depositStep + 1)}
                />
              )}
              {depositStep === 2 && (
                <Box>
                  <Box mt="20px">
                    <TextField
                      id="from"
                      label="From"
                      value={formatAddress(account)}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                  <Box mt="20px">
                    <TextField
                      id="to"
                      label="To"
                      value={`DropCase ${currentDropcaseId} `}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                  <Divider sx={{ my: "20px" }} />
                  <SingleNFT
                    selectedNFT={selectedNFT}
                    imgSize="small"
                    handleNext={() => handleDepositNFT(selectedNFT)}
                    step="Deposit"
                  />
                </Box>
              )}
            </Box>
          </Menu>
        </Box>
        <Box>
          <Button
            variant="outlined"
            disabled={!account || !currentDropcaseId}
            onClick={handleClickSend}
          >
            Send
          </Button>
          <Menu
            id="send-menu"
            anchorEl={sendAnchorEl}
            open={sendMenuOpen}
            onClose={handleCloseSendMenu}
            MenuListProps={{
              "aria-labelledby": "basic-button",
            }}
            sx={{ mt: "50px" }}
          >
            <Box p="20px" textAlign="center">
              <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                <Button
                  onClick={() => setSendStep(sendStep - 1)}
                  disabled={!sendStep}
                >
                  <Typography color="primary" sx={{ fontSize: "12px" }}>
                    {!!sendStep && "Back"}
                  </Typography>
                </Button>

                <Box>
                  <Typography variant="h6">Send</Typography>
                  <Typography sx={{ fontSize: "12px" }}>
                    Mumbai testnet
                  </Typography>
                </Box>
                <Button onClick={handleCloseSendMenu}>
                  <Typography color="primary" sx={{ fontSize: "12px" }}>
                    Cancel
                  </Typography>
                </Button>
              </Box>
              {!sendStep && (
                <SelectReceivier
                  onSelectReceiver={onSelectReceiver}
                  selectedNFT={currentNFT}
                />
              )}
              {sendStep === 1 && (
                <SingleNFT
                  selectedNFT={currentNFT}
                  handleNext={() => setSendStep(sendStep + 1)}
                />
              )}
              {sendStep === 2 && (
                <Box mt="20px">
                  <Typography variant="subtitle2" sx={{ textAlign: "left" }}>
                    Sending NFT will be done in 2 transactions: <br />
                    1.Withdraw NFT from Dropcase to your wallet
                    <br />
                    2. Send the NFT from your wallet to receiving address
                  </Typography>
                  <Box mt="20px">
                    <TextField
                      id="from"
                      label="From"
                      value={`Dropcase ${currentDropcaseId}`}
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                  <Box mt="20px">
                    <TextField
                      id="to"
                      label="To"
                      value={
                        ethers.utils.isAddress(receiverAddress)
                          ? formatAddress(receiverAddress!)
                          : `Dropcase ${receiverAddress!}`
                      }
                      InputProps={{
                        readOnly: true,
                      }}
                    />
                  </Box>
                  <Divider sx={{ mt: "20px" }} />
                  <SingleNFT
                    selectedNFT={selectedNFT}
                    imgSize="small"
                    handleNext={() => handleSendNFT(selectedNFT)}
                    step="Send"
                  />
                </Box>
              )}
            </Box>
          </Menu>
        </Box>
        {/* <Button
          variant="outlined"
          disabled={!account}
          onClick={handleClickMint}
        >
          Mint Dropcase
        </Button> */}
        <Button variant="outlined" disabled>
          Chain
        </Button>
        <Button variant="outlined" disabled>
          Claim
        </Button>

        <Button
          variant="contained"
          color="secondary"
          onClick={connectWallet}
          sx={{ align: "right" }}
        >
          {account ? formatAddress(account) : "Connect Wallet"}
        </Button>
      </Box>
    </Box>
  );
};

export default Header;
