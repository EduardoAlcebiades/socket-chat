import { injectable } from 'tsyringe';
import { User } from '../schemas/User';

@injectable()
class GetAllUsersService {
  async execute() {
    const users = User.find();

    return users;
  }
}

export { GetAllUsersService };
