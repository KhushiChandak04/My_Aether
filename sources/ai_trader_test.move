#[test_only]
module aether_ai::ai_trader_tests {
    use std::signer;
    use std::vector;
    use aptos_framework::timestamp;
    use aptos_framework::account;
    use aether_ai::ai_trader;

    // Test account addresses
    const ADMIN: address = @0x123;
    const USER: address = @0x456;
    const CORE_FRAMEWORK: address = @0x1;

    // Test data
    const STRATEGY_NAME: vector<u8> = b"Test Strategy";
    const STRATEGY_PARAMS: vector<u8> = b"{\"risk_level\": \"medium\"}";
    const TRADE_ACTION: vector<u8> = b"BUY";
    const TRADE_AMOUNT: u64 = 1000000;
    const TRADE_PRICE: u64 = 500000;

    // Helper function to create and fund test accounts
    fun setup_test_accounts(): (signer, signer) {
        // Create framework account first
        let framework_account = account::create_account_for_test(CORE_FRAMEWORK);
        
        // Initialize timestamp module
        timestamp::set_time_has_started_for_testing(&framework_account);
        
        // Create test accounts
        let admin = account::create_account_for_test(ADMIN);
        let user = account::create_account_for_test(USER);
        
        (admin, user)
    }

    #[test]
    fun test_register_strategy_success() {
        let (admin, _) = setup_test_accounts();
        
        // Register a new strategy
        ai_trader::register_strategy(
            &admin,
            STRATEGY_NAME,
            STRATEGY_PARAMS
        );

        // Verify strategy details
        let (name, params, _) = ai_trader::get_strategy_details(ADMIN, timestamp::now_microseconds());
        assert!(name == STRATEGY_NAME, 0);
        assert!(params == STRATEGY_PARAMS, 1);
    }

    #[test]
    fun test_execute_trade_success() {
        let (admin, _) = setup_test_accounts();
        
        // Register strategy first
        ai_trader::register_strategy(
            &admin,
            STRATEGY_NAME,
            STRATEGY_PARAMS
        );

        let strategy_id = timestamp::now_microseconds();

        // Execute trade
        ai_trader::execute_trade<u8>(
            &admin,
            strategy_id,
            TRADE_ACTION,
            TRADE_AMOUNT,
            TRADE_PRICE
        );
    }

    #[test]
    fun test_update_strategy_success() {
        let (admin, _) = setup_test_accounts();
        
        // Register strategy
        ai_trader::register_strategy(
            &admin,
            STRATEGY_NAME,
            STRATEGY_PARAMS
        );

        let strategy_id = timestamp::now_microseconds();
        let new_params = b"{\"risk_level\": \"high\"}";

        // Update strategy parameters
        ai_trader::update_strategy(
            &admin,
            strategy_id,
            new_params
        );

        // Verify updated parameters
        let (_, params, _) = ai_trader::get_strategy_details(ADMIN, strategy_id);
        assert!(params == new_params, 0);
    }

    #[test]
    #[expected_failure(abort_code = ai_trader::ESTRATEGY_NOT_FOUND)]
    fun test_update_strategy_nonexistent() {
        let (admin, _) = setup_test_accounts();
        let invalid_strategy_id = 999999;
        
        // Attempt to update non-existent strategy
        ai_trader::update_strategy(
            &admin,
            invalid_strategy_id,
            STRATEGY_PARAMS
        );
    }

    #[test]
    #[expected_failure(abort_code = ai_trader::ESTRATEGY_NOT_FOUND)]
    fun test_get_strategy_details_nonexistent() {
        let (admin, _) = setup_test_accounts();
        let invalid_strategy_id = 999999;
        
        // Attempt to get details of non-existent strategy
        ai_trader::get_strategy_details(ADMIN, invalid_strategy_id);
    }
}