"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AptosService = void 0;
const aptos_1 = require("aptos");
class AptosService {
    constructor() {
        this.moduleAddress = "0xa08d5a46e1222477997445f50d64f52fae183f16bfa1d0b95e0d135bc8d15c46";
        this.client = new aptos_1.AptosClient("https://fullnode.devnet.aptoslabs.com");
    }
    async registerStrategy(account, name, param) {
        const payload = {
            type: "entry_function_payload",
            function: `${this.moduleAddress}::ai_trader::register_strategy`,
            type_arguments: [],
            arguments: [name, param],
        };
        return await this.client.generateTransaction(account, payload);
    }
    async executeTrade(account, strategyId, amount, price, tradeType) {
        const payload = {
            type: "entry_function_payload",
            function: `${this.moduleAddress}::ai_trader::execute_trade`,
            type_arguments: [],
            arguments: [strategyId, amount.toString(), price.toString(), tradeType],
        };
        return await this.client.generateTransaction(account, payload);
    }
    async updateStrategy(account, strategyId, newParam) {
        const payload = {
            type: "entry_function_payload",
            function: `${this.moduleAddress}::ai_trader::update_strategy`,
            type_arguments: [],
            arguments: [strategyId, newParam],
        };
        return await this.client.generateTransaction(account, payload);
    }
    async getStrategyDetails(account, strategyId) {
        const payload = {
            function: `${this.moduleAddress}::ai_trader::get_strategy_details`,
            type_arguments: [],
            arguments: [account, strategyId.toString()],
        };
        return await this.client.view(payload);
    }
}
exports.AptosService = AptosService;
