const { ethers } = require("ethers");

// Set up your environment variables (you can store these securely)
const INFURA_URL = process.env.INFURA_URL;  // Ethereum RPC URL
const FROM_WALLET_PRIVATE_KEY = process.env.FROM_WALLET_PRIVATE_KEY;  // Wallet sending USDT
const GAS_WALLET_PRIVATE_KEY = process.env.GAS_WALLET_PRIVATE_KEY;  // Wallet paying for gas
const TO_WALLET_ADDRESS = process.env.TO_WALLET_ADDRESS;  // Recipient wallet address
const USDT_CONTRACT_ADDRESS = '0xdac17f958d2ee523a2206206994597c13d831ec7';  // USDT ERC-20 contract address on Ethereum mainnet

// Connect to the Ethereum network (via Infura or other providers)
const provider = new ethers.JsonRpcProvider(INFURA_URL);

// Create wallet instances
const senderWallet = new ethers.Wallet(FROM_WALLET_PRIVATE_KEY, provider);
const gasWallet = new ethers.Wallet(GAS_WALLET_PRIVATE_KEY, provider);

// USDT contract ABI (simplified)
const usdtAbi = [
  "function transfer(address to, uint256 amount) public returns (bool)",
  "function balanceOf(address account) external view returns (uint256)"
];

// Create a contract instance for USDT
const usdtContract = new ethers.Contract(USDT_CONTRACT_ADDRESS, usdtAbi, senderWallet);

// Function to send USDT and pay for gas using another wallet
async function transferUSDT() {
  try {
    // Check the balance of the sender wallet
    const amount = ethers.parseUnits("10", 6);  // Amount to send, here we send 10 USDT (USDT has 6 decimals)

    const senderBalance = await usdtContract.balanceOf(senderWallet.address);
    if (senderBalance.lt(amount)) {
      console.log("Not enough USDT balance to transfer.");
      return;
    }

    // Estimate gas cost for the transaction
    const gasLimit = await usdtContract.estimateGas.transfer(TO_WALLET_ADDRESS, amount);
    const gasPrice = await provider.getGasPrice();

    // Set up the transaction details
    const transaction = {
      to: USDT_CONTRACT_ADDRESS,
      data: usdtContract.interface.encodeFunctionData("transfer", [TO_WALLET_ADDRESS, amount]),
      gasLimit: gasLimit,
      gasPrice: gasPrice,
    };

    // Send the transaction using the gas wallet to pay for gas
    const gasTx = await gasWallet.sendTransaction(transaction);
    console.log(`Transaction hash: ${gasTx.hash}`);

    // Wait for the transaction to be mined
    await gasTx.wait();
    console.log("Transaction confirmed!");

  } catch (error) {
    console.error("Error in transfer:", error);
  }
}

// Call the transfer function
transferUSDT();