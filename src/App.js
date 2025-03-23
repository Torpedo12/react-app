import React, { useState, useEffect } from "react";
import Web3 from "web3";
import CharityContract from "./CharityPlatform.json";
import "./index.css";
import Login from "./Login"; // Importing Login Component

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(localStorage.getItem("isAuthenticated") === "true");
  const [web3, setWeb3] = useState(null);
  const [account, setAccount] = useState(null);
  const [contract, setContract] = useState(null);
  const [charityName, setCharityName] = useState("");
  const [description, setDescription] = useState("");
  const [charityAddress, setCharityAddress] = useState("");
  const [donorAddress, setDonorAddress] = useState("");
  const [donationAmount, setDonationAmount] = useState("");
  const [charityList, setCharityList] = useState([]);
  const [transactionHash, setTransactionHash] = useState(null);
  const [searchHash, setSearchHash] = useState("");
  const [transactionDetails, setTransactionDetails] = useState(null);

  useEffect(() => {
    if (isAuthenticated) {
      loadBlockchainData();
    }
  }, [isAuthenticated]);

  const loadBlockchainData = async () => {
    if (window.ethereum) {
      const web3Instance = new Web3(window.ethereum);
      await window.ethereum.request({ method: "eth_requestAccounts" });
      setWeb3(web3Instance);

      const accounts = await web3Instance.eth.getAccounts();
      setAccount(accounts[0]);

      const networkId = await web3Instance.eth.net.getId();
      const deployedNetwork = CharityContract.networks[networkId];

      if (deployedNetwork) {
        const contractInstance = new web3Instance.eth.Contract(
          CharityContract.abi,
          deployedNetwork.address
        );
        setContract(contractInstance);
        fetchCharityList(contractInstance);
      } else {
        console.error("Smart contract not deployed to the detected network.");
      }
    } else {
      alert("Please install MetaMask.");
    }
  };

  const fetchCharityList = async (contractInstance) => {
    try {
      if (!contractInstance.methods.getCharityCount) {
        throw new Error("getCharityCount method not found in contract.");
      }

      const charityCount = await contractInstance.methods.getCharityCount().call();
      let charities = [];
      for (let i = 1; i <= charityCount; i++) {
        let charity = await contractInstance.methods.getCharityDetails(i).call();
        charities.push({
          name: charity[0],
          description: charity[1],
          charityAddress: charity[2],
          balance: charity[3]
        });
      }
      setCharityList(charities);
    } catch (error) {
      console.error("Error fetching charity list:", error);
    }
  };

  const createCharity = async () => {
    if (contract) {
      try {
        await contract.methods
          .createCharity(charityName, description, charityAddress)
          .send({ from: account });
        alert(`Charity Created: ${charityName} - ${description} - ${charityAddress}`);
        fetchCharityList(contract);
      } catch (error) {
        console.error("Transaction failed:", error);
      }
    }
  };

  const donateToCharity = async () => {
    if (!contract) {
      alert("Smart contract not loaded.");
      return;
    }

    const charity = charityList.find(c => c.charityAddress === charityAddress);
    if (!charity) {
      alert("Charity not found! Ensure you enter a valid registered charity address.");
      return;
    }
    const charityId = charityList.indexOf(charity) + 1;

    if (!web3.utils.isAddress(donorAddress)) {
      alert("Invalid donor Ethereum address!");
      return;
    }
    if (!donationAmount || isNaN(donationAmount) || parseFloat(donationAmount) <= 0) {
      alert("Invalid donation amount!");
      return;
    }

    try {
      const weiAmount = web3.utils.toWei(donationAmount, "ether");
      const transaction = await contract.methods
        .donateToCharity(charityId)
        .send({ from: donorAddress, value: weiAmount });

      setTransactionHash(transaction.transactionHash);
      alert(`Donation Successful! Transaction Hash: ${transaction.transactionHash}`);
    } catch (error) {
      console.error("Transaction failed:", error);
      alert("Transaction failed. Check console for details.");
    }
  };

  const searchTransaction = async () => {
    if (!web3 || !searchHash) {
      alert("Please enter a valid transaction hash.");
      return;
    }
    try {
      const transaction = await web3.eth.getTransaction(searchHash);
      setTransactionDetails(transaction);
    } catch (error) {
      console.error("Error fetching transaction:", error);
      alert("Failed to fetch transaction details.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("isAuthenticated");
    setIsAuthenticated(false);
  };

  if (!isAuthenticated) {
    return <Login onLogin={() => setIsAuthenticated(true)} />;
  }

  return (
    <div>
      <h1>Charity Management</h1>
      <p>Connected Account: {account}</p>
      
      <button onClick={handleLogout}>Logout</button>

      <h2>Create Charity</h2>
      <input type="text" placeholder="Charity Name" value={charityName} onChange={(e) => setCharityName(e.target.value)} />
      <input type="text" placeholder="Description" value={description} onChange={(e) => setDescription(e.target.value)} />
      <input type="text" placeholder="Charity Address" value={charityAddress} onChange={(e) => setCharityAddress(e.target.value)} />
      <button onClick={createCharity}>Create Charity</button>

      <h2>Created Charity Details</h2>
      <ul>
        {charityList.map((charity, index) => (
          <li key={index}>{charity.name} - {charity.description} - {charity.charityAddress} - Balance: {web3.utils.fromWei(charity.balance, "ether")} ETH</li>
        ))}
      </ul>
      
      <h2>Donate to Charity</h2>
      <input type="text" placeholder="Donor Address" value={donorAddress} onChange={(e) => setDonorAddress(e.target.value)} />
      <input type="text" placeholder="Charity Address" value={charityAddress} onChange={(e) => setCharityAddress(e.target.value)} />
      <input type="text" placeholder="Amount (ETH)" value={donationAmount} onChange={(e) => setDonationAmount(e.target.value)} />
      <button onClick={donateToCharity}>Donate</button>
      
      <h2>Search Transaction by Hash</h2>
      <input type="text" placeholder="Transaction Hash" value={searchHash} onChange={(e) => setSearchHash(e.target.value)} />
      <button onClick={searchTransaction}>Search</button>

      {transactionDetails && (
        <div>
          <h3>Transaction Details</h3>
          <p>From: {transactionDetails.from}</p>
          <p>To: {transactionDetails.to}</p>
          <p>Value: {web3.utils.fromWei(transactionDetails.value, "ether")} ETH</p>
          <p>Block Number: {transactionDetails.blockNumber}</p>
        </div>
      )}
    </div>
  );
};

export default App;
