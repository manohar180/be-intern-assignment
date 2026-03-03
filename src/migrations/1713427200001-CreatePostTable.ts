import{
    MigrationInterface,
    QueryRunner,
    Table,
    TableIndex,
    TableForeignKey,
  } from 'typeorm';

export class CreatePostTable1713427200001 implements MigrationInterface{
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: 'posts',
                columns:[
                    {
                        name: 'id',
                        type: 'integer',
                        isPrimary: true,
                        isGenerated: true,
                        generationStrategy: 'increment',
                    },
                    {
                        name: 'content',
                        type: 'text',
                        isNullable: false,
                    },
                    {
                        name: 'userId',
                        type: 'integer',
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
            'posts',
            new TableIndex({
                name: 'IDX_POST_USER_ID',
                columnNames: ['userId'],
            })
        );
        await queryRunner.createForeignKey(
            'posts',
            new TableForeignKey({
                name: 'FK_POST_USER',
                columnNames: ['userId'],
                referencedTableName: 'users',
                referencedColumnNames: ['id'],
                onDelete: 'CASCADE',
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('posts');
    }
}