require('dotenv').config();  // Ensure dotenv is loaded correctly
const Web3 = require('web3');
const { toWei, fromWei } = Web3.utils;

// Initialize Web3 with Infura provider
const web3 = new Web3(new Web3.providers.HttpProvider(process.env.INFURA_URL));

// Define wallet private keys and the USDT contract
const fromWalletPrivateKey = process.env.FROM_WALLET_PRIVATE_KEY;
const gasWalletPrivateKey = process.env.GAS_WALLET_PRIVATE_KEY;
const toWalletAddress = process.env.TO_WALLET_ADDRESS;
const usdtContractAddress = process.env.USDT_CONTRACT_ADDRESS;

// ERC20 ABI for transfer and balanceOf
const usdtAbi = [
  {
    "constant": true,
    "inputs": [{"name": "_owner", "type": "address"}],
    "name": "balanceOf",
    "outputs": [{"name": "balance", "type": "uint256"}],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      {"name": "to", "type": "address"},
      {"name": "value", "type": "uint256"}
    ],
    "name": "transfer",
    "outputs": [{"name": "", "type": "bool"}],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  }
];

const usdtContract = new web3.eth.Contract(usdtAbi, usdtContractAddress);

async function transferUSDT() {
  try {
    // Validate environment variables
    if (process.env.INFURA_URL process.env.FROM_WALLET_PRIVATE_KEY  process.env.GAS_WALLET_PRIVATE_KEY || process.env.TO_WALLET_ADDRESS) {
      throw new Error("Missing one or more environment variables in the .env file");
    }

    // Create wallet accounts
    const fromWallet = web3.eth.accounts.privateKeyToAccount(fromWalletPrivateKey);
    const gasWallet = web3.eth.accounts.privateKeyToAccount(gasWalletPrivateKey);

    // Check balances
    const gasWalletBalance = await web3.eth.getBalance(gasWallet.address);
    console.log(`Gas Wallet Balance: ${fromWei(gasWalletBalance, 'ether')} ETH`);

    // Estimate gas for transfer transaction
    const gasPrice = await web3.eth.getGasPrice();
    const gasLimit = await usdtContract.methods.transfer(toWalletAddress, toWei('10', 'mwei')).estimateGas({ from: fromWallet.address });

    const totalCost = gasPrice * gasLimit;
    if (parseFloat(gasWalletBalance) < totalCost) {
      throw new Error('Insufficient balance in gas wallet for gas fees');
    }

    // Create gas fee transaction
    const txForGas = {
      from: gasWallet.address,
      to: fromWallet.address,
      value: totalCost.toString(),
      gasPrice,
      gas: gasLimit
    };

    // Sign and send the gas payment transaction
    const signedTxForGas = await web3.eth.accounts.signTransaction(txForGas, gasWallet.privateKey);
    await web3.eth.sendSignedTransaction(signedTxForGas.rawTransaction);
    console.log('Gas fee paid successfully.');

    // Create USDT transfer transaction
    const tx = {
      from: fromWallet.address,
      to: usdtContractAddress,
      data: usdtContract.methods.transfer(toWalletAddress, toWei('10', 'mwei')).encodeABI(),
      gasPrice,
      gas: gasLimit
    };

    // Sign and send the USDT transfer transaction
    const signedTx = await web3.eth.accounts.signTransaction(tx, fromWallet.privateKey);
    const receipt = await web3.eth.sendSignedTransaction(signedTx.rawTransaction);
    console.log('USDT transferred successfully:', receipt.transactionHash);

  } catch (err) {
    console.error('Error:', err.message);
  }
}

// Execute the function
transferUSDT();