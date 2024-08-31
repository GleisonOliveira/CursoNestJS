import { Column, Entity, JoinTable, ManyToMany } from 'typeorm';
import { Tag } from './tags.entity';
import { Entity as EntityBase } from './entity.base';

@Entity('course')
export class Course extends EntityBase {
  @Column()
  name: string;

  @Column()
  description: string;

  @JoinTable({ name: 'course_tag' })
  @ManyToMany(() => Tag, (tag) => tag.courses, { cascade: true })
  tags?: Tag[];
}
