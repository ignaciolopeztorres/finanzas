import Income from "../models/income.model.js";

class IncomeRepository {
    static async findAllIncomes() {
        return await Income.findAll();
    }

    static async findIncomeById(id) {
        return await Income.findByPk(id);
    }

    static async createIncome(data) {
        return await Income.create(data);
    }

    static async updateIncome(id, data) {
        const income = await Income.findByPk(id);
        if (!income) throw new Error('Income not found');
        return await income.update(data);
    }

    static async deleteIncome(id) {
        const income = await Income.findByPk(id);
        if (!income) throw new Error('Income not found');
        return await income.destroy();
    }
}

export default IncomeRepository;
