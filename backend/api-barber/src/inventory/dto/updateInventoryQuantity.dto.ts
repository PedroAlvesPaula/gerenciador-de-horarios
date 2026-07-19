import { ApiProperty } from '@nestjs/swagger';
import { IsInt, Max, Min, NotEquals } from 'class-validator';

export class UpdateInventoryQuantityDto {
  @ApiProperty({
    example: -1,
    description: 'Variação atômica da quantidade atual',
    minimum: -1_000,
    maximum: 1_000,
  })
  @IsInt({ message: 'A variação da quantidade deve ser um número inteiro' })
  @Min(-1_000, { message: 'A redução máxima por operação é 1000' })
  @Max(1_000, { message: 'O aumento máximo por operação é 1000' })
  @NotEquals(0, { message: 'A variação da quantidade não pode ser zero' })
  delta!: number;
}
