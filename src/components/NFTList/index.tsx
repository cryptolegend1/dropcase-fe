import { Box, Divider, Stack, Typography } from "@mui/material";

const NFTList = ({
  nftData,
  onSelectNFT,
}: {
  nftData: any[];
  onSelectNFT: any;
}) => {
  return (
    <Box>
      <Typography>NFTs available </Typography>
      <Stack divider={<Divider flexItem />}>
        {nftData.map((nft: any, idx: number) => (
          <Box
            key={idx}
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: "20px",
              p: "20px 0",
              cursor: "pointer",
            }}
            onClick={() => onSelectNFT({ ...nft, amount: 1 })}
          >
            <Box component="img" src={nft.image} sx={{ width: "50px" }} />
            <Typography>
              {nft.name} #{nft.tokenId} (balance: {nft.balance})
            </Typography>
          </Box>
        ))}
      </Stack>
    </Box>
  );
};
export default NFTList;
