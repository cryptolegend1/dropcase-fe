import { useCallback } from "react";
import { Button } from "@mui/material";

const ConnectWalletButton = function () {
  return (
    <Button
      size="large"
      variant="contained"
      color="secondary"
      sx={{ height: "100%", fontSize: "16px" }}
    >
      Connect To Wallet
    </Button>
  );
};

export default ConnectWalletButton;
