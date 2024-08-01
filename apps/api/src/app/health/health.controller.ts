import { Controller, Get } from '@nestjs/common';
import { HealthCheck, HealthCheckService, HttpHealthIndicator } from '@nestjs/terminus';
import { HealthConfig } from './health.config';
import { ApiTags } from '@nestjs/swagger';

@ApiTags(HealthConfig.featureName)
@Controller(HealthConfig.apiRoute)
export class HealthController {
    constructor(
        private health: HealthCheckService,
        private http: HttpHealthIndicator
    ) {}

    @Get()
    @HealthCheck()
    check() {
        return this.health.check([
            () => this.http.pingCheck('nestjs-docs', 'https://docs.nestjs.com')
        ]);
    }
}
