import Transaction from "../models/transaction.model.js";

/**
 * Repositorio de transacciones 
 */
class TransactionRepository {
    constructor() {
        this.Transaction = Transaction; // Asumiendo que Transaction es tu modelo de Mongoose o similar
    }

    async findAllTransactions(userId) {
        return await this.Transaction.find({ user: userId });
    }
    async createTransaction(data) {
        return await this.Transaction.create(data);
    }
}

export default new TransactionRepository();
