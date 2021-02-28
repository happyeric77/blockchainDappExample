module.exports = {
  networks: {
    development: {
      host: "0.0.0.0",
      port: 9876,
      network_id: "*" // Match any network id
    }
  },
  solc: {
    optimizer: {
      enabled: true,
      runs: 200
    }
  }
}
