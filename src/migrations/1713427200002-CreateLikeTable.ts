import{
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey,
} from 'typeorm';

export class CreateLikeTable1713427200002 implements MigrationInterface{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'likes',
                columns:[
                    {
                    name: 'id',
                    type: 'integer',
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment',
                },
                {
                    name: 'userId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'postId',
                    type: 'integer',
                    isNullable: false,
                },
                {
                    name: 'createdAt',
                    type: 'datetime',
                    default: 'CURRENT_TIMESTAMP',
                },
            ],
            uniques: [
                {
                    name: 'UQ_LIKES_USER_POST',
                    columnNames: ['userId', 'postId'],
                },
            ],
            }),
            true
        );
        await queryRunner.createIndex(
            'likes',
            new TableIndex({
                name: 'IDX_LIKES_USER_ID',
                columnNames: ['userId'],
            })
        );
        await queryRunner.createIndex(
            'likes',
            new TableIndex({
                name: 'IDX_LIKES_POST_ID',
                columnNames: ['postId'],
            })
        );
        await queryRunner.createForeignKey(
            'likes',
            new TableForeignKey({
                name: 'FK_LIKES_USER',
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
        await queryRunner.createForeignKey(
            'likes',
            new TableForeignKey({
                name: 'FK_LIKES_POST',
                columnNames: ['postId'],
                referencedTableName: 'posts',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('likes');
    }
}
