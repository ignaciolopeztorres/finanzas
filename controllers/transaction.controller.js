const Transaction = require('../models/transaction.model');

// Create a new transaction
exports.create = async (req, res) => {
    try {
        const transaction = new Transaction({
            type: req.body.type,
            amount: req.body.amount,
            description: req.body.description,
            date: req.body.date,
            category: req.body.category,
            user: req.user.id // Assuming you have user authentication
        });

        const savedTransaction = await transaction.save();
        res.status(201).json(savedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all transactions for a user
exports.findAll = async (req, res) => {
    try {
        const transactions = await Transaction.find({ user: req.user.id });
        res.status(200).json(transactions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get a single transaction by id
exports.findOne = async (req, res) => {
    try {
        const transaction = await Transaction.findOne({
            _id: req.params.id,
            user: req.user.id
        });
        if (!transaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(transaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Update a transaction
exports.update = async (req, res) => {
    try {
        const updatedTransaction = await Transaction.findOneAndUpdate(
            { _id: req.params.id, user: req.user.id },
            req.body,
            { new: true }
        );
        if (!updatedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json(updatedTransaction);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Delete a transaction
exports.delete = async (req, res) => {
    try {
        const deletedTransaction = await Transaction.findOneAndDelete({
            _id: req.params.id,
            user: req.user.id
        });
        if (!deletedTransaction) {
            return res.status(404).json({ message: "Transaction not found" });
        }
        res.status(200).json({ message: "Transaction deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};