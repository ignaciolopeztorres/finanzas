import User from '../models/user.model.js';

class UserRepository {
  constructor() {
    this.User = User;
  }

  async findAllUsers() {
    return await this.User.findAll();
  }

  async findUserById(id) {
    return await this.User.findByPk(id);
  }

  async findUserByEmail(email) {
    return await this.User.findOne({ where: { email } });
  }

  async createUser(userData) {
    return await this.User.create(userData);
  }

  async updateUser(id, updates) {
    const user = await this.User.findByPk(id);
    if (!user) return null;
    return await user.update(updates);
  }

  async deleteUser(id) {
    const user = await this.User.findByPk(id);
    if (!user) return null;
    await user.destroy();
    return user;
  }
}

export default new UserRepository();
