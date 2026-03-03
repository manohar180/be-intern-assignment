import{
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey,
} from 'typeorm';

export class CreateHashtagTable1713427200004 implements MigrationInterface{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'hashtags',
                columns:[
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'name',
                        type: 'varchar',
                        length: '255',
                        isUnique: true,
                        isNullable: false,
                    },
                    {
                        name: 'createdAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                    {
                        name: 'updatedAt',
                        type: 'datetime',
                        default: 'CURRENT_TIMESTAMP',
                    },
                ],
            }),
            true
        );
        await queryRunner.createIndex(
            'hashtags',
            new TableIndex({
                name: 'IDX_HASHTAG_NAME',
                columnNames: ['name'],
            })
        );
        await queryRunner.createTable(
            new Table({
                name: 'post_hashtags',
                columns:[
                    {
                        name: 'postId',
                        type: 'integer',
                        isNullable: false,
                    },
                    {
                        name: 'hashtagId',
                        type: 'integer',
                        isNullable: false,
                    },
                ],
                uniques:[
                    {
                        name: 'UQ_POST_HASHTAG',
                        columnNames: ['postId', 'hashtagId'],
                    },
                ],
            }),
            true
        );
        await queryRunner.createIndex(
            'post_hashtags',
            new TableIndex({
                name: 'IDX_POST_HASHTAG_POST_ID',
                columnNames: ['postId'],
            })
        );
        await queryRunner.createIndex(
            'post_hashtags',
            new TableIndex({
                name: 'IDX_POST_HASHTAG_HASHTAG_ID',
                columnNames: ['hashtagId'],
            })
        );
        await queryRunner.createForeignKey(
            'post_hashtags',
            new TableForeignKey({
                name: 'FK_POST_HASHTAG_POST',
                columnNames: ['postId'],
                referencedTableName: 'posts',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
        await queryRunner.createForeignKey(
            'post_hashtags',
            new TableForeignKey({
                name: 'FK_POST_HASHTAG_HASHTAG',
                columnNames: ['hashtagId'],
                referencedTableName: 'hashtags',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }
    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('post_hashtags');
        await queryRunner.dropTable('hashtags');
    }
}