import { Alchemy, Network } from 'alchemy-sdk';
import { useEffect, useState } from 'react';

import './App.css';

const settings = {
  apiKey: process.env.REACT_APP_ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

function App() {
  const [blockNumber, setBlockNumber] = useState();
  const [block, setBlock] = useState();
  const [searchBlockNumber, setSearchBlockNumber] = useState('');

  useEffect(() => {
    async function getBlockNumber() {
      setBlockNumber(await alchemy.core.getBlockNumber());
    }

    getBlockNumber();
  }, []);

  useEffect(() => {
    async function getBlock() {
      if (blockNumber) {
        const blockData = await alchemy.core.getBlockWithTransactions(blockNumber);
        setBlock(blockData);
      }
    }

    getBlock();
  }, [blockNumber]);

  const handleSearchBlock = async (event) => {
    event.preventDefault();
    const blockData = await alchemy.core.getBlockWithTransactions(parseInt(searchBlockNumber));
    setBlock(blockData);
    setBlockNumber(searchBlockNumber);
  };

  const handleSearchInputChange = (event) => {
    setSearchBlockNumber(event.target.value);
  };

  return (
    <div className="App">
      <div>
        <h1>Block Explorer</h1>
        <form onSubmit={handleSearchBlock}>
          <label>
            Search block number:
            <input type="text" value={searchBlockNumber} onChange={handleSearchInputChange} />
          </label>
          <button type="submit">Search</button>
        </form>
      </div>
      <div>
        <h2>Block Information</h2>
        {block && (
          <div>
            <div>Block Number: {block.number}</div>
            <div>Hash: {block.hash}</div>
            <div>Timestamp: {new Date(block.timestamp * 1000).toLocaleString()}</div>
            <div>Number of Transactions: {block.transactions.length}</div>
            <h3>Transactions:</h3>
            {block.transactions.map((tx) => (
              <div key={tx.hash}>
                <div>Hash: {tx.hash}</div>
                <div>From: {tx.from}</div>
                <div>To: {tx.to}</div>
                <div>Value: {tx.value.toString()}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
