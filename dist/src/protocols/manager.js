"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ProtocolManager = void 0;
const types_1 = require("./types");
const liquidswap_1 = require("./liquidswap");
const aptin_1 = require("./aptin");
class ProtocolManager {
    constructor(wallet) {
        this.wallet = wallet;
        this.protocols = new Map();
        // Initialize supported protocols
        this.registerProtocol(new liquidswap_1.LiquidswapProtocol());
        this.registerProtocol(new aptin_1.AptinProtocol());
    }
    registerProtocol(protocol) {
        this.protocols.set(protocol.name, protocol);
    }
    async executeProtocolAction(protocolName, action, params) {
        const protocol = this.protocols.get(protocolName);
        if (!protocol) {
            throw new Error(`Protocol ${protocolName} not found`);
        }
        try {
            const payload = await protocol.getPayload(action, params);
            return await this.wallet.submitTransaction(payload);
        }
        catch (error) {
            console.error(`Error executing ${action} on ${protocolName}:`, error);
            throw error;
        }
    }
    getProtocolsByType(type) {
        return Array.from(this.protocols.values())
            .filter(protocol => protocol.type === type);
    }
    async getOptimalSwapRoute(tokenIn, tokenOut, amount) {
        // Get all DEX protocols
        const dexes = this.getProtocolsByType(types_1.ProtocolType.DEX);
        if (dexes.length === 0) {
            throw new Error("No DEX protocols available");
        }
        // TODO: Implement price comparison across DEXes
        // For now, default to first available DEX
        const bestDex = dexes[0];
        return {
            protocol: bestDex.name,
            params: {
                tokenIn,
                tokenOut,
                amountIn: amount,
                minAmountOut: amount * 95n / 100n // 5% slippage tolerance
            }
        };
    }
    async getOptimalLendingProtocol(token, amount) {
        // Get all lending protocols
        const lendingProtocols = this.getProtocolsByType(types_1.ProtocolType.LENDING);
        if (lendingProtocols.length === 0) {
            throw new Error("No lending protocols available");
        }
        // TODO: Implement interest rate comparison across lending platforms
        // For now, default to first available lending protocol
        const bestProtocol = lendingProtocols[0];
        return {
            protocol: bestProtocol.name,
            params: {
                token,
                amount,
                interestRate: 0 // Will be determined by the protocol
            }
        };
    }
}
exports.ProtocolManager = ProtocolManager;
