import {
  MigrationInterface,
  QueryRunner,
  Table,
  TableForeignKey,
} from 'typeorm';

export class CreateCourseTagTable1725126452726 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.createTable(
      new Table({
        name: 'course_tag',
        columns: [
          {
            name: 'id',
            type: 'uuid',
            isPrimary: true,
            default: 'uuid_generate_v4()',
          },
          {
            name: 'courseId',
            type: 'uuid',
          },
          {
            name: 'tagId',
            type: 'uuid',
          },
          {
            name: 'created_at',
            type: 'timestamp',
            default: 'now()',
          },
          {
            name: 'updated_at',
            type: 'timestamp',
            default: 'now()',
          },
        ],
      }),
    );

    await queryRunner.createForeignKey(
      'course_tag',
      new TableForeignKey({
        name: 'course_tag',
        columnNames: ['courseId'],
        referencedTableName: 'course',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
      }),
    );

    await queryRunner.createForeignKey(
      'course_tag',
      new TableForeignKey({
        name: 'tag_course',
        columnNames: ['tagId'],
        referencedTableName: 'tag',
        referencedColumnNames: ['id'],
        onDelete: 'cascade',
      }),
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.dropForeignKey('course_tag', 'tag_course');
    await queryRunner.dropForeignKey('course_tag', 'course_tag');
    await queryRunner.dropTable('course_tag');
  }
}
