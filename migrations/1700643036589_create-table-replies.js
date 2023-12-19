exports.up = pgm => {
    pgm.createTable('replies', {
        id: {
            type: 'VARCHAR(50)',
            primaryKey: true,
        },
        content: {
            type: 'TEXT',
            notNull: true,
        },
        date: {
            type: 'timestamp',
            notNull: true,
            default: pgm.func('current_timestamp'),
        },
        owner: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        comment: {
            type: 'VARCHAR(50)',
            notNull: true,
        },
        is_delete: {
            type: 'boolean',
            notNull: true,
            default: 'false',
        },
    });

    pgm.addConstraint(
        'replies',
        'replies_owner_fk_users_id',
        'FOREIGN KEY(owner) REFERENCES users(id) ON DELETE CASCADE'
    );
    pgm.addConstraint(
        'replies',
        'replies_comment_fk_comments_id',
        'FOREIGN KEY(comment) REFERENCES comments(id) ON DELETE CASCADE'
    );
};

exports.down = pgm => {
    pgm.dropTable('replies', {
        ifExists: true,
        cascade: true,
    });
};
