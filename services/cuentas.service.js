import cuentasRepository from '../repositories/cuentas.repository.js';

class CuentaService{
    constructor(){ }
    // Example: Register a new user account
    async nuevaCuenta(data) {
        try {
            const { name, balance } = data;
            // Validate input data (you can add more validation as needed)
            if (!name || balance === undefined) {
                throw new Error('Name and balance are required');
            }
            // Create a new account using the repository
            const newAccount = await cuentasRepository.create({
                name,
                balance,
            });
            return { success: true, data: newAccount };
        } catch (error) {
            console.error('Error registering user:', error);
            throw new Error('Failed to register user');
        }
    }

    async updateBalance(userId, amount, type) {
        try {
            const account = await cuentasRepository.findById(userId);
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
            throw new Error('Failed to update balance');
        }
    }
}

export default CuentaService;
