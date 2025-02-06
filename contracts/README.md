## Rebuild
```
forge clean && forge build
```

## Deploy using Foundry -> Sepolia and Mainnet
```
source .env

forge script script/deploy-usdSONYA.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verify

forge script script/deploy-rSONYA.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verify

forge script script/deploy-staking.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verify

forge script script/deploy-marketplace.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verify

forge script script/transfer-rSonya-to-staking.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY

forge script script/transfer-to-marketplace.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY
```

## Transfer Tokens to Marketplace and to Staking
```
source .env
forge script script/transfer-to-marketplace.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY


## Deploy using Foundry -> zksync
```
source .env
# zkSync Sepolia
forge script script/deploy-deposit.s.sol --zksync --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification --verify

forge script script/deploy-vesting.s.sol --zksync --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verifier zksync --verifier-url https://explorer.sepolia.era.zksync.dev/contract_verification --verify



#zkSync Mainnet
forge script script/deploy-deposit.s.sol --zksync --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verifier zksync --verify

forge script script/deploy-vesting.s.sol --broadcast --fork-url $RPC_URL  --private-key $PRIVATE_KEY --verify
```
