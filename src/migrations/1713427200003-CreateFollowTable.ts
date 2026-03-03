import{
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey,
} from 'typeorm';

export class CreateFollowTable1713427200003 implements MigrationInterface{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'follows',
                columns:[
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'followerId',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'followingId',
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
                        name: 'UQ_FOLLOWS_FOLLOWER_FOLLOWING',
                        columnNames: ['followerId', 'followingId'],
                    },
                ],
            }),
            true
        );
        await queryRunner.createIndex(
            'follows',
            new TableIndex({
                name: 'IDX_FOLLOWS_FOLLOWER_ID',
                columnNames: ['followerId'],
             })
        );
        await queryRunner.createIndex(
            'follows',
            new TableIndex({
                name: 'IDX_FOLLOWS_FOLLOWING_ID',
                columnNames: ['followingId'],
             })
        );
        await queryRunner.createForeignKey(
            'follows',
            new TableForeignKey({
                name: 'FK_FOLLOWER_FOLLOWER',
                columnNames: ['followerId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
        await queryRunner.createForeignKey(
            'follows',
            new TableForeignKey({
                name: 'FK_FOLLOWING_FOLLOWING',
                columnNames: ['followingId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('follows');
    }
}