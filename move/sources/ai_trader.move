module ai_trader {
    use std::signer;
    use std::string::{Self, String};
    use aptos_framework::account;
    use aptos_framework::coin;
    use aptos_framework::timestamp;

    struct Strategy has key {
        id: u64,
        name: String,
        params: String,
        owner: address,
        created_at: u64,
        last_updated: u64,
    }

    struct StrategyStore has key {
        strategies: vector<Strategy>,
        next_id: u64,
    }

    public fun init_module(account: &signer) {
        let store = StrategyStore {
            strategies: vector::empty<Strategy>(),
            next_id: 0,
        };
        move_to(account, store);
    }

    public entry fun register_strategy(
        account: &signer,
        name: String,
        params: String
    ) acquires StrategyStore {
        let addr = signer::address_of(account);
        let store = borrow_global_mut<StrategyStore>(addr);
        
        let strategy = Strategy {
            id: store.next_id,
            name,
            params,
            owner: addr,
            created_at: timestamp::now_microseconds(),
            last_updated: timestamp::now_microseconds(),
        };
        
        vector::push_back(&mut store.strategies, strategy);
        store.next_id = store.next_id + 1;
    }

    public entry fun update_strategy(
        account: &signer,
        strategy_id: u64,
        new_params: String
    ) acquires StrategyStore {
        let addr = signer::address_of(account);
        let store = borrow_global_mut<StrategyStore>(addr);
        let strategy = vector::borrow_mut(&mut store.strategies, strategy_id);
        
        assert!(strategy.owner == addr, 1); // Only owner can update
        strategy.params = new_params;
        strategy.last_updated = timestamp::now_microseconds();
    }

    #[view]
    public fun get_strategy_details(
        addr: address,
        strategy_id: u64
    ): (String, String, u64, u64) acquires StrategyStore {
        let store = borrow_global<StrategyStore>(addr);
        let strategy = vector::borrow(&store.strategies, strategy_id);
        
        (
            strategy.name,
            strategy.params,
            strategy.created_at,
            strategy.last_updated
        )
    }

    public entry fun execute_trade(
        account: &signer,
        strategy_id: u64,
        amount: u64,
        price: u64
    ) acquires StrategyStore {
        let addr = signer::address_of(account);
        let store = borrow_global<StrategyStore>(addr);
        let strategy = vector::borrow(&store.strategies, strategy_id);
        
        assert!(strategy.owner == addr, 1); // Only owner can execute trades
        // Trade execution logic would go here
        // For now, we just verify the strategy exists
    }
}
