const HDWalletProvider = require('@truffle/hdwallet-provider');

module.exports = {
  networks: {
    development: {
      host: "127.0.0.1",
      port: 7545,
      network_id: "*", 
    },
    sepolia: {
      provider: () => new HDWalletProvider(
        "march weekend master soft almost suspect rate rebuild april purpose ten fashion",  // Replace with your actual mnemonic
        "https://eth-sepolia.g.alchemy.com/v2/ZVGch38ibFRY6za1yoZ6U6TwluXXHEqt"  // Replace with your actual Infura project ID
      ),
      network_id: 11155111,  // Sepolia network ID
      confirmations: 2,
      timeoutBlocks: 200,
      skipDryRun: true,
    },
  },
  
  compilers: {
    solc: {
      version: "0.8.0", 
    }
  }
};