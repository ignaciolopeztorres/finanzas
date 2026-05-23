import Payment from '../models/payments.model.js'; // Adjust path as needed

class PaymentService {
    /* Create a new payment */
    async createPayment(data) {
        try {
            console.log('valor de payment:', data.date);
            const payment = await Payment.create({ 
                amount: data.amount, 
                date: data.date,
                method: data.method, 
                reference: data.reference,
                payer: data.payer,
                notes: data.notes 
            });
            return payment;
        } catch (error) {
            console.error('Error creating payment on service:', error);
            throw error;
        }
    }
    /* Get payment by ID */
    async getPaymentById(id) {
        const payment = await Payment.findOne({ where: { idPayment: id } });
        return payment;
    }
    /* Update payment by ID */
    async updatePayment(id, data) {
        const payment = await Payment.findOne({ where: { idPayment: id } });
        if (!payment) throw new Error('Payment not found');
        return await payment.update(data);
    }
    /* Delete payment by ID */
    async deletePayment(id) {
        const payment = await Payment.findByPk(id);
        if (!payment) throw new Error('Payment not found');
        return await payment.destroy();
    }
    /* List all payments */
    async listPayments(filter = {}) {
        return await Payment.findAll({ where: filter });
    }
}

export default new PaymentService();