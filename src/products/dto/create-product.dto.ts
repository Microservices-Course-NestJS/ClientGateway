import { Type } from "class-transformer";
import { IsNumber, IsString, Min, MinLength } from "class-validator";

export class CreateProductDto {


    @IsString()
    @MinLength(3)
    public name: string;

    @Type(() => Number)
    @IsNumber({
        maxDecimalPlaces: 4,
    })
    @Min(0)
    public price: number;

}
