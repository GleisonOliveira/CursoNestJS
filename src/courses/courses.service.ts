import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Tag } from './entities/tags.entity';

@Injectable()
export class CoursesService {
  private readonly relations = ['tags'];

  constructor(
    @InjectRepository(Course)
    private readonly coursesRepository: Repository<Course>,
    @InjectRepository(Tag) private readonly tagsRepository: Repository<Tag>,
  ) {}

  private async findById(id: string) {
    return await this.coursesRepository.findOne({
      where: { id },
      relations: this.relations,
    });
  }

  async findAll() {
    return await this.coursesRepository.find({
      relations: this.relations,
      order: {
        id: {
          direction: 'ASC',
        },
      },
    });
  }

  async getById(id: string) {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  async create({ tags, ...createCourseDTO }: CreateCourseDTO) {
    const course = this.coursesRepository.create({
      ...createCourseDTO,
      tags: await this.processTags(tags),
    });

    return await this.coursesRepository.save(course);
  }

  async update(id: string, { tags, ...updateCourseDTO }: UpdateCourseDTO) {
    const course = await this.coursesRepository.preload({
      ...updateCourseDTO,
      tags: await this.processTags(tags),
      id,
    });

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.coursesRepository.save(course);
  }

  async delete(id: string) {
    const course = await this.findById(id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return await this.coursesRepository.remove(course);
  }

  private async preloadTagByName(name: string): Promise<Tag> {
    const tag = await this.tagsRepository.findOne({
      where: { name },
    });

    if (tag) {
      return tag;
    }
    return this.tagsRepository.create({ name });
  }

  private async processTags(tags?: string[]): Promise<Tag[]> {
    return (
      tags && (await Promise.all(tags.map((tag) => this.preloadTagByName(tag))))
    );
  }
}
