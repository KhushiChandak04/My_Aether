"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const types_1 = require("../../protocols/types");
const DeFiPanel = ({ isConnected }) => {
    const [amount, setAmount] = (0, react_1.useState)('');
    const [tokenIn, setTokenIn] = (0, react_1.useState)('APT');
    const [tokenOut, setTokenOut] = (0, react_1.useState)('USDC');
    const [action, setAction] = (0, react_1.useState)(types_1.ProtocolAction.SWAP);
    const [status, setStatus] = (0, react_1.useState)('');
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
            }
            else {
                setStatus(`Error: ${data.error}`);
            }
        }
        catch (error) {
            console.error('DeFi action error:', error);
            setStatus('Failed to execute DeFi action');
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { className: "defi-panel", children: [(0, jsx_runtime_1.jsx)("h2", { children: "DeFi Operations" }), (0, jsx_runtime_1.jsxs)("div", { className: "defi-controls", children: [(0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Action:" }), (0, jsx_runtime_1.jsxs)("select", { value: action, onChange: (e) => setAction(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: types_1.ProtocolAction.SWAP, children: "Swap" }), (0, jsx_runtime_1.jsx)("option", { value: types_1.ProtocolAction.SUPPLY, children: "Supply" }), (0, jsx_runtime_1.jsx)("option", { value: types_1.ProtocolAction.BORROW, children: "Borrow" }), (0, jsx_runtime_1.jsx)("option", { value: types_1.ProtocolAction.REPAY, children: "Repay" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Amount:" }), (0, jsx_runtime_1.jsx)("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Enter amount", min: "0", step: "0.1" })] }), action === types_1.ProtocolAction.SWAP && ((0, jsx_runtime_1.jsxs)(jsx_runtime_1.Fragment, { children: [(0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Token In:" }), (0, jsx_runtime_1.jsxs)("select", { value: tokenIn, onChange: (e) => setTokenIn(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "APT", children: "APT" }), (0, jsx_runtime_1.jsx)("option", { value: "USDC", children: "USDC" }), (0, jsx_runtime_1.jsx)("option", { value: "USDT", children: "USDT" })] })] }), (0, jsx_runtime_1.jsxs)("div", { className: "input-group", children: [(0, jsx_runtime_1.jsx)("label", { children: "Token Out:" }), (0, jsx_runtime_1.jsxs)("select", { value: tokenOut, onChange: (e) => setTokenOut(e.target.value), children: [(0, jsx_runtime_1.jsx)("option", { value: "USDC", children: "USDC" }), (0, jsx_runtime_1.jsx)("option", { value: "APT", children: "APT" }), (0, jsx_runtime_1.jsx)("option", { value: "USDT", children: "USDT" })] })] })] })), (0, jsx_runtime_1.jsx)("button", { onClick: executeAction, className: "primary-button", disabled: !isConnected || !amount, children: "Execute" }), status && ((0, jsx_runtime_1.jsx)("div", { className: `status-message ${status.includes('Error') ? 'error' : 'success'}`, children: status }))] })] }));
};
exports.default = DeFiPanel;
