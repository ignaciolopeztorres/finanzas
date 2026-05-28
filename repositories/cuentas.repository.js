import Cuenta from '../models/cuentas.model.js';

class CuentasRepository {
    constructor() {
        this.Cuenta = Cuenta;
    }

    async create(data) {
        return await this.Cuenta.create(data);
    }

    async findById(id) {
        return await this.Cuenta.findOne({ where: { idCuentaUsuario: id } });
    }

    async findAll() {
        return await this.Cuenta.findAll();
    }

    async update(id, data) {
        return await this.Cuenta.update(data, { where: { idCuentaUsuario: id } });
    }

    async delete(id) {
        return await this.Cuenta.destroy({ where: { idCuentaUsuario: id } });
    }

    async findByfield(field, value) {
        return await this.Cuenta.findOne({ where: { [field]: value } });
    }
}

export default new CuentasRepository();