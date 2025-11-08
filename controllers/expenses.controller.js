import Sequelize from 'sequelize';
import expensesModel from '../models/expenses.model.js';

const { Op, fn, col, literal } = Sequelize;
// If the Expense model is a Sequelize model, override/attach Sequelize-based handlers
class ExpenseController {
    constructor() { }
    // Example Sequelize-based method to get all expenses
    async getAllExpenses(req, res) {
        try {
            const { from, to, q } = req.query;
            const expenses = await expensesModel.findAll({
                where: {
                    ...(from && { date: { [Op.gte]: new Date(from) } }),
                    ...(to && { date: { [Op.lte]: new Date(to) } }),
                    ...(q && {
                        [Op.or]: [
                            { description: { [Op.like]: `%${q}%` } },
                            { notes: { [Op.like]: `%${q}%` } }
                        ]
                    })
                }
            });
            res.status(200).json({ expenses });
        } catch (error) {
            res.status(500).json({ message: 'Failed to fetch expenses', error: error.message, stack: error });
        }
    }

    // Additional Sequelize-based methods can be added here
    async createExpense(req, res) {
        try {
            const newExpense = await expenseModel.create(req.body);
            res.status(201).json(newExpense);
        } catch (error) {
            res.status(500).json({ error: 'Failed to create expense' });
        }
    }

    // Other CRUD operations can be implemented similarly
    async createExpense(req, res, next) {
        try {
            const errMsg = validateExpensePayload(req.body);
            if (errMsg) return res.status(400).json({ error: errMsg });

            const { description, amount, date, category, notes } = req.body;
            const created = await Expense.create({
                description,
                amount,
                date: new Date(date),
                category: category || 'uncategorized',
                notes: notes || ''
            });

            return res.status(201).json(created.get ? created.get({ plain: true }) : created);
        } catch (err) {
            return next(err);
        }
    };
    // Get list of expenses with filtering, sorting, and pagination
    async getExpenses(req, res, next) {
        try {
            const {
                page = 1,
                limit = 25,
                sort = '-date',
                category,
                from,
                to,
                q
            } = req.query;

            const where = {};
            if (category) where.category = category;
            if (from || to) {
                where.date = {};
                if (from) where.date[Op.gte] = new Date(from);
                if (to) where.date[Op.lte] = new Date(to);
            }
            if (q) {
                const like = `%${q}%`;
                where[Op.or] = [
                    { description: { [Op.like]: like } },
                    { notes: { [Op.like]: like } }
                ];
            }

            const sortField = (typeof sort === 'string' && sort.startsWith('-')) ? sort.slice(1) : sort;
            const sortDir = (typeof sort === 'string' && sort.startsWith('-')) ? 'DESC' : 'ASC';
            const order = [[sortField, sortDir]];

            const offset = Math.max(0, (Number(page) - 1)) * Number(limit);

            const [items, total] = await Promise.all([
                Expense.findAll({
                    where,
                    order,
                    offset,
                    limit: Number(limit),
                    raw: true
                }),
                Expense.count({ where })
            ]);

            return res.json({
                page: Number(page),
                limit: Number(limit),
                total,
                items
            });
        } catch (err) {
            return next(err);
        }
    };
    // Get a single expense by ID
    async getExpenseById(req, res, next) {
        try {
            const { id } = req.params;
            const expense = await Expense.findByPk(id, { raw: true });
            if (!expense) return res.status(404).json({ error: 'Expense not found' });
            return res.json(expense);
        } catch (err) {
            return next(err);
        }
    };
    // Update an existing expense by ID
    async updateExpense(req, res, next) {
        try {
            const { id } = req.params;
            const updatable = {};
            ['description', 'amount', 'date', 'category', 'notes'].forEach(k => {
                if (req.body[k] !== undefined) updatable[k] = req.body[k];
            });
            if (updatable.date) updatable.date = new Date(updatable.date);

            // Attempt returning; fallback to fetching after update if not supported
            let updated = null;
            const result = await Expense.update(updatable, { where: { id }, returning: true });
            if (Array.isArray(result) && result[0] === 0) {
                return res.status(404).json({ error: 'Expense not found' });
            }
            if (Array.isArray(result) && result[1] && result[1][0]) {
                updated = result[1][0].toJSON ? result[1][0].toJSON() : result[1][0];
            } else {
                // fallback
                updated = await Expense.findByPk(id, { raw: true });
            }

            return res.json(updated);
        } catch (err) {
            return next(err);
        }
    };

    // Delete an expense by ID
    async deleteExpense(req, res, next) {
        try {
            const { id } = req.params;
            const destroyed = await Expense.destroy({ where: { id } });
            if (!destroyed) return res.status(404).json({ error: 'Expense not found' });
            return res.status(204).send();
        } catch (err) {
            return next(err);
        }
    };
    // Get summary of expenses grouped by category
    async summary(req, res, next) {
        try {
            const { from, to } = req.query;
            const where = {};
            if (from || to) {
                where.date = {};
                if (from) where.date[Op.gte] = new Date(from);
                if (to) where.date[Op.lte] = new Date(to);
            }

            const grouped = await Expense.findAll({
                attributes: [
                    ['category', 'category'],
                    [fn('SUM', col('amount')), 'total'],
                    [fn('COUNT', col('id')), 'count']
                ],
                where,
                group: ['category'],
                order: [[literal('total'), 'DESC']],
                raw: true
            });

            const grand = grouped.reduce((acc, g) => acc + Number(g.total || 0), 0);

            return res.json({ total: grand, byCategory: grouped });
        } catch (err) {
            return next(err);
        }
    };

}

export default new ExpenseController();