const AddThread = require('../../Domains/threads/entities/AddThread');
const AddedThread = require('../../Domains/threads/entities/AddedThread');

class AddThreadUseCase {
  constructor({ threadRepository }) {
    this._threadRepository = threadRepository;
  }

  async execute(userId, useCasePayload) {
    const addThread = new AddThread(userId, useCasePayload);
    const addedThread = new AddedThread(
      { ...await this._threadRepository.addThread(addThread) },
    );
    return addedThread;
  }
}

module.exports = AddThreadUseCase;
