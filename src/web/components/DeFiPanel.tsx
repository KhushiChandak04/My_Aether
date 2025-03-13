import React, { useState } from 'react';
import { ProtocolAction } from '../../protocols/types';

interface DeFiPanelProps {
  isConnected: boolean;
}

const DeFiPanel: React.FC<DeFiPanelProps> = ({ isConnected }) => {
  const [amount, setAmount] = useState<string>('');
  const [tokenIn, setTokenIn] = useState<string>('APT');
  const [tokenOut, setTokenOut] = useState<string>('USDC');
  const [action, setAction] = useState<ProtocolAction>(ProtocolAction.SWAP);
  const [status, setStatus] = useState<string>('');

  const executeAction = async () => {
    if (!isConnected) {
      setStatus('Please connect your wallet first');
      return;
    }

    try {
      setStatus('Executing DeFi action...');
      const response = await fetch('/api/defi/execute', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action,
          params: {
            tokenIn,
            tokenOut,
            amountIn: BigInt(parseFloat(amount) * 100000000).toString(),
            minAmountOut: BigInt(parseFloat(amount) * 95000000).toString() // 5% slippage
          }
        })
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Transaction executed successfully!');
      } else {
        setStatus(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('DeFi action error:', error);
      setStatus('Failed to execute DeFi action');
    }
  };

  return (
    <div className="defi-panel">
      <h2>DeFi Operations</h2>
      <div className="defi-controls">
        <div className="input-group">
          <label>Action:</label>
          <select 
            value={action} 
            onChange={(e) => setAction(e.target.value as ProtocolAction)}
          >
            <option value={ProtocolAction.SWAP}>Swap</option>
            <option value={ProtocolAction.SUPPLY}>Supply</option>
            <option value={ProtocolAction.BORROW}>Borrow</option>
            <option value={ProtocolAction.REPAY}>Repay</option>
          </select>
        </div>

        <div className="input-group">
          <label>Amount:</label>
          <input
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="0"
            step="0.1"
          />
        </div>

        {action === ProtocolAction.SWAP && (
          <>
            <div className="input-group">
              <label>Token In:</label>
              <select 
                value={tokenIn} 
                onChange={(e) => setTokenIn(e.target.value)}
              >
                <option value="APT">APT</option>
                <option value="USDC">USDC</option>
                <option value="USDT">USDT</option>
              </select>
            </div>

            <div className="input-group">
              <label>Token Out:</label>
              <select 
                value={tokenOut} 
                onChange={(e) => setTokenOut(e.target.value)}
              >
                <option value="USDC">USDC</option>
                <option value="APT">APT</option>
                <option value="USDT">USDT</option>
              </select>
            </div>
          </>
        )}

        <button 
          onClick={executeAction}
          className="primary-button"
          disabled={!isConnected || !amount}
        >
          Execute
        </button>

        {status && (
          <div className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>
            {status}
          </div>
        )}
      </div>
    </div>
  );
};

export default DeFiPanel;
