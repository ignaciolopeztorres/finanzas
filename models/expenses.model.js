// models/expenses.js
/**
 * Modelo de Gasto
 * - description: descripción del gasto
 * - amount: monto del gasto
 * - date: fecha del gasto
 * - notes: notas adicionales
 */
import { DataTypes, Model} from 'sequelize';
import sequelize from '../core/config/sequelize.config.js';

class Expense extends Model {}

Expense.init({
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
}, {
    sequelize,
    tableName: 'expenses',
    timestamps: true,
});

export default new Expense();