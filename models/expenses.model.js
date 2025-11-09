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
import Category from './Category.models.js';

class Expense extends Model {}

Expense.init({
    idExpense: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    title: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    description: {
        type: DataTypes.STRING,
        allowNull: false,
    },
    amount: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false,
    },
    //category: {
    //    type: DataTypes.STRING,
    //    allowNull: false,
    //    defaultValue: 'uncategorized'
    //},
    methodPayment: {
        type: DataTypes.STRING,
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'],
        allowNull: false,
        defaultValue: "cash"
    },
    date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true,
    },
    isRecurring: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
    },
    recurrenceInterval: {
        type: DataTypes.STRING,
        allowNull: true,
    }
}, {
    sequelize,
    tableName: 'expenses',
    timestamps: true,
});

// Sync the model with the database
// Expense.sync({ alter: true })
//     .then(() => console.log('Expenses table synced'))
//     .catch(err => console.error('Error syncing Expenses table:', err)));

//add associations here if needed
Category.hasMany(Expense, {
    foreignKey: 'categoryId',
    sourceKey: 'idCategory'
});
Expense.belongsTo(Category, {
    foreignKey: 'categoryId',
    targetKey: 'idCategory'
});

// Export the model
export default Expense;