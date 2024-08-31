import { Column, Entity, ManyToMany } from 'typeorm';
import { Course } from './courses.entity';
import { Entity as EntityBase } from './entity.base';

@Entity('tag')
export class Tag extends EntityBase {
  @Column()
  name: string;

  @ManyToMany(() => Course, (course) => course.tags)
  courses: Course[];
}
