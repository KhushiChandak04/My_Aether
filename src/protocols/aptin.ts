import { Types } from "aptos";
import { DeFiProtocol, ProtocolType, ProtocolAction, LendingParams } from "./types";

export class AptinProtocol implements DeFiProtocol {
    readonly name = "Aptin";
    readonly address = "0x38d39a13a4c03d58a6e16d48e22a14e8e6817e5c2329853c2f047a2c36486fea";
    readonly type = ProtocolType.LENDING;

    async getPayload(action: ProtocolAction, params?: LendingParams): Promise<Types.EntryFunctionPayload> {
        switch (action) {
            case ProtocolAction.SUPPLY:
                return this.getSupplyPayload(params as LendingParams);
            case ProtocolAction.BORROW:
                return this.getBorrowPayload(params as LendingParams);
            case ProtocolAction.REPAY:
                return this.getRepayPayload(params as LendingParams);
            default:
                throw new Error(`Action ${action} not supported for ${this.name}`);
        }
    }

    private async getSupplyPayload(params: LendingParams): Promise<Types.EntryFunctionPayload> {
        return {
            function: `${this.address}::lending::supply`,
            type_arguments: [params.token],
            arguments: [params.amount.toString()]
        };
    }

    private async getBorrowPayload(params: LendingParams): Promise<Types.EntryFunctionPayload> {
        return {
            function: `${this.address}::lending::borrow`,
            type_arguments: [params.token],
            arguments: [
                params.amount.toString(),
                (params.interestRate || 0).toString()
            ]
        };
    }

    private async getRepayPayload(params: LendingParams): Promise<Types.EntryFunctionPayload> {
        return {
            function: `${this.address}::lending::repay`,
            type_arguments: [params.token],
            arguments: [params.amount.toString()]
        };
    }
}
