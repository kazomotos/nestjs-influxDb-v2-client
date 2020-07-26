import { DynamicModule, Module, Global } from "@nestjs/common";
import { InfluxModuleOptions } from "./interfaces";
import { InfluxdbV2Service } from './influxdb-v2.service';
import { InfluxdbV2Controller } from './influxdb-v2.controller';


@Global()
@Module({
  controllers: []
})
export class InfluxdbV2Module {
    static forRoot(options: InfluxModuleOptions, org: string): DynamicModule {
        return {
            module: InfluxdbV2Module,
            providers: [
                {
                    provide: "INFLUX_DB_OPTIONS",
                    useValue: options
                },
                {
                    provide: "INFLUX_DB_ORGANISATION",
                    useValue: org
                },
                InfluxdbV2Service
            ],
            exports: [InfluxdbV2Service]
        };
    }
}
