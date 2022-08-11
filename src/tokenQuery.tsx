import { gql } from "@apollo/client";

export const DROPCASE_TOKENS = gql`
  query GetDropCaseTokens($contractAddr: String!, $tokenId: Int!) {
    genericSmartBaskets(
      where: { contractAddress: $contractAddr, tokenId_in: [$tokenId] }
    ) {
      id
      contractAddress
      tokenId
      managerId

      totalTokens
      tokenBalances {
        id
        nftTokenAddress
        nftTokenIds
        nftsById {
          tokenId
          tokenBalance
        }
      }
    }

    genericSmartWallets(
      where: { contractAddress: $contractAddr, tokenId_in: [$tokenId] }
    ) {
      id
      contractAddress
      tokenId
      assetTokens
      assetBalances {
        id
        assetToken
        principal
      }
    }
  }
`;
