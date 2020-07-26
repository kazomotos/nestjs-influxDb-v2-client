import { Injectable, Inject } from '@nestjs/common';
import { InfluxDB, FluxTableMetaData, QueryApi, ParameterizedQuery, FluxResultObserver } from '@influxdata/influxdb-client'
import { InfluxModuleOptions } from './interfaces';

@Injectable()
export class InfluxdbV2Service {
    queryApi: QueryApi | null
    connection: InfluxDB | null
    constructor(
        @Inject("INFLUX_DB_OPTIONS")
        private readonly config: InfluxModuleOptions,
        @Inject("INFLUX_DB_ORGANISATION")
        private readonly org: string
    ) {
        this.queryApi = null
        this.connect()
        this.createQueryApi()
    }

    public connect(): void {
        this.connection = new InfluxDB(this.config)
    }

    public createQueryApi(): void {
        this.queryApi = this.connection.getQueryApi(this.org)
    }

    queryRows<T>(query: string | ParameterizedQuery, consumer: FluxResultObserver<string[]>): void {
        this.queryApi.queryRows(query, consumer)
    }

    collectRows<T>(query: string | ParameterizedQuery, rowMapper?: (values: string[], tableMeta: FluxTableMetaData) => T | undefined): Promise<Array<T>>{
        return this.queryApi.collectRows(query, rowMapper)
    }

    collectLines(query: string | ParameterizedQuery): Promise<Array<string>>{
        return this.queryApi.collectLines(query)
    }
}
