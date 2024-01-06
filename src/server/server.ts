import { Methods } from "./methods"
import { StatusCodeEnum } from "./status-code"

export interface Server {
    listen(port: number, callback?: () => void): void
    on(route: Route): void
}

export interface Route {
    url: string
    methods: Methods
    callback: (input: any) => Promise<HttpResponse>
}

export interface HttpResponse<T = any> {
    status: StatusCodeEnum
    data: T
}