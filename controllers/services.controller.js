import Service from '../models/service.model.js';

class ServicesController {
    constructor() { }

    // Obtener todos los servicios
    async getAllServices(req, res) {
        try {
            const services = await Service.findAll();
            if (services.length === 0) {
                return res.status(404).json({ message: 'No se encontraron servicios' });
            }
            res.json({services: services.length, data: services});
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener servicios', error });
        }
    }


    // Obtener un servicio por ID
    async getServiceById(req, res) {
        try {
            const service = await Service.findOne({ where: { idService: req.params.id } });
            if (!service) {
                return res.status(404).json({ message: 'Servicio no encontrado' });
            }
            res.json(service);
        } catch (error) {
            res.status(500).json({ message: 'Error al obtener el servicio', error });
        }
    };

    // Crear un nuevo servicio
    async createService(req, res) {
        try {
            const { name, description } = req.body;
            const newService = await Service.create({ name, description });
            res.status(201).json(newService);
        } catch (error) {
            res.status(400).json({ message: 'Error al crear el servicio', error });
        }
    };

    // Actualizar un servicio
    async updateService(req, res) {
        try {
            const updatedService = await Service.update(req.body, { where: { idService: req.params.id }, returning: true });
            if (!updatedService[1] || updatedService[1].length === 0) {
                return res.status(404).json({ message: 'Servicio no encontrado' });
            }
            res.status(200).json({ message: 'Servicio actualizado correctamente', service: updatedService[1][0] });
        } catch (error) {
            res.status(400).json({ message: 'Error al actualizar el servicio', error });
        }
    };

    // Eliminar un servicio
    async deleteService(req, res) {
        try {
            const { id } = req.params;
            const deletedService = await Service.destroy({ where: { idService: id } });
            if (!deletedService) {
                return res.status(404).json({ message: 'Servicio no encontrado' });
            }
            res.json({ message: 'Servicio eliminado correctamente' });
        } catch (error) {
            res.status(500).json({ message: 'Error al eliminar el servicio', error });
        }
    } 
};

export default new ServicesController();