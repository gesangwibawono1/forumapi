const AddLike = require('../../Domains/likes/entities/AddLike');

class AddLikeUseCase {
  constructor({ threadRepository, commentRepository, likeRepository }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._likeRepository = likeRepository;
  }

  async execute(userId, threadId, commentId) {
    const addLike = new AddLike(userId, commentId);
    await this._threadRepository.checkAvailabilityThread(threadId);
    await this._commentRepository.checkAvailabilityComment(commentId);
    const isLiked = await this._likeRepository.existsByCommentAndOwner(commentId, userId);
    if (isLiked) {
      await this._likeRepository.deleteLikeByCommentIdAndOwner(commentId, userId);
    } else {
      await this._likeRepository.addLike(addLike);
    }
  }
}

module.exports = AddLikeUseCase;
