import {
  Box,
  Button,
  FormControl,
  Skeleton,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";
import {
  DropcaseContextType,
  useDropcaseContext,
} from "../../context/dropcase";

const SingleNFT = ({
  selectedNFT,
  setSelectedNFT,
  imgSize = "large",
  handleNext,
  step = "Next",
}: {
  selectedNFT: any;
  setSelectedNFT?: any;
  imgSize?: string;
  handleNext: any;
  step?: string;
}) => {
  const { isTxnProcessing } = useDropcaseContext() as DropcaseContextType;
  const [amount, setAmount] = useState(1);
  return (
    <Box
      sx={{
        mt: "20px",
        display: "flex",
        flexDirection: "column",
        gap: "40px",
        alignItems: "center",
      }}
    >
      <Box
        component="img"
        src={selectedNFT.image}
        sx={{ width: imgSize === "large" ? "300px" : "150px" }}
      />

      <Typography variant="h5">{selectedNFT.name}</Typography>
      {selectedNFT.balance > 1 && setSelectedNFT && (
        <FormControl sx={{ mb: "30px" }}>
          <TextField
            id="amount"
            label="Amount"
            variant="outlined"
            value={amount}
            type="number"
            inputProps={{ min: 1, max: selectedNFT.balance }}
            onChange={(e: any) => {
              setAmount(e.target.value);
              setSelectedNFT({ ...selectedNFT, amount: +e.target.value });
            }}
          />
        </FormControl>
      )}
      {selectedNFT.amount > 1 && (
        <Typography>Amount: {selectedNFT.amount}</Typography>
      )}
      <Button variant="contained" onClick={handleNext}>
        {isTxnProcessing ? "Processing transaction..." : step}
      </Button>
    </Box>
  );
};

export default SingleNFT;
