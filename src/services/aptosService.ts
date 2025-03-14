import { AptosClient, Types } from "aptos";

export class AptosService {
  private client: AptosClient;
  private moduleAddress =
    "0x28b16dd6d82b32f9322547f77f465460f5354cc9587c09a0735001456efd3c3e";

  constructor() {
    this.client = new AptosClient("https://fullnode.devnet.aptoslabs.com");
  }

  async registerStrategy(
    account: Types.AccountAddress,
    name: string,
    params: string
  ) {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::register_strategy`,
      type_arguments: [],
      arguments: [name, params],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async executeTrade(
    account: Types.AccountAddress,
    strategyId: number,
    action: string,
    amount: number,
    price: number
  ) {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::execute_trade`,
      type_arguments: ["u8"],
      arguments: [strategyId, action, amount, price],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async updateStrategy(
    account: Types.AccountAddress,
    strategyId: number,
    newParams: string
  ) {
    const payload = {
      type: "entry_function_payload",
      function: `${this.moduleAddress}::ai_trader::update_strategy`,
      type_arguments: [],
      arguments: [strategyId, newParams],
    };

    return await this.client.generateTransaction(account, payload);
  }

  async getStrategyDetails(owner: Types.AccountAddress, strategyId: number) {
    const payload = {
      type: "view_function",
      function: `${this.moduleAddress}::ai_trader::get_strategy_details`,
      type_arguments: [],
      arguments: [owner, strategyId],
    };

    return await this.client.view(payload);
  }
}
