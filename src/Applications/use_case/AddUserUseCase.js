const RegisterUser = require('../../Domains/users/entities/RegisterUser');
const RegisteredUser = require('../../Domains/users/entities/RegisteredUser');

class AddUserUseCase {
  constructor({ userRepository, passwordHash }) {
    this._userRepository = userRepository;
    this._passwordHash = passwordHash;
  }

  async execute(useCasePayload) {
    const registerUser = new RegisterUser(useCasePayload);
    await this._userRepository.verifyAvailableUsername(registerUser.username);
    registerUser.password = await this._passwordHash.hash(registerUser.password);
    const registeredUser = new RegisteredUser(
      { ...await this._userRepository.addUser(registerUser) },
    );
    return registeredUser;
  }
}

module.exports = AddUserUseCase;
