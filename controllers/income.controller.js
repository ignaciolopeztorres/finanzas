import IncomeRepository from "../repositories/Income.repository.js";
import transaccionService from "../services/transaction.service.js";

class IncomeController {
    constructor() {  }

    async getAllIncomes(req, res) {
        try {
            const incomes = await IncomeRepository.findAllIncomes();
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
            const incomeDetails = await IncomeRepository.findIncomeById(idIncome);
            if (!incomeDetails) {
                return res.status(404).json({ error: 'Income not found' });
            }
            res.json({ success: true, data: incomeDetails });
        } catch (error) {
            res.status(500).json({ error: 'Failed to fetch income details' });
        }
    }

    /**
     * Example: Add new income entry
     * @route POST /incomes
     * @body { source, amount, date, notes, CategoryId }
     */
    async addIncome(req, res) {
        try {
            const { source, amount, date, notes, CategoryId, userId } = req.body;

            if (isNaN(Date.parse(date))) {
                return res.status(400).json({ success: false, error: 'Invalid date format' });
            }
            const newIncome = await IncomeRepository.createIncome({ 
                source, amount, date, notes, CategoryId
            });

            // Check if the income was created successfully            
            if (!newIncome) {
                return res.status(400).json({ success: false, error: 'Failed to create income' });
            }

            const transaction = await transaccionService.createTransaction({
                type: 'income',
                amount,
                date,
                description: `Income from ${source}`,
                CategoryId,
                userId: userId// req.user.id // Assuming you have user authentication
            });

            res.status(201).json({ success: true, data: newIncome, transaction: transaction });
        } catch (error) {
            res.status(500).json({ success: false, error: error.message });
        }   
    }
    // Example: Update an existing income entry
    async updateIncome(req, res) {
        try {
            const { idIncome } = req.params;
            const { source, amount, date, notes } = req.body;   
            const updatedIncome = await IncomeRepository.findIncomeById(idIncome);
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
            const deletedIncome = await IncomeRepository.findIncomeById(idIncome);
            if (!deletedIncome) {
                return res.status(404).json({ error: 'Income not found' });
            }
            await IncomeRepository.deleteIncome(idIncome);
            res.json({ success: true, message: 'Income deleted successfully' });
        } catch (error) {
            res.status(500).json({ error: 'Failed to delete income' });
        }
    }
}

export default new IncomeController();


