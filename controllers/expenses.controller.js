import Sequelize from 'sequelize';
import expensesModel from '../models/expenses.model.js';
import Expense from '../models/expenses.model.js';

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

    // Other CRUD operations can be implemented similarly
    async createExpense(req, res, next) {
        try {
            //const errMsg = validateExpensePayload(req.body);
            //if (errMsg) return res.status(400).json({ error: errMsg });

            const { title, description, amount, methodPayment, date, categoryId, notes, isRecurring, recurrenceInterval }  = req.body;
            const created = await expensesModel.create({
                title,
                description,
                amount,
                methodPayment,
                date: new Date(date),
                categoryId: categoryId || 'uncategorized',
                notes: notes || '',
                isRecurring,
                recurrenceInterval
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
            const { idExpense } = req.params;
            console.log('Fetching expense with id:', idExpense);
            const expense = await Expense.findOne({ where: { idExpense: idExpense }, raw: true });
            if (!expense) return res.status(404).json({ message: 'Expense not found ', idExpense, error: 'NotFound' });
            return res.json(expense);
        } catch (err) {
            return next(err);
        }
    };
    // Update an existing expense by ID
    async updateExpense(req, res, next) {
        try {
            const { idExpense } = req.params;
            const updatable = {};
            ['title', 'description', 'amount', 'date', 'categoryId', 'notes'].forEach(k => {
                if (req.body[k] !== undefined) updatable[k] = req.body[k];
            });
            if (updatable.date) updatable.date = new Date(updatable.date);

            // Attempt returning; fallback to fetching after update if not supported
            let updated = null;
            const result = await Expense.update(updatable, { where: { idExpense }, returning: true });
            if (Array.isArray(result) && result[0] === 0) {
                return res.status(404).json({ error: 'Expense not found' });
            }
            if (Array.isArray(result) && result[1] && result[1][0]) {
                updated = result[1][0].toJSON ? result[1][0].toJSON() : result[1][0];
            } else {
                // fallback
                updated = await Expense.findOne({ where: { idExpense }, raw: true });
            }

            return res.json(updated);
        } catch (err) {
            return next(err);
        }
    };

    // Delete an expense by ID
    async deleteExpense(req, res, next) {
        try {
            const { idExpense } = req.params;
            const destroyed = await Expense.destroy({ where: { idExpense } });
            if (!destroyed) return res.status(404).json({ error: 'Expense not found' });
            return res.status(204).send();
        } catch (err) {
            return next(err);
        }
    };
    // Get summary of expenses grouped by category
    async getExpenseSummary(req, res, next) {
        try {
            console.log('getExpenseSummary called');
            const { from, to } = req.query;
            console.log('getExpenseSummary called with from:', from, 'to:', to);
            const where = {};
            if (from || to) {
                where.date = {};
                if (from) where.date[Op.gte] = new Date(from);
                if (to) where.date[Op.lte] = new Date(to);
            }

            const grouped = await Expense.findAll({
                attributes: [
                    ['categoryId', 'categoryId'],
                    [fn('SUM', col('amount')), 'total'],
                    [fn('COUNT', col('idExpense')), 'count']
                ],
                where,
                group: ['categoryId'],
                order: [[literal('total'), 'DESC']],
                raw: true
            });

            const grand = grouped.reduce((acc, g) => acc + Number(g.total || 0), 0);

            return res.json({ total: grand, byCategory: grouped });
        } catch (err) {
            console.error(err);
            return next(err);
        }
    };
    // Get expense summary by category
    async getExpenseSummaryByCategory(req, res, next) {
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
                    ['categoryId', 'categoryId'],
                    [fn('SUM', col('amount')), 'total'],
                    [fn('COUNT', col('idExpense')), 'count']
                ],
                where,
                group: ['categoryId'],
                order: [[literal('total'), 'DESC']],
                raw: true
            });

            const grand = grouped.reduce((acc, g) => acc + Number(g.total || 0), 0);

            return res.json({ total: grand, byCategory: grouped });
        } catch (err) {
            return next(err);
        }
    };
    // Get daily expense summary
    async getDailyExpenseSummary(req, res, next) {
        try {
            const { from, to } = req.query;
            const where = {};
            if (from || to) {
                where.date = {};
                if (from) where.date[Op.gte] = new Date(from);
                if (to) where.date[Op.lte] = new Date(to);
                console.log('Filtering daily summary from', from, 'to', to);
            }
            const daily = await Expense.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('date'), '%Y-%m-%d'), 'day'],
                    [fn('SUM', col('amount')), 'total']
                ],
                where,
                group: [fn('DATE_FORMAT', col('date'), '%Y-%m-%d')],
                order: [[literal('day'), 'ASC']],
                raw: true
            });
            console.log('Daily expense summary:', daily);
            return res.json(daily);
        } catch (err) {
            return next(err);
        }
    };
    // Get monthly expense summary
    async getMonthlyExpenseSummary(req, res, next) {
        try {
            const { year } = req.query;
            const where = {};
            if (year) {
                const start = new Date(`${year}-01-01`);
                const end = new Date(`${year}-12-31`);
                where.date = { [Op.between]: [start, end] };
            }
            const monthly = await Expense.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('date'), '%Y-%m'), 'month'],
                    [fn('SUM', col('amount')), 'total']
                ],
                where,
                group: [fn('DATE_FORMAT', col('date'), '%Y-%m')],
                order: [[literal('month'), 'ASC']],
                raw: true
            });

            return res.json(monthly);
        } catch (err) {
            return next(err);
        }
    };
    // Get annual expense summary
    async getAnnualExpenseSummary(req, res, next) {
        try {
            const { from, to } = req.query;
            const where = {};
            if (from || to) {
                where.date = {};
                if (from) where.date[Op.gte] = new Date(from);
                if (to) where.date[Op.lte] = new Date(to);
            }
            const annual = await Expense.findAll({
                attributes: [
                    [fn('DATE_FORMAT', col('date'), '%Y'), 'year'],
                    [fn('SUM', col('amount')), 'total']
                ],
                where,
                group: [fn('DATE_FORMAT', col('date'), '%Y')],
                order: [[literal('year'), 'ASC']],
                raw: true
            });

            return res.json(annual);
        } catch (err) {
            return next(err);
        }
    };
}

export default new ExpenseController();