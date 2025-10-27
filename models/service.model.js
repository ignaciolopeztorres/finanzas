// models/Servicio.js
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";
import Payment from "./payments.model.js";

class Service extends Model { }

Service.init({
    idService: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name: {
        type: DataTypes.STRING,
        allowNull: false
    }, // Ej: "Agua", "Energía", "Gas"
    description: {
        type: DataTypes.STRING,
        allowNull: true
    },
    datePayment: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: DataTypes.NOW
    },
    active: {
        type: DataTypes.BOOLEAN,
        defaultValue: true
    }
}, {
    sequelize,
    modelName: "Service"
});

Service.hasOne(Payment, {
    sourceKey: "idService",
    foreignKey: "ServiceId"
})

Payment.belongsTo(Service, {
    sourceKey: "idService",
    foreignKey: "ServiceId"
})

export default Service;
