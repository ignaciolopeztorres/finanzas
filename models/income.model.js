//ingresos
/**
 * Modelo de ingresos
 * - amount: Monto
 * - source: furnte de ingreso
 * - recivedAt: fecha de recibo
 * - notes: notas adicionales
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";
import Category from "./Category.models.js";

class Income extends Model { }

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
    }
}, {
    timestamps: true,
    sequelize,
    modelName: "Income"
});

Category.hasMany(Income, { foreignKey: 'categoryId', sourceKey: 'idCategory', as: 'incomes' });
Income.belongsTo(Category, { foreignKey: 'categoryId', targetKey: 'idCategory', as: 'category' });

export default Income;
