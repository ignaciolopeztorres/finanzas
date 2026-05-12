import cuentasRepository from '../repositories/cuentas.repository.js';

class CuentaService{
    constructor(){ }
    // Example: Register a new user account
    async nuevaCuenta(data) {
        try {
            const { name, balance, userId } = data;
            // Validate input data (you can add more validation as needed)
            if (!name || balance === undefined) {
                throw new Error('Name and balance are required');
            }
            // Create a new account using the repository
            const newAccount = await cuentasRepository.create({
                name,
                balance,
                userId
            });
            return { success: true, data: newAccount };
        } catch (error) {
            console.error('Error registering user:', error);
            return { success: false, message: 'Failed to register user', error: error.message };
        }
    }

    async updateBalance(userId, amount, type) {
        try {
            const account = await cuentasRepository.findByfield('userId', userId);
            console.log('Account found:', account);
            if (!account) {
                throw new Error('Account not found');
            }
            let newBalance = parseFloat(account.balance);
            if (type === 'income') {
                newBalance += parseFloat(amount);
            } else if (type === 'expense') {
                newBalance -= parseFloat(amount);
            } else {
                throw new Error('Invalid transaction type');
            }
            account.balance = newBalance;
            await account.save();
            return { success: true, data: account };
        } catch (error) {
            console.error('Error updating balance:', error);
            return { success: false, message: 'Failed to update balance', error: error.message };
        }
    }
}

export default new CuentaService();
