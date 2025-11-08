import e from "express";
const router = e.Router();
import ExpenseController from '../controllers/expenses.controller.js';
router.get('/', ExpenseController.getAllExpenses);
router.post('/', ExpenseController.createExpense);
export default router;