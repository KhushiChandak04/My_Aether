import { AptosClient, Types } from "aptos";

export class AptosService {
  private client: AptosClient;
  private moduleAddress = "0xa08d5a46e1222477997445f50d64f52fae183f16bfa1d0b95e0d135bc8d15c46";

  constructor() {
    this.client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
  }

  async registerStrategy(
    account: string,
    name: string,
    param: string
  ) {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::register_strategy`,
      type_arguments: [],
      arguments: [name, param],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async executeTrade(
    account: string,
    strategyId: string,
    amount: number,
    price: number,
    tradeType: "buy" | "sell"
  ) {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::execute_trade`,
      type_arguments: [],
      arguments: [strategyId, amount.toString(), price.toString(), tradeType],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async updateStrategy(
    account: string,
    strategyId: string,
    newParam: string
  ) {
    const payload: Types.TransactionPayload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::update_strategy`,
      type_arguments: [],
      arguments: [strategyId, newParam],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async getStrategyDetails(
    account: string,
    strategyId: number
  ) {
    const payload: Types.ViewRequest = {
      function: `${this.moduleAddress}::ai_trader::get_strategy_details`,
      type_arguments: [],
      arguments: [account, strategyId.toString()],
    };

    return await this.client.view(payload);
  }
}
