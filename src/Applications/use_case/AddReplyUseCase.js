const AddReply = require('../../Domains/replies/entities/AddReply');
const AddedReply = require('../../Domains/replies/entities/AddedReply');

class AddReplyUseCase {
  constructor({ threadRepository, commentRepository, replyRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
  }

  async execute(userId, threadId, commentId, useCasePayload) {
    const addReply = new AddReply(userId, threadId, commentId, useCasePayload);
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const addedReply = new AddedReply(
      { ...await this._replyRepository.addReply(addReply) },
    );
    return addedReply;
  }
}

module.exports = AddReplyUseCase;
