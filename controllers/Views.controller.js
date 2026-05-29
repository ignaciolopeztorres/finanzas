// controllers/Views.controller.js
import CategoryService from '../services/Category.service.js';

class ViewsController {
    constructor() {}

    /** Renderiza la página principal */
    renderHome(req, res, next) {
        res.render('index', {
            title: 'Inicio'
        });
    }

    dashboard(req, res, next) {
        try {
            res.render('admin/dashboard', {
                title: 'Dashboard'
            })
        } catch (error) {
            console.error("error: ", error);
            res.render('error', {
                title: error.title
            })
        }
    }

    async categories(req, res, next) {
        try {
            const categories = []; // Aquí podrías cargar las categorías desde la base de datos

            categories.push({
                id: 1,
                name: 'Alimentación',
                description: 'Gastos relacionados con comida y restaurantes'
            });
            categories.push({
                id: 2,
                name: 'Transporte',
                description: 'Gastos relacionados con transporte público, gasolina, etc.'
            });
            categories.push({
                id: 3,
                name: 'Entretenimiento',
                description: 'Gastos relacionados con actividades recreativas y ocio'
            });
            /*
            await CategoryService.getCategories().then((data) => {
                data.forEach(category => {
                    categories.push({
                        id: category.id,
                        name: category.name,
                        description: category.description
                    });
                });
            }).catch((err) => {
                console.error("Error fetching categories: ", err);
            });
            */

            const data = await CategoryService.getCategories();
            categories.length = 0; // Limpiar el array antes de llenarlo con los datos de la base de datos
            data.forEach(category => {
                categories.push({
                    id: category.idCategory,
                    name: category.name,
                    description: category.description
                });
            });

            const categoriesJson = JSON.stringify(data);

            res.render('admin/Categories', {
                title: 'Categorias',
                categories: categories,
                categoriesJson: categoriesJson
            })
        } catch (error) {
            console.error("error: ", error);
            res.render('error', {
                title: error.title
            })
        }
    }

    operations(req, res, next) {
        try {
            res.render('admin/Operations', {
                title: 'Operaciones'
            })
        } catch (error) {
            console.error("error: ", error);
            res.render('error', {
                title: error.title
            })
        }
    }

}

export default new ViewsController();