import { IsInt, IsString } from 'class-validator';

export class CreateCourseDTO {
  @IsInt()
  readonly id: number;

  @IsString()
  readonly name: string;

  @IsString()
  readonly description: string;

  @IsString({ each: true })
  readonly tags?: string[];
}
