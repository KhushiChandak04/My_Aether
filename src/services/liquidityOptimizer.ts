import { Types } from "aptos";
import { ProtocolType, ProtocolAction, LiquidityParams } from "../protocols/types";
import { ProtocolManager } from "../protocols/manager";

interface PoolMetrics {
    protocol: string;
    tokenA: string;
    tokenB: string;
    apy: number;
    tvl: bigint;
    volume24h: bigint;
    userShare?: bigint;
}

interface OptimizationResult {
    allocations: {
        protocol: string;
        tokenA: string;
        tokenB: string;
        amountA: bigint;
        amountB: bigint;
        expectedApy: number;
    }[];
    totalExpectedApy: number;
}

export class LiquidityOptimizer {
    constructor(private protocolManager: ProtocolManager) {}

    async getPoolMetrics(protocol: string, tokenA: string, tokenB: string): Promise<PoolMetrics> {
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

    private calculateOptimalAllocation(
        availableAmount: bigint,
        pools: PoolMetrics[],
        riskTolerance: number
    ): OptimizationResult {
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

        const totalExpectedApy = allocations.reduce(
            (sum, allocation) => sum + allocation.expectedApy,
            0
        ) / allocations.length;

        return {
            allocations,
            totalExpectedApy
        };
    }

    async optimizeLiquidity(
        availableTokens: { [key: string]: bigint },
        riskTolerance: number = 0.5 // 0 = conservative, 1 = aggressive
    ): Promise<OptimizationResult> {
        // Get all DEX protocols
        const dexProtocols = this.protocolManager.getProtocolsByType(ProtocolType.DEX);
        
        // Get pool metrics for each protocol
        const poolMetricsPromises = dexProtocols.map(async protocol => {
            const supportedPairs = [
                { tokenA: 'APT', tokenB: 'USDC' },
                { tokenA: 'APT', tokenB: 'USDT' },
                { tokenA: 'USDC', tokenB: 'USDT' }
            ];

            return Promise.all(
                supportedPairs.map(pair => 
                    this.getPoolMetrics(protocol.name, pair.tokenA, pair.tokenB)
                )
            );
        });

        const allPoolMetrics = (await Promise.all(poolMetricsPromises)).flat();

        // Filter pools based on available tokens
        const eligiblePools = allPoolMetrics.filter(pool => 
            availableTokens[pool.tokenA] && availableTokens[pool.tokenB]
        );

        // Calculate optimal allocation
        const totalValue = Object.values(availableTokens).reduce(
            (sum, amount) => sum + amount,
            BigInt(0)
        );

        return this.calculateOptimalAllocation(totalValue, eligiblePools, riskTolerance);
    }

    async executeLiquidityStrategy(strategy: OptimizationResult): Promise<Types.UserTransaction[]> {
        const transactions: Types.UserTransaction[] = [];

        for (const allocation of strategy.allocations) {
            try {
                const params: LiquidityParams = {
                    tokenA: allocation.tokenA,
                    tokenB: allocation.tokenB,
                    amountA: allocation.amountA,
                    amountB: allocation.amountB
                };

                const tx = await this.protocolManager.executeProtocolAction(
                    allocation.protocol,
                    ProtocolAction.ADD_LIQUIDITY,
                    params
                );

                transactions.push(tx);
            } catch (error) {
                console.error(`Failed to execute liquidity strategy for ${allocation.protocol}:`, error);
                throw error;
            }
        }

        return transactions;
    }
}
