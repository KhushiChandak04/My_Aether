import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { ProtocolAction } from '../../protocols/types';
const DeFiPanel = ({ isConnected }) => {
    const [amount, setAmount] = useState('');
    const [tokenIn, setTokenIn] = useState('APT');
    const [tokenOut, setTokenOut] = useState('USDC');
    const [action, setAction] = useState(ProtocolAction.SWAP);
    const [status, setStatus] = useState('');
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
    return (_jsxs("div", { className: "defi-panel", children: [_jsx("h2", { children: "DeFi Operations" }), _jsxs("div", { className: "defi-controls", children: [_jsxs("div", { className: "input-group", children: [_jsx("label", { children: "Action:" }), _jsxs("select", { value: action, onChange: (e) => setAction(e.target.value), children: [_jsx("option", { value: ProtocolAction.SWAP, children: "Swap" }), _jsx("option", { value: ProtocolAction.SUPPLY, children: "Supply" }), _jsx("option", { value: ProtocolAction.BORROW, children: "Borrow" }), _jsx("option", { value: ProtocolAction.REPAY, children: "Repay" })] })] }), _jsxs("div", { className: "input-group", children: [_jsx("label", { children: "Amount:" }), _jsx("input", { type: "number", value: amount, onChange: (e) => setAmount(e.target.value), placeholder: "Enter amount", min: "0", step: "0.1" })] }), action === ProtocolAction.SWAP && (_jsxs(_Fragment, { children: [_jsxs("div", { className: "input-group", children: [_jsx("label", { children: "Token In:" }), _jsxs("select", { value: tokenIn, onChange: (e) => setTokenIn(e.target.value), children: [_jsx("option", { value: "APT", children: "APT" }), _jsx("option", { value: "USDC", children: "USDC" }), _jsx("option", { value: "USDT", children: "USDT" })] })] }), _jsxs("div", { className: "input-group", children: [_jsx("label", { children: "Token Out:" }), _jsxs("select", { value: tokenOut, onChange: (e) => setTokenOut(e.target.value), children: [_jsx("option", { value: "USDC", children: "USDC" }), _jsx("option", { value: "APT", children: "APT" }), _jsx("option", { value: "USDT", children: "USDT" })] })] })] })), _jsx("button", { onClick: executeAction, className: "primary-button", disabled: !isConnected || !amount, children: "Execute" }), status && (_jsx("div", { className: `status-message ${status.includes('Error') ? 'error' : 'success'}`, children: status }))] })] }));
};
export default DeFiPanel;
