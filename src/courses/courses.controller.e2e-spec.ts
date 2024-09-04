import { Test, TestingModule } from '@nestjs/testing';
import { config } from 'dotenv';
import { INestApplication } from '@nestjs/common';
import { Course } from './entities/courses.entity';
import { CoursesModule } from './courses.module';
import { TypeOrmModule } from '@nestjs/typeorm';
import { dataSourceTest } from 'src/database/test-config';
import { DataSource, DataSourceOptions } from 'typeorm';
import request from 'supertest';

config();

describe('It test CoursesController e2e', () => {
  let module: TestingModule;
  let app: INestApplication;
  let data: any;
  let courses: Course[];

  beforeAll(async () => {
    module = await Test.createTestingModule({
      imports: [
        CoursesModule,
        TypeOrmModule.forRootAsync({
          useFactory: async (): Promise<DataSourceOptions> => {
            return {
              ...dataSourceTest,
            } as DataSourceOptions;
          },
        }),
      ],
    }).compile();

    data = {
      name: 'Course 1',
      description: 'Description 1',
      tags: ['tag1', 'tag2'],
    };

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    const dataSource = await new DataSource({
      ...dataSourceTest,
    } as DataSourceOptions).initialize();
    const repository = dataSource.getRepository(Course);

    courses = await repository.find();

    await dataSource.destroy();
  });

  afterAll(async () => {
    await module.close();
  });

  function expects(dataResponse, course?: Course) {
    expect(dataResponse.name).toBeDefined();
    expect(dataResponse.description).toBeDefined();
    expect(dataResponse.name).toEqual(course ?? data.name);
    expect(dataResponse.description).toEqual(course ?? data.description);
    expect(dataResponse.tags.length).toEqual(course ?? data.tags.length);
    expect(data.tags).toContain(dataResponse.tags[0].name);
    expect(data.tags).toContain(dataResponse.tags[1].name);
  }

  it('Should create a course', async () => {
    const response = await request(app.getHttpServer())
      .post('/courses')
      .send(data)
      .expect(201);

    const {
      body: { data: dataResponse },
    } = response;

    expects(dataResponse);
  });

  it('Should list all courses', async () => {
    const response = await request(app.getHttpServer())
      .get('/courses')
      .expect(200);

    const {
      body: { data: dataResponse },
    } = response;

    expects(dataResponse[0]);
  });

  it('Should get a course', async () => {
    const response = await request(app.getHttpServer())
      .get(`/courses/${courses[0].id}`)
      .expect(200);

    const {
      body: { data: dataResponse },
    } = response;

    expects(dataResponse);
  });

  it('Should update a course', async () => {
    const dataToUpdate = {
      name: 'Course updated',
      description: 'Description updated',
      tags: ['updated1', 'updated2'],
    };

    const response = await request(app.getHttpServer())
      .put(`/courses/${courses[0].id}`)
      .send(dataToUpdate)
      .expect(200);

    const {
      body: { data: dataResponse },
    } = response;

    expect(dataResponse.name).toEqual(dataToUpdate.name);
    expect(dataResponse.description).toEqual(dataToUpdate.description);
    expect(dataResponse.tags.length).toEqual(dataToUpdate.tags.length);
    expect(dataToUpdate.tags).toContain(dataResponse.tags[0].name);
    expect(dataToUpdate.tags).toContain(dataResponse.tags[1].name);
  });

  it('Should delete a course', async () => {
    const id = courses[0].id;

    await request(app.getHttpServer()).delete(`/courses/${id}`).expect(204);
  });
});
