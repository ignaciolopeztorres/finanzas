import PaymentService from '../models/payments.model.js';

class PaymentsController {
    /* Create a new payment */
    async createPayment(req, res) {
        try {
            console.log(req.body);
            const payment = await PaymentService.createPayment(req.body);
            res.status(201).json(payment);
        } catch (error) {
            res.status(400).json({ message: 'Error creating payment', error: error.message });
        }

    }

    async getPayments(req, res) {
        try {
            const payments = await PaymentService.listPayments();
            res.status(200).json(payments);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving payments', error: error.message });
        }
    }

    async getPaymentById(req, res) {
        try {
            const payment = await PaymentService.getPaymentById(req.params.id);
            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(200).json(payment);
        } catch (error) {
            res.status(500).json({ message: 'Error retrieving payment', error: error.message });
        }
    }

    async updatePayment(req, res) {
        try {
            const payment = await PaymentService.updatePayment(req.params.id, req.body);
            if (!payment) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(200).json(payment);
        } catch (error) {
            res.status(400).json({ message: 'Error updating payment', error: error.message });
        }
    }

    async deletePayment(req, res) {
        try {
            const result = await PaymentService.deletePayment(req.params.id);
            if (!result) {
                return res.status(404).json({ error: 'Payment not found' });
            }
            res.status(204).send();
        } catch (error) {
            res.status(500).json({ message: 'Error deleting payment', error: error.message });
        }
    }
}

export default new PaymentsController();