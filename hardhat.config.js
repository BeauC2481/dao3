require('@nomiclabs/hardhat-ethers');

module.exports = {
  solidity: '0.8.4',
  defaultNetwork: 'goerli',
  networks: {
    hardhat: {
      chainId: 31337,
    },
    goerli: {
      url: 'https://eth-goerli.g.alchemy.com/v2/48I8EVh9NdEbuAG0oc0UDWHLqMVfuDdM',
      accounts: ['0xde9be858da4a475276426320d5e9262ecfc3ba460bfac56360bfa6c4c28b4ee0'],
    },
  },
};

