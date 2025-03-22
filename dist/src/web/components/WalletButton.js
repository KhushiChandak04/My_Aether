"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const material_1 = require("@mui/material");
const AccountBalanceWallet_1 = __importDefault(require("@mui/icons-material/AccountBalanceWallet"));
const WalletButton = ({ onConnect }) => {
    const [isConnecting, setIsConnecting] = (0, react_1.useState)(false);
    const [address, setAddress] = (0, react_1.useState)(null);
    const handleConnect = async () => {
        try {
            setIsConnecting(true);
            await onConnect();
            const response = await fetch('http://localhost:3001/api/create-wallet', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' }
            });
            const data = await response.json();
            setAddress(data.address);
        }
        catch (error) {
            console.error('Failed to connect wallet:', error);
        }
        finally {
            setIsConnecting(false);
        }
    };
    return ((0, jsx_runtime_1.jsxs)("div", { style: { display: 'flex', alignItems: 'center', gap: '10px' }, children: [(0, jsx_runtime_1.jsx)(material_1.Button, { variant: "contained", color: "primary", onClick: handleConnect, disabled: isConnecting || !!address, startIcon: (0, jsx_runtime_1.jsx)(AccountBalanceWallet_1.default, {}), children: isConnecting ? 'Connecting...' : address ? 'Connected' : 'Connect Wallet' }), address && ((0, jsx_runtime_1.jsx)(material_1.Typography, { variant: "body2", color: "textSecondary", children: `${address.slice(0, 6)}...${address.slice(-4)}` }))] }));
};
exports.default = WalletButton;
