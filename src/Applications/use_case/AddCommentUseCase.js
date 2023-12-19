const AddComment = require('../../Domains/comments/entities/AddComment');
const AddedComment = require('../../Domains/comments/entities/AddedComment');

class AddCommentUseCase {
  constructor({ threadRepository, commentRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
  }

  async execute(userId, threadId, useCasePayload) {
    const addComment = new AddComment(userId, threadId, useCasePayload);
    await this._threadRepository.checkAvailabilityThread(threadId);
    const addedComment = new AddedComment(
      { ...await this._commentRepository.addComment(addComment) },
    );
    return addedComment;
  }
}

module.exports = AddCommentUseCase;
