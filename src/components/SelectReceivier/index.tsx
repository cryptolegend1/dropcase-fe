import {
  Box,
  Button,
  Divider,
  FormControl,
  FormGroup,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  DropcaseContextType,
  useDropcaseContext,
} from "../../context/dropcase";
import { useWalletContext, WalletContextType } from "../../context/wallet";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import { useState } from "react";
import { ethers } from "ethers";

const SelectReceivier = ({
  onSelectReceiver,
  selectedNFT,
}: {
  onSelectReceiver: (value: string, sendingDropcase: boolean) => void;
  selectedNFT: number;
}) => {
  const { currentDropcaseId, setCurrentDropcaseId, dropcaseTokenIds } =
    useDropcaseContext() as DropcaseContextType;
  const { account } = useWalletContext() as WalletContextType;
  const [isAddress, setIsAddress] = useState(false);
  const [address, setAddress] = useState("");

  return (
    <Box sx={{ mt: "20px", minWidth: "400px" }}>
      {account && dropcaseTokenIds.length && (
        <FormGroup>
          <FormControl sx={{ mb: "30px" }}>
            <TextField
              id="address"
              label="Public Address"
              variant="outlined"
              value={address}
              onChange={(e: any) => {
                setIsAddress(ethers.utils.isAddress(e.target.value));
                setAddress(e.target.value);
              }}
            />
          </FormControl>

          <FormControl sx={{ minWidth: 200 }}>
            {!isAddress && !!selectedNFT && (
              <Stack divider={<Divider flexItem />}>
                {dropcaseTokenIds.map(
                  (dropcaseId: number, idx: number) =>
                    dropcaseId !== currentDropcaseId && (
                      <Box
                        key={idx}
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          gap: "20px",
                          p: "20px 0",
                          cursor: "pointer",
                        }}
                        onClick={() => {
                          onSelectReceiver(dropcaseId.toString(), false);
                        }}
                      >
                        <AccountCircleIcon /> Dropcase {dropcaseId}
                      </Box>
                    )
                )}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    gap: "20px",
                    p: "20px 0",
                    cursor: "pointer",
                  }}
                  onClick={() => {
                    onSelectReceiver(account, false);
                  }}
                >
                  <Typography color="primary">
                    Send To Connected Wallet
                  </Typography>
                </Box>
              </Stack>
            )}

            {!!isAddress && (
              <Box
                sx={{ display: "flex", justifyContent: "center", gap: "20px" }}
              >
                {!!selectedNFT && (
                  <Button
                    variant="contained"
                    onClick={() => {
                      onSelectReceiver(address, false);
                    }}
                  >
                    Send NFT
                  </Button>
                )}

                <Button
                  variant="contained"
                  onClick={() => {
                    onSelectReceiver(address, true);
                  }}
                >
                  Send Dropcase
                </Button>
              </Box>
            )}
          </FormControl>
        </FormGroup>
      )}
    </Box>
  );
};
export default SelectReceivier;
