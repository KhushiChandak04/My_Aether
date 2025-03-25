import { ProtocolType, ProtocolAction } from "./types";
export class LiquidswapProtocol {
    constructor() {
        this.name = "Liquidswap";
        this.address = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12";
        this.type = ProtocolType.DEX;
    }
    async getPayload(action, params) {
        switch (action) {
            case ProtocolAction.SWAP:
                return this.getSwapPayload(params);
            case ProtocolAction.ADD_LIQUIDITY:
                return this.getAddLiquidityPayload(params);
            case ProtocolAction.REMOVE_LIQUIDITY:
                return this.getRemoveLiquidityPayload(params);
            default:
                throw new Error(`Action ${action} not supported for ${this.name}`);
        }
    }
    async getSwapPayload(params) {
        return {
            function: `${this.address}::scripts::swap`,
            type_arguments: [params.tokenIn, params.tokenOut],
            arguments: [
                params.amountIn.toString(),
                params.minAmountOut.toString()
            ]
        };
    }
    async getAddLiquidityPayload(params) {
        return {
            function: `${this.address}::scripts::add_liquidity`,
            type_arguments: [params.tokenA, params.tokenB],
            arguments: [
                params.amountA.toString(),
                params.amountB.toString(),
                (params.minLpTokens || 0n).toString()
            ]
        };
    }
    async getRemoveLiquidityPayload(params) {
        return {
            function: `${this.address}::scripts::remove_liquidity`,
            type_arguments: [params.tokenA, params.tokenB],
            arguments: [
                params.amountA.toString(),
                params.amountB.toString()
            ]
        };
    }
}
