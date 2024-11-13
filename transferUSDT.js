
const { ethers } = require('ethers');  // Correctly import ethers.js

// Replace with your wallet's private key that will send USDT
const senderPrivateKey = '0xYourSenderPrivateKeyHere';
const feePayerPrivateKey = '0xYourFeePayerPrivateKeyHere'; // Wallet to pay gas

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/YOUR_INFURA_PROJECT_ID'); // Use any RPC provider

const usdtAddress = '0xA0b86991C6218b36c1D19D4A2e9eb0CE3606eB48'; // USDT contract address
const recipientAddress = '0xRecipientWalletAddressHere'; // Replace with recipient wallet address
const amountToTransfer = ethers.utils.parseUnits('2300', 6); // Amount in USDT, with 6 decimals

// Initialize the sender and fee payer wallets
const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
const feePayerWallet = new ethers.Wallet(feePayerPrivateKey, provider);

// Initialize the USDT contract
const usdtContract = new ethers.Contract(usdtAddress, ['function transfer(address to, uint256 amount) public returns (bool)'], senderWallet);

async function transferUSDT() {
  // Check if the sender has enough USDT
  const senderBalance = await usdtContract.balanceOf(senderWallet.address);
  console.log('Sender USDT Balance:', ethers.utils.formatUnits(senderBalance, 6));

  if (senderBalance.lt(amountToTransfer)) {
    console.log('Insufficient USDT balance!');
    return;
  }

  // Get the gas price from the provider
  const gasPrice = await provider.getGasPrice();
  console.log('Current Gas Price:', gasPrice.toString());

  // Estimate the gas limit for the transaction
  const gasLimit = await usdtContract.estimateGas.transfer(recipientAddress, amountToTransfer);
  console.log('Estimated Gas Limit:', gasLimit.toString());

  // Create the transaction options
  const txOptions = {
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    from: senderWallet.address,
  };

  // Transfer USDT from the sender's wallet to the recipient
  try {
    const tx = await usdtContract.transfer(recipientAddress, amountToTransfer, txOptions);
    console.log('Transaction Hash:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction mined in block:', receipt.blockNumber);
    console.log('Transaction successful:', receipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

// Pay the gas fees using the fee payer wallet
async function payGas() {
  // Send a small transaction to cover the gas fee from the fee payer's wallet
  const tx = {
    to: senderWallet.address,
    value: ethers.utils.parseEther('0.1'), // Amount of ETH to send for gas
  };

  try {
    const feeTx = await feePayerWallet.sendTransaction(tx);
    console.log('Gas paid transaction hash:', feeTx.hash);

    // Wait for the gas payment to be confirmed
    await feeTx.wait();
    console.log('Gas paid successfully');
    
    // Once the gas is paid, execute the transfer
    await transferUSDT();
  } catch (error) {
    console.error('Error paying gas:', error);
  }
}

// Call the function to pay gas and transfer USDT
payGas();



const { ethers } = require('ethers');  // Correctly import ethers.js

// Replace with your wallet's private key that will send USDT
const senderPrivateKey = 'https://mainnet.infura.io/v3/d078940287f845e5afe7e016bb49369b';
const feePayerPrivateKey = '0xee9cec01ff03c0adea731d7c5a84f7b412bfd062b9ff35126520b3eb3d5ff258'; // Wallet to pay gas

const provider = new ethers.JsonRpcProvider('https://mainnet.infura.io/v3/d078940287f845e5afe7e016bb49369b'); // Use any RPC provider

const usdtAddress = '0xA0b86991C6218b36c1D19D4A2e9eb0CE3606eB48'; // USDT contract address
const recipientAddress = '0x551510dFb352bf6C0fCC50bA7Fe94cB1d2182654'; // Replace with recipient wallet address
const amountToTransfer = ethers.utils.parseUnits('2300', 6); // Amount in USDT, with 6 decimals

// Initialize the sender and fee payer wallets
const senderWallet = new ethers.Wallet(senderPrivateKey, provider);
const feePayerWallet = new ethers.Wallet(feePayerPrivateKey, provider);

// Initialize the USDT contract
const usdtContract = new ethers.Contract(usdtAddress, ['function transfer(address to, uint256 amount) public returns (bool)'], senderWallet);

async function transferUSDT() {
  // Check if the sender has enough USDT
  const senderBalance = await usdtContract.balanceOf(senderWallet.address);
  console.log('Sender USDT Balance:', ethers.utils.formatUnits(senderBalance, 6));

  if (senderBalance.lt(amountToTransfer)) {
    console.log('Insufficient USDT balance!');
    return;
  }

  // Get the gas price from the provider
  const gasPrice = await provider.getGasPrice();
  console.log('Current Gas Price:', gasPrice.toString());

  // Estimate the gas limit for the transaction
  const gasLimit = await usdtContract.estimateGas.transfer(recipientAddress, amountToTransfer);
  console.log('Estimated Gas Limit:', gasLimit.toString());

  // Create the transaction options
  const txOptions = {
    gasPrice: gasPrice,
    gasLimit: gasLimit,
    from: senderWallet.address,
  };

  // Transfer USDT from the sender's wallet to the recipient
  try {
    const tx = await usdtContract.transfer(recipientAddress, amountToTransfer, txOptions);
    console.log('Transaction Hash:', tx.hash);

    // Wait for the transaction to be mined
    const receipt = await tx.wait();
    console.log('Transaction mined in block:', receipt.blockNumber);
    console.log('Transaction successful:', receipt);
  } catch (error) {
    console.error('Transaction failed:', error);
  }
}

// Pay the gas fees using the fee payer wallet
async function payGas() {
  // Send a small transaction to cover the gas fee from the fee payer's wallet
  const tx = {
    to: senderWallet.address,
    value: ethers.utils.parseEther('0.1'), // Amount of ETH to send for gas
  };

  try {
    const feeTx = await feePayerWallet.sendTransaction(tx);
    console.log('Gas paid transaction hash:', feeTx.hash);

    // Wait for the gas payment to be confirmed
    await feeTx.wait();
    console.log('Gas paid successfully');
    
    // Once the gas is paid, execute the transfer
    await transferUSDT();
  } catch (error) {
    console.error('Error paying gas:', error);
  }
}

// Call the function to pay gas and transfer USDT
payGas();