import { ProtocolType, ProtocolAction } from "./types";
export class AptinProtocol {
    constructor() {
        this.name = "Aptin";
        this.address = "0x38d39a13a4c03d58a6e16d48e22a14e8e6817e5c2329853c2f047a2c36486fea";
        this.type = ProtocolType.LENDING;
    }
    async getPayload(action, params) {
        switch (action) {
            case ProtocolAction.SUPPLY:
                return this.getSupplyPayload(params);
            case ProtocolAction.BORROW:
                return this.getBorrowPayload(params);
            case ProtocolAction.REPAY:
                return this.getRepayPayload(params);
            default:
                throw new Error(`Action ${action} not supported for ${this.name}`);
        }
    }
    async getSupplyPayload(params) {
        return {
            function: `${this.address}::lending::supply`,
            type_arguments: [params.token],
            arguments: [params.amount.toString()]
        };
    }
    async getBorrowPayload(params) {
        return {
            function: `${this.address}::lending::borrow`,
            type_arguments: [params.token],
            arguments: [
                params.amount.toString(),
                (params.interestRate || 0).toString()
            ]
        };
    }
    async getRepayPayload(params) {
        return {
            function: `${this.address}::lending::repay`,
            type_arguments: [params.token],
            arguments: [params.amount.toString()]
        };
    }
}
