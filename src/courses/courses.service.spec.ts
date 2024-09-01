import { Test, TestingModule } from '@nestjs/testing';
import { CoursesService } from './courses.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Course } from './entities/courses.entity';
import { Repository } from 'typeorm';
import { Tag } from './entities/tags.entity';
import { MockType } from 'test/mockType';
import { randomUUID } from 'crypto';
import { NotFoundException } from '@nestjs/common';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';

describe('Test CoursesService behaviour', () => {
  let service: CoursesService;
  let courseRepository: MockType<Repository<Course>>;
  let tagRepository: MockType<Repository<Tag>>;

  const uuid = randomUUID();
  const tag: Tag = {
    id: uuid,
    name: 'tag',
    created_at: new Date(),
    updated_at: new Date(),
    generateId: () => {},
    courses: [],
  };

  const createCourseDTO: CreateCourseDTO = {
    name: 'Title',
    description: 'Description',
    tags: ['tag'],
  };

  const updateCourseDTO: UpdateCourseDTO = {
    name: 'Title',
    description: 'Description',
    tags: ['tag'],
  };

  const course: Course = {
    id: uuid,
    name: 'Title',
    description: 'Description',
    tags: [tag],
    created_at: new Date(),
    updated_at: new Date(),
    generateId: () => {},
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        CoursesService,
        {
          provide: getRepositoryToken(Course),
          useFactory: jest.fn(() => ({
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
            remove: jest.fn(),
            preload: jest.fn(),
          })),
        },
        {
          provide: getRepositoryToken(Tag),
          useFactory: jest.fn(() => ({
            findOne: jest.fn(),
            create: jest.fn(),
          })),
        },
      ],
    }).compile();

    service = module.get<CoursesService>(CoursesService);
    courseRepository = module.get(getRepositoryToken(Course));
    tagRepository = module.get(getRepositoryToken(Tag));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('should list all courses', async () => {
    courseRepository.find.mockReturnValue([course]);

    const result = await service.findAll();

    expect(result).toEqual([course]);
    expect(courseRepository.find).toHaveBeenCalledTimes(1);
  });

  it('should return a course', async () => {
    courseRepository.findOne.mockReturnValue(course);

    const result = await service.getById(uuid);

    expect(result).toEqual(course);
    expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('should throw exception when course is not founded', async () => {
    courseRepository.findOne.mockReturnValue(null);

    await expect(() => service.getById(uuid)).rejects.toThrow(
      NotFoundException,
    );
    expect(courseRepository.findOne).toHaveBeenCalledTimes(1);
  });

  it('should create a new course and create tags', async () => {
    tagRepository.create.mockReturnValue(tag);

    courseRepository.create.mockReturnValue(course);
    courseRepository.save.mockReturnValue(course);

    const result = await service.create(createCourseDTO);

    expect(result).toEqual(course);

    expect(tagRepository.create).toHaveBeenCalledTimes(1);

    expect(courseRepository.create).toHaveBeenCalledWith({
      ...createCourseDTO,
      tags: [tag],
    });
  });

  it('should create a new course but not create tags if exists', async () => {
    tagRepository.findOne.mockReturnValue(tag);

    courseRepository.create.mockReturnValue(course);
    courseRepository.save.mockReturnValue(course);

    const result = await service.create(createCourseDTO);

    expect(result).toEqual(course);

    expect(tagRepository.create).toHaveBeenCalledTimes(0);

    expect(courseRepository.create).toHaveBeenCalledWith({
      ...createCourseDTO,
      tags: [tag],
    });
  });

  it('should delete a course', async () => {
    courseRepository.findOne.mockReturnValue(course);

    await service.delete(uuid);

    expect(courseRepository.remove).toHaveBeenCalledTimes(1);
  });

  it('should throw exception on delete when course is not founded', async () => {
    courseRepository.findOne.mockReturnValue(null);

    await expect(() => service.delete(uuid)).rejects.toThrow(NotFoundException);
    expect(courseRepository.remove).toHaveBeenCalledTimes(0);
  });

  it('should throw exception on update when course is not founded', async () => {
    courseRepository.preload.mockReturnValue(null);

    await expect(() => service.update(uuid, updateCourseDTO)).rejects.toThrow(
      NotFoundException,
    );

    expect(courseRepository.save).toHaveBeenCalledTimes(0);
  });

  it('should update a course and create tags', async () => {
    tagRepository.create.mockReturnValue(tag);

    courseRepository.preload.mockReturnValue(course);
    courseRepository.save.mockReturnValue(course);

    const result = await service.update(uuid, updateCourseDTO);

    expect(result).toEqual(course);

    expect(tagRepository.create).toHaveBeenCalledTimes(1);

    expect(courseRepository.preload).toHaveBeenCalledWith({
      ...updateCourseDTO,
      tags: [tag],
      id: uuid,
    });
  });

  it('should update a course but not create tags if exists', async () => {
    tagRepository.findOne.mockReturnValue(tag);

    courseRepository.preload.mockReturnValue(course);
    courseRepository.save.mockReturnValue(course);

    const result = await service.update(uuid, updateCourseDTO);

    expect(result).toEqual(course);

    expect(tagRepository.create).toHaveBeenCalledTimes(0);

    expect(courseRepository.preload).toHaveBeenCalledWith({
      ...updateCourseDTO,
      tags: [tag],
      id: uuid,
    });
  });
});
