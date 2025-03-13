import { Types } from "aptos";
import { AIWallet } from "../wallet";
import { DeFiProtocol, ProtocolType, ProtocolAction, ProtocolParams, SwapParams, LendingParams } from "./types";
import { LiquidswapProtocol } from "./liquidswap";
import { AptinProtocol } from "./aptin";

export class ProtocolManager {
    private protocols: Map<string, DeFiProtocol>;
    private wallet: AIWallet;

    constructor(wallet: AIWallet) {
        this.wallet = wallet;
        this.protocols = new Map();
        
        // Initialize supported protocols
        this.registerProtocol(new LiquidswapProtocol());
        this.registerProtocol(new AptinProtocol());
    }

    registerProtocol(protocol: DeFiProtocol) {
        this.protocols.set(protocol.name, protocol);
    }

    async executeProtocolAction(
        protocolName: string,
        action: ProtocolAction,
        params: ProtocolParams
    ): Promise<Types.UserTransaction> {
        const protocol = this.protocols.get(protocolName);
        if (!protocol) {
            throw new Error(`Protocol ${protocolName} not found`);
        }

        try {
            const payload = await protocol.getPayload(action, params);
            return await this.wallet.submitTransaction(payload);
        } catch (error) {
            console.error(`Error executing ${action} on ${protocolName}:`, error);
            throw error;
        }
    }

    getProtocolsByType(type: ProtocolType): DeFiProtocol[] {
        return Array.from(this.protocols.values())
            .filter(protocol => protocol.type === type);
    }

    async getOptimalSwapRoute(
        tokenIn: string,
        tokenOut: string,
        amount: bigint
    ): Promise<{ protocol: string; params: SwapParams }> {
        // Get all DEX protocols
        const dexes = this.getProtocolsByType(ProtocolType.DEX);
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

    async getOptimalLendingProtocol(
        token: string,
        amount: bigint
    ): Promise<{ protocol: string; params: LendingParams }> {
        // Get all lending protocols
        const lendingProtocols = this.getProtocolsByType(ProtocolType.LENDING);
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
