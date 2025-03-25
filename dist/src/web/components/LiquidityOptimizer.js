import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useState } from 'react';
const LiquidityOptimizer = () => {
    const [availableTokens, setAvailableTokens] = useState([
        { token: 'APT', amount: '' },
        { token: 'USDC', amount: '' },
        { token: 'USDT', amount: '' }
    ]);
    const [riskTolerance, setRiskTolerance] = useState(0.5);
    const [optimizationResults, setOptimizationResults] = useState([]);
    const [isOptimizing, setIsOptimizing] = useState(false);
    const [status, setStatus] = useState('');
    const handleTokenAmountChange = (index, amount) => {
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
            }, {});
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
            }
            else {
                setStatus(`Error: ${data.error}`);
            }
        }
        catch (error) {
            console.error('Optimization error:', error);
            setStatus('Failed to optimize liquidity allocation');
        }
        finally {
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
            }
            else {
                setStatus(`Error: ${data.error}`);
            }
        }
        catch (error) {
            console.error('Strategy execution error:', error);
            setStatus('Failed to execute liquidity strategy');
        }
    };
    return (_jsxs("div", { className: "liquidity-optimizer", children: [_jsx("h2", { children: "AI Liquidity Optimizer" }), _jsxs("div", { className: "token-inputs", children: [_jsx("h3", { children: "Available Tokens" }), availableTokens.map((token, index) => (_jsxs("div", { className: "input-group", children: [_jsxs("label", { children: [token.token, ":"] }), _jsx("input", { type: "number", value: token.amount, onChange: (e) => handleTokenAmountChange(index, e.target.value), placeholder: `Enter ${token.token} amount`, min: "0", step: "0.1" })] }, token.token)))] }), _jsxs("div", { className: "risk-tolerance", children: [_jsx("h3", { children: "Risk Tolerance" }), _jsx("input", { type: "range", min: "0", max: "1", step: "0.1", value: riskTolerance, onChange: (e) => setRiskTolerance(parseFloat(e.target.value)) }), _jsxs("span", { children: [(riskTolerance * 100).toFixed(0), "%"] })] }), _jsx("button", { onClick: optimizeLiquidity, disabled: isOptimizing || !availableTokens.some(t => t.amount), className: "primary-button", children: isOptimizing ? 'Optimizing...' : 'Optimize Liquidity' }), optimizationResults.length > 0 && (_jsxs("div", { className: "optimization-results", children: [_jsx("h3", { children: "Optimal Allocation Strategy" }), optimizationResults.map((result, index) => (_jsxs("div", { className: "allocation", children: [_jsx("h4", { children: result.protocol }), _jsxs("p", { children: ["Pair: ", result.tokenA, "/", result.tokenB] }), _jsxs("p", { children: ["Amount: ", result.amountA, " ", result.tokenA, " + ", result.amountB, " ", result.tokenB] }), _jsxs("p", { children: ["Expected APY: ", result.expectedApy.toFixed(2), "%"] })] }, index))), _jsx("button", { onClick: executeStrategy, className: "success-button", children: "Execute Strategy" })] })), status && (_jsx("div", { className: `status-message ${status.includes('Error') ? 'error' : 'success'}`, children: status }))] }));
};
export default LiquidityOptimizer;
