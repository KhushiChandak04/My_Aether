import { Types } from "aptos";
import { DeFiProtocol, ProtocolType, ProtocolAction, SwapParams, LiquidityParams } from "./types";

export class LiquidswapProtocol implements DeFiProtocol {
    readonly name = "Liquidswap";
    readonly address = "0x190d44266241744264b964a37b8f09863167a12d3e70cda39376cfb4e3561e12";
    readonly type = ProtocolType.DEX;

    async getPayload(action: ProtocolAction, params?: SwapParams | LiquidityParams): Promise<Types.EntryFunctionPayload> {
        switch (action) {
            case ProtocolAction.SWAP:
                return this.getSwapPayload(params as SwapParams);
            case ProtocolAction.ADD_LIQUIDITY:
                return this.getAddLiquidityPayload(params as LiquidityParams);
            case ProtocolAction.REMOVE_LIQUIDITY:
                return this.getRemoveLiquidityPayload(params as LiquidityParams);
            default:
                throw new Error(`Action ${action} not supported for ${this.name}`);
        }
    }

    private async getSwapPayload(params: SwapParams): Promise<Types.EntryFunctionPayload> {
        return {
            function: `${this.address}::scripts::swap`,
            type_arguments: [params.tokenIn, params.tokenOut],
            arguments: [
                params.amountIn.toString(),
                params.minAmountOut.toString()
            ]
        };
    }

    private async getAddLiquidityPayload(params: LiquidityParams): Promise<Types.EntryFunctionPayload> {
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

    private async getRemoveLiquidityPayload(params: LiquidityParams): Promise<Types.EntryFunctionPayload> {
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
