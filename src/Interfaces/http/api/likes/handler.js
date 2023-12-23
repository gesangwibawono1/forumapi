const AddLikeUseCase = require('../../../../Applications/use_case/AddLikeUseCase');

class LikeHandler {
  constructor(container) {
    this._container = container;
    this.putLikeHandler = this.putLikeHandler.bind(this);
  }

  async putLikeHandler(request, h) {
    const { id } = request.auth.credentials;
    const { threadId } = request.params;
    const { commentId } = request.params;
    const addLikeUseCase = this._container.getInstance(
      AddLikeUseCase.name,
    );
    await addLikeUseCase.execute(
      id,
      threadId,
      commentId,
    );

    const response = h.response({
      status: 'success',
    });
    response.code(200);
    return response;
  }
}

module.exports = LikeHandler;
