import { IsString, IsOptional, IsUUID } from 'class-validator';

export class CreateCommentDto {
  @IsUUID()
  postId: string;

  @IsOptional()
  @IsUUID()
  parentId?: string;

  @IsString()
  content: string;
}

export class UpdateCommentDto {
  @IsString()
  content: string;
}