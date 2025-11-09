import e from "express";
import ExpenseController from '../controllers/expenses.controller.js';
const router = e.Router();

router.get('/', ExpenseController.getAllExpenses);
router.post('/', ExpenseController.createExpense);
router.get('/list', ExpenseController.getExpenses);
router.get('/:idExpense', ExpenseController.getExpenseById);
router.put('/:idExpense', ExpenseController.updateExpense);
router.delete('/:idExpense', ExpenseController.deleteExpense);
router.get('/summary/all', ExpenseController.getExpenseSummary);
router.get('/summary/daily', ExpenseController.getDailyExpenseSummary);
router.get('/summary/monthly', ExpenseController.getMonthlyExpenseSummary);
router.get('/summary/annual', ExpenseController.getAnnualExpenseSummary);
router.get('/summary/category', ExpenseController.getExpenseSummaryByCategory);
export default router;