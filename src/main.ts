import { Methods } from "./server/methods";
import { NodeServer } from "./server/node-server";
import { StatusCodeEnum } from "./server/status-code";

const server = new NodeServer()

server.on({
    url: '/',
    methods: Methods.POST,
    callback: async (input) => {
        return {
            data: input,
            status: StatusCodeEnum.OK
        }
    }
})

server.listen(3000)
