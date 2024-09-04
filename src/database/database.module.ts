import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Course } from 'src/courses/entities/courses.entity';
import { Tag } from 'src/courses/entities/tags.entity';
import { DataSourceOptions } from 'typeorm';

export const entities = [Course, Tag];

@Module({
  imports: [
    TypeOrmModule.forRootAsync({
      useFactory: async (): Promise<DataSourceOptions> => {
        return {
          type: 'postgres',
          host: process.env.TYPEORM_HOST!,
          port: Number(process.env.TYPEORM_PORT!),
          username: process.env.TYPEORM_USERNAME!,
          password: process.env.TYPEORM_PASSWORD!,
          database: process.env.TYPEORM_DATABASE!,
          entities: entities,
          synchronize: false,
        };
      },
    }),
  ],
})
export class DatabaseModule {}
