import { ProtocolType, ProtocolAction } from "../protocols/types";
export class LiquidityOptimizer {
    constructor(protocolManager) {
        this.protocolManager = protocolManager;
    }
    async getPoolMetrics(protocol, tokenA, tokenB) {
        // In production, this would fetch real-time data from the protocol
        // For now, using mock data for demonstration
        return {
            protocol,
            tokenA,
            tokenB,
            apy: Math.random() * 50, // Mock APY between 0-50%
            tvl: BigInt(Math.floor(Math.random() * 1000000)) * BigInt(1e8),
            volume24h: BigInt(Math.floor(Math.random() * 100000)) * BigInt(1e8)
        };
    }
    calculateOptimalAllocation(availableAmount, pools, riskTolerance) {
        // Sort pools by APY and risk factors
        const sortedPools = [...pools].sort((a, b) => {
            // Consider multiple factors with risk tolerance:
            // 1. APY (higher is better)
            // 2. TVL (higher is better - more stability)
            // 3. Volume (higher is better - more liquidity)
            // Risk tolerance affects how much we weight APY vs stability
            const aScore = (a.apy * riskTolerance + (1 - riskTolerance)) *
                (Number(a.tvl) / 1e8) * (Number(a.volume24h) / 1e8);
            const bScore = (b.apy * riskTolerance + (1 - riskTolerance)) *
                (Number(b.tvl) / 1e8) * (Number(b.volume24h) / 1e8);
            return bScore - aScore;
        });
        // Allocate funds based on the scoring
        const totalScore = sortedPools.reduce((sum, pool) => sum + pool.apy, 0);
        const allocations = sortedPools.map(pool => {
            const allocationRatio = pool.apy / totalScore;
            const amount = BigInt(Math.floor(Number(availableAmount) * allocationRatio));
            return {
                protocol: pool.protocol,
                tokenA: pool.tokenA,
                tokenB: pool.tokenB,
                amountA: amount,
                amountB: amount, // For simplicity, using 1:1 ratio
                expectedApy: pool.apy
            };
        });
        const totalExpectedApy = allocations.reduce((sum, allocation) => sum + allocation.expectedApy, 0) / allocations.length;
        return {
            allocations,
            totalExpectedApy
        };
    }
    async optimizeLiquidity(availableTokens, riskTolerance = 0.5 // 0 = conservative, 1 = aggressive
    ) {
        // Get all DEX protocols
        const dexProtocols = this.protocolManager.getProtocolsByType(ProtocolType.DEX);
        // Get pool metrics for each protocol
        const poolMetricsPromises = dexProtocols.map(async (protocol) => {
            const supportedPairs = [
                { tokenA: 'APT', tokenB: 'USDC' },
                { tokenA: 'APT', tokenB: 'USDT' },
                { tokenA: 'USDC', tokenB: 'USDT' }
            ];
            return Promise.all(supportedPairs.map(pair => this.getPoolMetrics(protocol.name, pair.tokenA, pair.tokenB)));
        });
        const allPoolMetrics = (await Promise.all(poolMetricsPromises)).flat();
        // Filter pools based on available tokens
        const eligiblePools = allPoolMetrics.filter(pool => availableTokens[pool.tokenA] && availableTokens[pool.tokenB]);
        // Calculate optimal allocation
        const totalValue = Object.values(availableTokens).reduce((sum, amount) => sum + amount, BigInt(0));
        return this.calculateOptimalAllocation(totalValue, eligiblePools, riskTolerance);
    }
    async executeLiquidityStrategy(strategy) {
        const transactions = [];
        for (const allocation of strategy.allocations) {
            try {
                const params = {
                    tokenA: allocation.tokenA,
                    tokenB: allocation.tokenB,
                    amountA: allocation.amountA,
                    amountB: allocation.amountB
                };
                const tx = await this.protocolManager.executeProtocolAction(allocation.protocol, ProtocolAction.ADD_LIQUIDITY, params);
                transactions.push(tx);
            }
            catch (error) {
                console.error(`Failed to execute liquidity strategy for ${allocation.protocol}:`, error);
                throw error;
            }
        }
        return transactions;
    }
    async addLiquidity(amount) {
        const params = {
            tokenA: 'APT',
            tokenB: 'USDC',
            amountA: BigInt(amount),
            amountB: BigInt(amount) // For simplicity, using 1:1 ratio
        };
        try {
            return await this.protocolManager.executeProtocolAction('pancake', // Default to PancakeSwap for now
            ProtocolAction.ADD_LIQUIDITY, params);
        }
        catch (error) {
            console.error('Failed to add liquidity:', error);
            throw error;
        }
    }
    async removeLiquidity(amount) {
        const params = {
            tokenA: 'APT',
            tokenB: 'USDC',
            amountA: BigInt(amount),
            amountB: BigInt(amount) // For simplicity, using 1:1 ratio
        };
        try {
            return await this.protocolManager.executeProtocolAction('pancake', // Default to PancakeSwap for now
            ProtocolAction.REMOVE_LIQUIDITY, params);
        }
        catch (error) {
            console.error('Failed to remove liquidity:', error);
            throw error;
        }
    }
}
