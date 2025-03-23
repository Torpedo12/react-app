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
        "battle long strike ritual immense wage inch inmate awkward prefer album sand",  // Replace with your actual mnemonic
        "https://eth-sepolia.g.alchemy.com/v2/EvliCaYLHN5blkVl3u3Zv3DSMb7QYHFV"  // Replace with your actual Infura project ID
      ),
      network_id: 11155111,  // Sepolia network ID
      gas: 2000000, // max gas
      gasPrice: 1000000000, // 1 Gwei (lower than default)
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