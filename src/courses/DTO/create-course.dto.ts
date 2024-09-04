import { ApiProperty } from '@nestjs/swagger';
import { IsString, Length } from 'class-validator';

export class CreateCourseDTO {
  @ApiProperty({
    required: true,
    minimum: 1,
    maximum: 255,
  })
  @IsString()
  @Length(1, 255)
  readonly name: string;

  @ApiProperty()
  @IsString()
  readonly description: string;

  @ApiProperty()
  @IsString({ each: true })
  readonly tags?: string[];
}
