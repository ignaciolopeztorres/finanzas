// models/Transaction.js
/**
 * Modelo de transacciones
 */
import { DataTypes, Model } from 'sequelize';
import sequelize from '../core/config/sequelize.config.js';

class Transaction extends Model { }

Transaction.init({
    idTransaction: {
        type: DataTypes.UUID,
        primaryKey: true,
        defaultValue: DataTypes.UUIDV4,
    },
    type: {
        type: DataTypes.ENUM('Income', 'Expense'),
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        defaultValue: DataTypes.NOW,
    },
}, {
    sequelize,
    tableName: 'transactions',
    timestamps: true, // createdAt, updatedAt
});

export default Transaction;
