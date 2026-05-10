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
import Service from "../models/service.model.js";
import Product from "../models/product.model.js";

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
        defaultValue: DataTypes.NOW
    },
    method: {
        type: DataTypes.STRING,
        enum: ['cash', 'credit_card', 'debit_card', 'bank_transfer', 'other'],
        defaultValue: "cash",
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

/* Crear la tabla en la base de datos si no existe */
Payment.sync({ force: true }).then(() => {
    console.log("Tabla Payment creada correctamente");
}).catch((error) => {
    console.error("Error al crear la tabla Payment:", error);
});

/* Relaciones con Service y Product */
//Payment.hasMany(Service, {    
//    foreignKey: "serviceId",
//    sourceKey: "idService"
//})
//Service.belongsTo(Payment, {
//    foreignKey: "serviceId",
//    targetKey: "idService"
//});
/*
Payment.hasMany(Product, {    
    foreignKey: "paymentId",
    sourceKey: "idPayment"    
});

Product.belongsTo(Payment, {
    foreignKey: "paymentId",
    targetKey: "idPayment"
});
*/

export default Payment;