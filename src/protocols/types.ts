import { Types } from "aptos";

export interface DeFiProtocol {
    name: string;
    address: string;
    type: ProtocolType;
    getPayload(action: ProtocolAction, params?: ProtocolParams): Promise<Types.EntryFunctionPayload>;
}

export enum ProtocolType {
    DEX = "DEX",
    LENDING = "LENDING",
    YIELD = "YIELD"
}

export enum ProtocolAction {
    SWAP = "SWAP",
    ADD_LIQUIDITY = "ADD_LIQUIDITY",
    REMOVE_LIQUIDITY = "REMOVE_LIQUIDITY",
    SUPPLY = "SUPPLY",
    BORROW = "BORROW",
    REPAY = "REPAY",
    STAKE = "STAKE",
    UNSTAKE = "UNSTAKE"
}

export interface SwapParams {
    tokenIn: string;
    tokenOut: string;
    amountIn: bigint;
    minAmountOut: bigint;
}

export interface LiquidityParams {
    tokenA: string;
    tokenB: string;
    amountA: bigint;
    amountB: bigint;
    minLpTokens?: bigint;
}

export interface LendingParams {
    token: string;
    amount: bigint;
    interestRate?: number;
}

export type ProtocolParams = SwapParams | LendingParams | LiquidityParams;
