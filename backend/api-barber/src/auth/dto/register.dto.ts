import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  Matches,
  MinLength,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class RegisterDto {
  @ApiProperty({
    example: 'Pedro Admin',
    description: 'O nome completo do usuário',
  })
  @IsString()
  @IsNotEmpty({ message: 'O nome é obrigatório' })
  name!: string;

  @ApiPropertyOptional({
    example: '31999999999',
    description: 'O celular do usuário, contendo DDD e apenas números',
  })
  @IsOptional()
  @IsString()
  @Matches(/^\d{10,11}$/, { message: 'Formato de celular inválido' })
  phone?: string;

  @ApiProperty({
    example: 'pedro@barbearia.com',
    description: 'O endereço de e-mail (deve ser único no sistema)',
  })
  @IsEmail({}, { message: 'Formato de e-mail inválido' })
  @IsNotEmpty({ message: 'O e-mail é obrigatório' })
  email!: string;

  @ApiProperty({
    example: 'senha-segura-123',
    description: 'A senha para o novo cadastro',
    minLength: 6,
  })
  @IsString()
  @MinLength(6, { message: 'A senha deve ter no mínimo 6 caracteres' })
  @IsNotEmpty({ message: 'A senha é obrigatória' })
  password!: string;
}
