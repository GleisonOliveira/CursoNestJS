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
import { CreateCourseDTO } from './DTO/create-course.dto';
import { UpdateCourseDTO } from './DTO/update-course.dto';

@Controller('courses')
export class CoursesController {
  constructor(private readonly couserService: CoursesService) {}

  @Get()
  findAll(@Res() response: Response) {
    return response.status(200).json({ data: this.couserService.findAll() });
  }

  @Get(':id')
  getById(@Param('id') id: number, @Res() response: Response) {
    return response.status(200).json({ data: this.couserService.getById(id) });
  }

  @Post()
  create(@Body() createCourseDTO: CreateCourseDTO, @Res() response: Response) {
    return response
      .status(201)
      .json({ data: this.couserService.create(createCourseDTO) });
  }

  @Put(':id')
  update(
    @Param('id') id: number,
    @Body() updateCourseDTO: UpdateCourseDTO,
    @Res() response: Response,
  ) {
    return response
      .status(200)
      .json({ data: this.couserService.update(id, updateCourseDTO) });
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  delete(@Param('id') id: number) {
    this.couserService.delete(id);
  }
}
