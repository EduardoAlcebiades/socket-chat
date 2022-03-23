import { injectable } from 'tsyringe';
import { ICreateUserDTO } from '../dtos/ICreateUserDTO';
import { User } from '../schemas/User';

@injectable()
class CreateUserService {
  async execute({ name, email, socket_id, avatar }: ICreateUserDTO) {
    const userAlreadyExists = await User.findOne({ email }).exec();

    if (userAlreadyExists) {
      const user = await User.findOneAndUpdate(
        { _id: userAlreadyExists._id },
        { $set: { name, socket_id, avatar } },
        { $new: true }
      );

      return user;
    }

    const user = await User.create({
      name,
      email,
      socket_id,
      avatar,
    });

    return user;
  }
}

export { CreateUserService };
