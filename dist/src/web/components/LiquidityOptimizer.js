"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const LiquidityOptimizer = () => {
    const [availableTokens, setAvailableTokens] = (0, react_1.useState)([
        { token: 'APT', amount: '' },
        { token: 'USDC', amount: '' },
        { token: 'USDT', amount: '' }
    ]);
    const [riskTolerance, setRiskTolerance] = (0, react_1.useState)(0.5);
    const [optimizationResults, setOptimizationResults] = (0, react_1.useState)([]);
    const [isOptimizing, setIsOptimizing] = (0, react_1.useState)(false);
    const [status, setStatus] = (0, react_1.useState)('');
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
    return ((0, jsx_runtime_1.jsxs)("div", { className: "liquidity-optimizer", children: [(0, jsx_runtime_1.jsx)("h2", { children: "AI Liquidity Optimizer" }), (0, jsx_runtime_1.jsxs)("div", { className: "token-inputs", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Available Tokens" }), availableTokens.map((token, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsxs)("label", { children: [token.token, ":"] }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: token.amount, onChange: (e) => handleTokenAmountChange(index, e.target.value), placeholder: `Enter ${token.token} amount`, min: "0", step: "0.1" })] }, token.token)))] }), (0, jsx_runtime_1.jsxs)("div", { className: "risk-tolerance", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Risk Tolerance" }), (0, jsx_runtime_1.jsx)("input", { type: "range", min: "0", max: "1", step: "0.1", value: riskTolerance, onChange: (e) => setRiskTolerance(parseFloat(e.target.value)) }), (0, jsx_runtime_1.jsxs)("span", { children: [(riskTolerance * 100).toFixed(0), "%"] })] }), (0, jsx_runtime_1.jsx)("button", { onClick: optimizeLiquidity, disabled: isOptimizing || !availableTokens.some(t => t.amount), className: "primary-button", children: isOptimizing ? 'Optimizing...' : 'Optimize Liquidity' }), optimizationResults.length > 0 && ((0, jsx_runtime_1.jsxs)("div", { className: "optimization-results", children: [(0, jsx_runtime_1.jsx)("h3", { children: "Optimal Allocation Strategy" }), optimizationResults.map((result, index) => ((0, jsx_runtime_1.jsxs)("div", { className: "allocation", children: [(0, jsx_runtime_1.jsx)("h4", { children: result.protocol }), (0, jsx_runtime_1.jsxs)("p", { children: ["Pair: ", result.tokenA, "/", result.tokenB] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Amount: ", result.amountA, " ", result.tokenA, " + ", result.amountB, " ", result.tokenB] }), (0, jsx_runtime_1.jsxs)("p", { children: ["Expected APY: ", result.expectedApy.toFixed(2), "%"] })] }, index))), (0, jsx_runtime_1.jsx)("button", { onClick: executeStrategy, className: "success-button", children: "Execute Strategy" })] })), status && ((0, jsx_runtime_1.jsx)("div", { className: `status-message ${status.includes('Error') ? 'error' : 'success'}`, children: status }))] }));
};
exports.default = LiquidityOptimizer;
