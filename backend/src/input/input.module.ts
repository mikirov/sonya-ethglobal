import { Module } from '@nestjs/common';
import { InputController } from './input.controller';

@Module({
    imports: [],
    controllers: [InputController],
    providers: [],
}
)
export class InputModule {}