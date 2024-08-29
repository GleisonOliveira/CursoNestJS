import { Module } from '@nestjs/common';
import { CoursesController } from './courses.controller';
import { CoursesService } from './courses.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { entities } from 'src/database/database.module';

@Module({
  imports: [TypeOrmModule.forFeature(entities)],
  controllers: [CoursesController],
  providers: [CoursesService],
})
export class CoursesModule {}
