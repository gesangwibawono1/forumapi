const LikeRepository = require('../../Domains/likes/LikeRepository');

class LikeRepositoryPostgres extends LikeRepository {
  constructor(pool, idGenerator) {
    super();
    this._pool = pool;
    this._idGenerator = idGenerator;
  }

  async existsByCommentAndOwner(commentId, owner) {
    const query = {
      text: 'SELECT 1 FROM likes WHERE comment = $1 AND owner = $2',
      values: [commentId, owner],
    };
    const result = await this._pool.query(query);
    if (result.rows.length) {
      return true;
    }
    return false;
  }

  async addLike(newLike) {
    const id = `like-${this._idGenerator()}`;
    const { commentId, owner } = newLike;

    const query = {
      text: 'INSERT INTO likes (id, comment, owner) VALUES ($1, $2, $3) RETURNING id',
      values: [id, commentId, owner],
    };

    await this._pool.query(query);
  }

  async deleteLikeByCommentIdAndOwner(commentId, owner) {
    const query = {
      text: 'DELETE FROM likes WHERE comment = $1 AND owner = $2 RETURNING id',
      values: [commentId, owner],
    };

    await this._pool.query(query);
  }

  async getLikeCountByCommentIds(commentIds) {
    const query = {
      text: `SELECT
                    comment,
                    COUNT(*)::int AS count
                    FROM likes
                    WHERE comment = ANY($1::text[])
                    GROUP BY comment`,
      values: [commentIds],
    };

    const result = await this._pool.query(query);
    return result.rows;
  }
}

module.exports = LikeRepositoryPostgres;
