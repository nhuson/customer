import { Controller, Get } from '@nestjs/common';
import { ApiTags, ApiOperation } from "@nestjs/swagger"

@Controller()
@ApiTags('App')
export class AppController {
  @Get('ping')
  @ApiOperation({ summary: 'Ping/Pong' })
  ping() {
    return 'pong';
  }
}
