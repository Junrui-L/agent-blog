import { IsString, IsOptional, IsInt, Min, Max, IsNotEmpty } from 'class-validator';
import { Type } from 'class-transformer';

export class SearchPostsDto {
  @IsString()
  @IsNotEmpty({ message: '搜索关键词不能为空' })
  q: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  @Type(() => Number)
  limit?: number = 10;
}

export class SearchHighlightDto {
  title: string[];
  content: string[];
}

export class SearchResultDto {
  id: string;
  title: string;
  excerpt: string;
  tags: { id: string; name: string }[];
  author: { id: string; username: string };
  publishedAt: Date | null;
  highlight: SearchHighlightDto;
}