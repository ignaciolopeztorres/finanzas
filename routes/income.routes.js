// routes/income.routes.js
import express from 'express';
import Income from "../controllers/income.controller.js";

const router = express.Router();

// Example: GET all incomes
router.get('/', Income.getAllIncomes);

// Example: POST a new income
router.post('/', Income.addIncome);

// Example: GET a single income by ID
router.get('/:idIncome', Income.getIncomeDetails);

// Example: PUT update an income by ID
router.put('/:idIncome', Income.updateIncome);

// Example: DELETE an income by ID
router.delete('/:idIncome', Income.deleteIncome);

export default router;