# AetherAI - AI-Driven Trading on Aptos Blockchain

This project implements a smart contract system for AI-driven trading on the Aptos blockchain, allowing AI models to execute transactions and store trading strategies on-chain.

## Project Structure

```
aether_ai/
├── Move.toml          # Move package manifest
├── sources/
│   └── ai_trader.move # Smart contract implementation
├── src/
│   └── index.ts      # TypeScript SDK for contract interaction
└── package.json      # Node.js package configuration
```

## Smart Contract Features

- Register AI trading strategies with custom parameters
- Execute trades based on AI signals
- Update strategy parameters
- Track trade execution history
- Store performance metrics on-chain

## Getting Started

1. Install dependencies:
```bash
npm install
```

2. Create a `.env` file with your Aptos configuration:
```
APTOS_NODE_URL=https://fullnode.devnet.aptoslabs.com
PRIVATE_KEY=your_private_key_here
```

3. Compile Move contracts:
```bash
aptos move compile
```

4. Example usage of TypeScript SDK:
```typescript
import { AetherAI } from "./src";

const ai = new AetherAI(
    process.env.APTOS_NODE_URL!,
    process.env.PRIVATE_KEY!
);

// Register a new AI trading strategy
await ai.registerStrategy(
    "MeanReversion",
    JSON.stringify({
        lookback_period: 14,
        threshold: 2.0
    })
);

// Execute a trade
await ai.executeTrade(
    strategyId,
    "BUY",
    1000000, // amount in smallest units
    150000000 // price in smallest units
);
```

## Security Considerations

- All transactions are executed through smart contracts for transparency
- Strategy parameters and execution history are stored on-chain
- Access control ensures only authorized AI models can execute trades

## Testing

Test your contracts using the Aptos CLI:
```bash
aptos move test
```
