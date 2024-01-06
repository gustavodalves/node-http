import * as http from 'http'
import * as url from 'url'

import { Route, Server } from "./server";

export class NodeServer implements Server {
    private readonly routes: Route[] = []
    private server: http.Server | null = null

    private async getBody(
        req: http.IncomingMessage
    ): Promise<any> {
        return new Promise((resolve) => {
            let body = {};

            req.on("data", (chunk) => {
                const toJson = JSON.parse(chunk.toString())
                body = {
                    ...body,
                    ...toJson
                }
            });

            req.on("end", () => {
                resolve(body);
            });
        })
    }

    async listen(port: number, callback?: (() => void) | undefined): Promise<void> {
        const server = http.createServer(async (req, res) => {
            const urlObj = url.parse(req.url!, true);

            const {
                pathname,
                query
            } = urlObj;

            const {
                method,
            } = req

            const route = this.routes.find(
                item => item.methods === method && item.url === pathname
            )

            if(!route) {
                res.writeHead(404, {'Content-Type': 'application/json'});
                res.end(JSON.stringify({
                    message: "ROUTE NOT FOUND"
                }));

                return
            }

            let input: any = {
                ...query
            }

            if(route.methods !== 'GET') {
                input = {
                    ...input,
                    ...await this.getBody(req)
                }
            }

            const response = await route.callback(input)

            const type = typeof response.data === "object" ? 'application/json' : 'text/plain'

            res.writeHead(response.status, { 'Content-Type': type})
            res.end(JSON.stringify(response.data));
        });

        return new Promise((resolve) => {
            server.listen(port, () => {

            this.server = server
                if(callback) {
                    callback()
                }
                resolve()
            });
        })
    }

    close(callback?: () => void): void {
        if (this.server) {
          this.server.close(callback);
        }
    }    

    on(route: Route): void {
        this.routes.push(route)
    }
}
