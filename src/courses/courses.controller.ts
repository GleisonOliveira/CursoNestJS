import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Put,
  Res,
} from '@nestjs/common';
import { Response } from 'express';
import { CoursesService } from './courses.service';
import { CreateCourseDTO } from './dto/create-course.dto';
import { UpdateCourseDTO } from './dto/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly couserService: CoursesService) {}

  @Get()
  async findAll(@Res() response: Response) {
    const data = await this.couserService.findAll();

    return response.status(200).json({ data });
  }

  @Get(':id')
  async getById(@Param('id') id: string, @Res() response: Response) {
    const data = await this.couserService.getById(id);

    return response.status(200).json({ data });
  }

  @Post()
  async create(
    @Body() createCourseDTO: CreateCourseDTO,
    @Res() response: Response,
  ) {
    const data = await this.couserService.create(createCourseDTO);

    return response.status(201).json({ data });
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCourseDTO: UpdateCourseDTO,
    @Res() response: Response,
  ) {
    const data = await this.couserService.update(id, updateCourseDTO);

    return response.status(200).json({ data });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  async delete(@Param('id') id: string) {
    await this.couserService.delete(id);
  }
}
