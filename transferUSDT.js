
const ethers = require('ethers');
const { providers } = require('ethers');
const provider = new providers.JsonRpcProvider();

require('dotenv').config();
const { JsonRpcProvider } = require('ethers');



// Set up your environment variables
const infuraUrl = process.env.INFURA_URL;
const fromPrivateKey = process.env.FROM_WALLET_PRIVATE_KEY;
const gasPrivateKey = process.env.GAS_WALLET_PRIVATE_KEY;
const toWalletAddress = process.env.TO_WALLET_ADDRESS;

// Define USDT contract address and ABI (ERC20 standard)
const usdtContractAddress = "0xdAC17F958D2ee523a2206206994597C13D831ec7"; // Mainnet USDT contract address
const erc20Abi = [
  "function balanceOf(address owner) view returns (uint256)",
  "function transfer(address to, uint256 amount) returns (bool)"
];

async function transferUSDT() {
  // Connect to the Ethereum network
  const provider = new ethers.providers.JsonRpcProvider(infuraUrl);

  // Create wallets
  const fromWallet = new ethers.Wallet(fromPrivateKey, provider);
  const gasWallet = new ethers.Wallet(gasPrivateKey, provider);

  // Set up the USDT contract
  const usdtContract = new ethers.Contract(usdtContractAddress, erc20Abi, provider);

  // Check balance of the "from" wallet
  const balance = await usdtContract.balanceOf(fromWallet.address);
  console.log(`Balance of sender (USDT): ${ethers.utils.formatUnits(balance, 6)} USDT`);

  // Specify the amount to transfer (in USDT, adjusted to 6 decimals)
  const amount = ethers.utils.parseUnits("10.0", 6); // For example, 10 USDT

  if (balance.lt(amount)) {
    console.log("Insufficient USDT balance");
    return;
  }

  // Create the transaction data for the USDT transfer
  const txData = await usdtContract.populateTransaction.transfer(toWalletAddress, amount);

  // Estimate gas fee from gas wallet
  const gasLimit = await provider.estimateGas({
    to: usdtContractAddress,
    data: txData.data,
    from: fromWallet.address,
  });
  const gasPrice = await provider.getGasPrice();

  // Total cost in ETH (gas wallet must cover this)
  const totalGasCost = gasPrice.mul(gasLimit);
  console.log(`Estimated gas cost (in ETH): ${ethers.utils.formatEther(totalGasCost)}`);

  // Check if gas wallet has enough balance for gas fee
  const gasWalletBalance = await provider.getBalance(gasWallet.address);
  if (gasWalletBalance.lt(totalGasCost)) {
    console.log("Insufficient ETH balance in gas wallet for gas fee");
    return;
  }

  // Send the transaction using the gas wallet as the payer
  const tx = await gasWallet.sendTransaction({
    to: usdtContractAddress,
    data: txData.data,
    gasLimit: gasLimit,
    gasPrice: gasPrice,
    from: fromWallet.address, // Specify the "from" wallet address in the transaction
  });

  console.log("Transaction sent! Hash:", tx.hash);

  // Wait for the transaction to be confirmed
  const receipt = await tx.wait();
  console.log("Transaction confirmed!", receipt);
}

// Run the function
transferUSDT().catch(console.error);