/**
 * models/category.models.js
 * modelo de Categorias
 * - name: nombre de la categoria
 * - description: descripción de la categoria
 */
import { DataTypes, Model } from "sequelize";
import sequelize from "../core/config/sequelize.config.js";

class Category extends Model{}

Category.init({
    idCategory: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    name:{
        type: DataTypes.STRING,
        allowNull: false,
        defaultValue: 'New Category'
    },
    description: {
        type: DataTypes.STRING,
        allowNull: true,
        defaultValue: 'new category description'
    }
},{
    sequelize,
    modelName: 'category'
})

export default Category;