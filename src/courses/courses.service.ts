import { Injectable, NotFoundException } from '@nestjs/common';
import { Course } from './courses.entity';
import { CreateCourseDTO } from './DTO/create-course.dto';
import { UpdateCourseDTO } from './DTO/update-course.dto';

@Injectable()
export class CoursesService {
  private courses: Course[] = [
    {
      id: 1,
      name: 'Fundamentos do TypeScript',
      description: 'Curso de TypeScript e Node.js',
      tags: ['Node.js', 'TypeScript'],
    },
  ];

  #findById(id: number) {
    return this.courses.findIndex((course) => course.id === id);
  }

  findAll() {
    return this.courses;
  }

  getById(id: number) {
    const course = this.courses.find((course) => course.id === id);

    if (!course) {
      throw new NotFoundException('Course not found');
    }

    return course;
  }

  create(createCourseDTO: CreateCourseDTO) {
    this.courses.push(createCourseDTO);

    return this.courses[this.courses.length - 1];
  }

  update(id: number, updateCourseDTO: UpdateCourseDTO) {
    const courseIndex = this.#findById(id);

    if (courseIndex === -1) {
      throw new NotFoundException('Course not found');
    }

    this.courses[id] = { id, ...this.courses[id], ...updateCourseDTO };

    return this.courses[id];
  }

  delete(id: number) {
    const courseIndex = this.#findById(id);

    if (courseIndex === -1) {
      throw new NotFoundException('Course not found');
    }

    this.courses.splice(courseIndex, 1);
  }
}
