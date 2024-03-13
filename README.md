# Project: Collateralized Loan Smart Contract Development

In this project, you will develop, deploy, and interact with a simple collateralized loan contract on the Ethereum blockchain using Solidity. This contract will manage loans backed by Ethereum as collateral, offering hands-on experience with real-world financial smart contracts.

## Deployed Contract
URL : https://sepolia.etherscan.io/address/0xe698a51583c5c43f22291b3c39f4f055bdf40d5d

### Installation

Head over to `hardhat-js` and install the necessary dependencies with the following command.

```
npm install
```

You will also find a file `.env.example` , you will need to create a `.env` file similar to that.

```
ALCHEMY_API_URL=
INFURA_API_URL=
ACCOUNT_PRIVATE_KEY=
```

** I am using Alchemy API for contract deployment as Infura was asking me to add 0.001 ETH in metamask before providing the test ETHs. But I have configured the project with Infura as well, you can choose preferred API. **

Add your wallet private key and [infura](https://www.infura.io/) API URL.
Add [alchemy](https://dashboard.alchemy.com/apps) API URL.

### Deployment

For deployment with Infura use `npm run deploy:infura`.
For deployment with Alchemy use `npm run deploy:alchemy`.

## Testing

To run the test file use `npm run test`

## License

[License](LICENSE.txt)
