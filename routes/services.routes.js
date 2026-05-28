import express from 'express';
import servicesController from '../controllers/services.controller.js';

const router = express.Router();

// Sample service data
const services = [
    { id: 1, name: "Web Development", description: "Building responsive and modern websites." },
    { id: 2, name: "SEO Optimization", description: "Improving website visibility on search engines." },
    { id: 3, name: "Digital Marketing", description: "Promoting brands through digital channels." }
];

router.get("/", servicesController.getAllServices);

router.get("/:id", servicesController.getServiceById);

router.post("/", servicesController.createService);

router.put("/:id", servicesController.updateService);
router.patch("/:id", (req, res) => {
    const service = services.find(s => s.id === parseInt(req.params.id));
    
    if (!service) {
        return res.status(404).json({ message: "Service not found" });
    }
    Object.assign(service, req.body);
    res.json(service);
});

router.delete("/:id", servicesController.deleteService);

export default router;