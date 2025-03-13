import React, { useState } from 'react';

interface TokenBalance {
    token: string;
    amount: string;
}

interface OptimizationResult {
    protocol: string;
    tokenA: string;
    tokenB: string;
    amountA: string;
    amountB: string;
    expectedApy: number;
}

const LiquidityOptimizer: React.FC = () => {
    const [availableTokens, setAvailableTokens] = useState<TokenBalance[]>([
        { token: 'APT', amount: '' },
        { token: 'USDC', amount: '' },
        { token: 'USDT', amount: '' }
    ]);
    const [riskTolerance, setRiskTolerance] = useState<number>(0.5);
    const [optimizationResults, setOptimizationResults] = useState<OptimizationResult[]>([]);
    const [isOptimizing, setIsOptimizing] = useState<boolean>(false);
    const [status, setStatus] = useState<string>('');

    const handleTokenAmountChange = (index: number, amount: string) => {
        const newTokens = [...availableTokens];
        newTokens[index].amount = amount;
        setAvailableTokens(newTokens);
    };

    const optimizeLiquidity = async () => {
        try {
            setIsOptimizing(true);
            setStatus('Calculating optimal liquidity allocation...');

            // Convert token amounts to API format
            const tokenBalances = availableTokens.reduce((acc, { token, amount }) => {
                if (amount) {
                    acc[token] = BigInt(parseFloat(amount) * 1e8);
                }
                return acc;
            }, {} as { [key: string]: bigint });

            const response = await fetch('/api/liquidity/optimize', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    availableTokens: tokenBalances,
                    riskTolerance
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setOptimizationResults(data.strategy.allocations);
                setStatus(`Optimization complete! Expected APY: ${data.strategy.totalExpectedApy.toFixed(2)}%`);
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Optimization error:', error);
            setStatus('Failed to optimize liquidity allocation');
        } finally {
            setIsOptimizing(false);
        }
    };

    const executeStrategy = async () => {
        try {
            setStatus('Executing liquidity strategy...');
            
            const response = await fetch('/api/liquidity/execute', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    allocations: optimizationResults
                })
            });

            const data = await response.json();
            
            if (data.success) {
                setStatus('Strategy executed successfully! View transactions for details.');
            } else {
                setStatus(`Error: ${data.error}`);
            }
        } catch (error) {
            console.error('Strategy execution error:', error);
            setStatus('Failed to execute liquidity strategy');
        }
    };

    return (
        <div className="liquidity-optimizer">
            <h2>AI Liquidity Optimizer</h2>
            
            <div className="token-inputs">
                <h3>Available Tokens</h3>
                {availableTokens.map((token, index) => (
                    <div key={token.token} className="input-group">
                        <label>{token.token}:</label>
                        <input
                            type="number"
                            value={token.amount}
                            onChange={(e) => handleTokenAmountChange(index, e.target.value)}
                            placeholder={`Enter ${token.token} amount`}
                            min="0"
                            step="0.1"
                        />
                    </div>
                ))}
            </div>

            <div className="risk-tolerance">
                <h3>Risk Tolerance</h3>
                <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.1"
                    value={riskTolerance}
                    onChange={(e) => setRiskTolerance(parseFloat(e.target.value))}
                />
                <span>{(riskTolerance * 100).toFixed(0)}%</span>
            </div>

            <button
                onClick={optimizeLiquidity}
                disabled={isOptimizing || !availableTokens.some(t => t.amount)}
                className="primary-button"
            >
                {isOptimizing ? 'Optimizing...' : 'Optimize Liquidity'}
            </button>

            {optimizationResults.length > 0 && (
                <div className="optimization-results">
                    <h3>Optimal Allocation Strategy</h3>
                    {optimizationResults.map((result, index) => (
                        <div key={index} className="allocation">
                            <h4>{result.protocol}</h4>
                            <p>Pair: {result.tokenA}/{result.tokenB}</p>
                            <p>Amount: {result.amountA} {result.tokenA} + {result.amountB} {result.tokenB}</p>
                            <p>Expected APY: {result.expectedApy.toFixed(2)}%</p>
                        </div>
                    ))}

                    <button
                        onClick={executeStrategy}
                        className="success-button"
                    >
                        Execute Strategy
                    </button>
                </div>
            )}

            {status && (
                <div className={`status-message ${status.includes('Error') ? 'error' : 'success'}`}>
                    {status}
                </div>
            )}
        </div>
    );
};

export default LiquidityOptimizer;
