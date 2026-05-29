//ingresos
/**
 * Modelo de ingresos
 * - amount: Monto
 * - source: furnte de ingreso
 * - recivedAt: fecha de recibo
 * - notes: notas adicionales
 */
import {
    DataTypes,
    Model
} from "sequelize";
import sequelize from "../core/config/sequelize.config.js";
import Category from "./Category.model.js";

class Income extends Model {}

Income.init({
    idIncome: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    amount: {
        type: DataTypes.FLOAT,
        allowNull: false
    },
    source: {
        type: DataTypes.STRING,
        allowNull: false
    },
    receivedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    notes: {
        type: DataTypes.STRING,
        allowNull: true
    },
    CategoryId: {
        type: DataTypes.UUID,
        allowNull: true,
        references: {
            model: Category,
            key: 'idCategory'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
    }
}, {
    timestamps: true,
    sequelize,
    modelName: "Income"
});

Category.hasMany(Income, {
    foreignKey: 'CategoryId',
    sourceKey: 'idCategory',
    as: 'incomes'
});
Income.belongsTo(Category, {
    foreignKey: 'CategoryId',
    targetKey: 'idCategory',
    as: 'category'
});

export default Income;