/** models/product.model.js
 * Modelo de Proudcto
 * - name: Nombre del producto
 * - description: descripción del producto
 * - price: Precio del producto
 * - quantity: cantidad
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";
import Payment from "../models/payments.model.js";

class Product extends Model{}

Product.init({
    idProduct: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    price: {
        type: DataTypes.DECIMAL(10, 2),
        allowNull: false
    },
    quantity: {
        type: DataTypes.INTEGER,
        defaultValue: 0
    }
}, {
    sequelize,
    modelName: "Product"
});

Payment.hasOne(Product, {
    sourceKey: "idProduct",
    foreignKey: "productId"
})

Product.belongsTo(Payment,{
    sourceKey:"IdProducto",
    foreignKey: "productId"
})

export default Product;