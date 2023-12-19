const ThreadRepository = require('../../../Domains/threads/ThreadRepository');
const CommentRepository = require('../../../Domains/comments/CommentRepository');
const ReplyRepository = require('../../../Domains/replies/ReplyRepository');
const AddReply = require('../../../Domains/replies/entities/AddReply');
const AddedReply = require('../../../Domains/replies/entities/AddedReply');
const AddReplyUseCase = require('../AddReplyUseCase');

describe('AddReplyUseCase', () => {
  it('should orchestrating the AddReply Action correctly', async () => {
    const userId = 'user-id_test';
    const threadId = 'thread-id_test';
    const commentId = 'comment-id_test';
    const useCasePayload = {
      content: 'reply content test',
    };

    const expectedAddedReply = new AddedReply({
      id: 'reply-id_test',
      content: useCasePayload.content,
      owner: userId,
    });

    const mockThreadRepository = new ThreadRepository();
    const mockCommentRepository = new CommentRepository();
    const mockReplyRepository = new ReplyRepository();

    mockThreadRepository.checkAvailabilityThread = jest.fn(() => Promise.resolve());
    mockCommentRepository.checkAvailabilityComment = jest.fn(() => Promise.resolve());
    mockReplyRepository.addReply = jest.fn(() => Promise.resolve(
      {
        id: 'reply-id_test',
        content: useCasePayload.content,
        owner: userId,
      },
    ));

    const addReplyUseCase = new AddReplyUseCase({
      threadRepository: mockThreadRepository,
      commentRepository: mockCommentRepository,
      replyRepository: mockReplyRepository,
    });

    const actualAddedReply = await addReplyUseCase.execute(userId, threadId, commentId, useCasePayload);

    expect(actualAddedReply).toStrictEqual(expectedAddedReply);
    expect(mockReplyRepository.addReply).toBeCalledWith(
      new AddReply(userId, threadId, commentId, useCasePayload),
    );
    expect(mockThreadRepository.checkAvailabilityThread).toBeCalledWith(threadId);
    expect(mockCommentRepository.checkAvailabilityComment).toBeCalledWith(commentId);
  });
});
