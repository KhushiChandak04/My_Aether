import { AptosClient, Types } from "aptos";

// Default values if env vars are not set
const DEFAULT_MODULE_ADDRESS = "0x23306993ed0d0feb8ef9d97cd6853cf54b21ac058a5c2fddda801020cb7c5789";
const DEFAULT_NODE_URL = "https://fullnode.devnet.aptoslabs.com/v1";

export class AptosService {
  private client: AptosClient;
  private moduleAddress: string;

  constructor() {
    // Use environment variables with fallbacks
    this.moduleAddress = import.meta.env.VITE_MODULE_ADDRESS || DEFAULT_MODULE_ADDRESS;
    const nodeUrl = import.meta.env.VITE_APTOS_NODE_URL || DEFAULT_NODE_URL;
    this.client = new AptosClient(nodeUrl);
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
