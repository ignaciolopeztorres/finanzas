import transactionRepository from '../repositories/transaction.repository.js';
import cuentaService from './cuentas.service.js';

class TransactionService {
    constructor() { }

    // Create a new transaction
    async createTransaction (data) {
        try {
            const transaction = await transactionRepository.createTransaction({
                type: data.type,
                amount: data.amount,
                date: data.date,
                description: data.description,
                category: data.category,
                user: data.userId // Assuming you have user authentication
            });

            const savedTransaction = await transaction.save();

            // Optionally, you can perform additional operations here, such as updating user balance, sending notifications, etc.
            console.log('Updating balance for user:', data.userId);
            const updateResult = await cuentaService.updateBalance(data.userId, data.amount, data.type); // Example of updating balance
            console.log('Balance update result:', updateResult);
            return savedTransaction;
        } catch (error) {
            console.error('Error creating transaction:', error);
            return { status: 'error', message: error.message }; // or throw an error depending on your error handling strategy
        }
    }

    // Get all transactions for a user
    async findAllTransactions (userId) {
        try {
            const transactions = await transactionRepository.findAllTransactions(userId);
            return transactions;
        } catch (error) {
            console.error('Error finding transactions:', error);
            return { status: 'error', message: error.message }; // or throw an error depending on your error handling strategy
        }
    }

    // Get a single transaction by id
    async findOne (data) {
        try {
            const transaction = await transactionRepository.findOne({

                _id: req.params.id,
                user: req.user.id
            });
            if (!transaction) {
                throw new Error("Transaction not found");
            }
            return transaction;
        } catch (error) {
            return { status: 'error', message: error.message }; // or throw an error depending on your error handling strategy
        }
    }

    // Update a transaction
    async update (req, res) {
        try {
            const updatedTransaction = await transactionRepository.updateTransaction(
                { _id: req.params.id, user: req.user.id },
                req.body
            );
            if (!updatedTransaction) {
                throw new Error("Transaction not found");
            }
            return updatedTransaction;
        } catch (error) {
            return { status: 'error', message: error.message }; // or throw an error depending on your error handling strategy
        }
    };

    // Delete a transaction
    async delete (req, res) {
        try {
            const deletedTransaction = await transactionRepository.deleteTransaction({
                _id: req.params.id,
                user: req.user.id
            });
            if (!deletedTransaction) {
                throw new Error("Transaction not found");
            }
            return deletedTransaction;
        } catch (error) {
            return { status: 'error', message: error.message }; // or throw an error depending on your error handling strategy
        }
    }
}

export default new TransactionService();