const DetailThread = require('../../Domains/threads/entities/DetailThread');
const DetailComment = require('../../Domains/comments/entities/DetailComment');
const DetailReply = require('../../Domains/replies/entities/DetailReply');

class GetThreadUseCase {
  constructor({
    threadRepository, commentRepository, replyRepository, likeRepository,
  }) {
    this._threadRepository = threadRepository;
    this._commentRepository = commentRepository;
    this._replyRepository = replyRepository;
    this._likeRepository = likeRepository;
  }

  async execute(threadId) {
    await this._threadRepository.checkAvailabilityThread(threadId);
    const thread = await this._threadRepository.getThreadById(threadId);
    const comments = await this._commentRepository.getCommentsByThreadId(threadId);
    const replies = await this._replyRepository.getRepliesByCommentIds(comments.map((comment) => comment.id));
    const likeCountByComments = await this._likeRepository.getLikeCountByCommentIds(comments.map((comment) => comment.id));
    const detailCommentList = [];
    for (let i = 0; i < comments.length; i++) {
      const repliesByComment = replies.filter((reply) => comments[i].id === reply.comment);
      const likeCountComment = likeCountByComments.filter((item) => comments[i].id === item.comment)[0];
      const detailReplyList = [];
      for (let j = 0; j < repliesByComment.length; j++) {
        const detailReply = new DetailReply({ ...replies[j] });
        detailReplyList.push(detailReply);
      }
      const detailComment = new DetailComment({ ...comments[i], replies: detailReplyList, likeCount: likeCountComment ? likeCountComment.count : 0 });
      detailCommentList.push(detailComment);
    }
    const detailThread = new DetailThread({ ...thread, comments: detailCommentList });
    return detailThread;
  }
}

module.exports = GetThreadUseCase;
