const LikeRepository = require('../LikeRepository');

describe('Like Repository interface', () => {
  it('should throw error when invoke abstract behavior', async () => {
    // Arrange
    const likeRepository = new LikeRepository();

    // Action and Assert
    await expect(likeRepository.existsByCommentAndOwner('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.addLike({})).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.deleteLikeByCommentIdAndOwner('', '')).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
    await expect(likeRepository.getLikeCountByCommentIds([''])).rejects.toThrowError('LIKE_REPOSITORY.METHOD_NOT_IMPLEMENTED');
  });
});
