import express from'express';
import PaymentController from '../controllers/payments.controller.js';

const router = express.Router();

// Routes
router.get('/', PaymentController.getPayments);
router.post('/', PaymentController.createPayment);
router.get('/:id', PaymentController.getPaymentById);
router.put('/:id', PaymentController.updatePayment);
router.delete('/:id', PaymentController.deletePayment);

export default router;