import { ApiProperty } from "@nestjs/swagger";

export class TtsResponseDto {

    @ApiProperty({
        description: 'Audio response from the agent, base64 encoded.',
        example: 'data:audio/wav;base64,UklGRvYAAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgA...',
    })
    audio: string;
}