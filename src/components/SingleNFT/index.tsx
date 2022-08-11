import { Box, Button, Skeleton, Typography } from "@mui/material";
import {
  DropcaseContextType,
  useDropcaseContext,
} from "../../context/dropcase";

const SingleNFT = ({
  selectedNFT,
  imgSize = "large",
  handleNext,
  step = "Next",
}: {
  selectedNFT: any;
  imgSize?: string;
  handleNext: any;
  step?: string;
}) => {
  const { isTxnProcessing } = useDropcaseContext() as DropcaseContextType;
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
      <Typography>#{selectedNFT.tokenId}</Typography>
      <Button variant="contained" onClick={handleNext}>
        {isTxnProcessing ? "Processing transaction..." : step}
      </Button>
    </Box>
  );
};

export default SingleNFT;
