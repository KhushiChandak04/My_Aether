const API_BASE_URL = '/api';
export const api = {
    async recordTrade(trade) {
        try {
            // Ensure all required fields are present
            if (!trade.walletAddress || !trade.strategy || !trade.type || !trade.amount || !trade.price) {
                throw new Error('Missing required fields: walletAddress, strategy, type, amount, price');
            }
            // Ensure timestamp is set
            if (!trade.timestamp) {
                trade.timestamp = new Date();
            }
            // Ensure status is set
            if (!trade.status) {
                trade.status = 'pending';
            }
            const response = await fetch(`${API_BASE_URL}/trades`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(trade),
            });
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to record trade');
            }
        }
        catch (error) {
            console.error('Error recording trade:', error);
            throw error;
        }
    },
    async getTrades() {
        try {
            const response = await fetch(`${API_BASE_URL}/trades`);
            if (!response.ok) {
                throw new Error('Failed to fetch trades');
            }
            const data = await response.json();
            return data.data || [];
        }
        catch (error) {
            console.error('Error fetching trades:', error);
            throw error;
        }
    }
};
