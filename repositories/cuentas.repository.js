import Cuenta from '../models/cuentas.model.js';

class CuentasRepository {
    constructor() {
        this.Cuenta = Cuenta;
    }

    async create(data) {
        return await this.Cuenta.create(data);
    }

    async findById(id) {
        return await this.Cuenta.findById(id);
    }

    async findAll() {
        return await this.Cuenta.findAll();
    }

    async update(id, data) {
        return await this.Cuenta.update({ _id: id }, data);
    }

    async delete(id) {
        return await this.Cuenta.delete({ _id: id });
    }
}

export default new CuentasRepository();