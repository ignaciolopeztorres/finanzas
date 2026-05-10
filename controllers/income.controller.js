import Income from "../models/income.model.js";

class IncomeController {
    constructor() {  }

    async getAllIncomes(req, res) {
        try {
            const incomes = await Income.findAll();
            if (incomes.length === 0) {
                return res.status(200).json({ message: 'No incomes found' });
            }
            res.status(200).json({ incomes });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch incomes' });
        }
    }
    
    // Example: Get income details
    async getIncomeDetails (req, res) {
        try {
            const { idIncome } = req.params;
            const incomeDetails = await Income.findByPk(idIncome);
            if (!incomeDetails) {
                return res.status(404).json({ error: 'Income not found' });
            }
            res.json({ success: true, data: incomeDetails });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch income details' });
        }
    }

    // Example: Add new income entry
    async addIncome(req, res) {
        try {
            const { source, amount, date, notes, CategoryId } = req.body;
            const newIncome = await Income.create({ 
                source, amount, date, notes, CategoryId
            });
        
            res.status(201).json({ success: true, data: newIncome });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }   
    }
    // Example: Update an existing income entry
    async updateIncome(req, res) {
        try {
            const { idIncome } = req.params;
            const { source, amount, date, notes } = req.body;   
            const updatedIncome = await Income.findByPk(idIncome);
            if (!updatedIncome) {
                return res.status(404).json({ error: 'Income not found' });
            }
            // Update the income entry
            updatedIncome.source = source;
            updatedIncome.amount = amount;
            updatedIncome.date = date;
            updatedIncome.notes = notes;
            await updatedIncome.save();
            res.json({ success: true, data: updatedIncome });
        } catch (error) {
            res.status(500).json({ error: 'Failed to update income' });
        }
    }
    async deleteIncome(req, res) {
        try {
            const { idIncome } = req.params;
            const deletedIncome = await Income.findByPk(idIncome);
            if (!deletedIncome) {
                return res.status(404).json({ error: 'Income not found' });
            }
            await deletedIncome.destroy();
            res.json({ success: true, message: 'Income deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete income' });
        }
    }
}

export default new IncomeController();


