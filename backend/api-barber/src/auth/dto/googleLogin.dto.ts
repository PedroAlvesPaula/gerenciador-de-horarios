import { IsNotEmpty, IsString } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class GoogleLoginDto {
  @ApiProperty({
    example: 'eyJhbGciOiJSUzI1NiIs...',
    description: 'O ID Token gerado pelo @react-oauth/google no frontend',
  })
  @IsString()
  @IsNotEmpty({ message: 'O token do Google é obrigatório' })
  token!: string;
}
