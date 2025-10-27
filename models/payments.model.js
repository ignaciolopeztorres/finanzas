//payments.model.js
/**
 * Modelo de pagos
 * - amout: monto del pago
 * - date: Fecha del pago
 * - method: Metodo de pago
 * - references: referencia
 * - notes: notas adicionales u observaciones
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";

class Payment extends Model{}

Payment.init({
    idPayment: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        min: 0
    },
    date: {
        type: DataTypes.DATE,
        allowNull: true,
        defaultValue: DataTypes  .NOW
    },
    method: {
        type: DataTypes.STRING,
        enum: ['cash', 'credit_card', 'bank_transfer', 'other'],
        allowNull: false,
    },
    reference: {
        type: DataTypes.STRING,
        allowNull: true
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    modelName: "Payment",
    timestamps: true
});

export default Payment;