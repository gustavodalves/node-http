import axios from 'axios';
import { NodeServer } from './node-server';
import { StatusCodeEnum } from './status-code';
import { Methods } from './methods';

describe('NodeServer', () => {
  let server: NodeServer;
  const PORT = 8080;
  const BASE_URL = `http://localhost:${PORT}`;

  beforeAll(async () => {
    server = new NodeServer();

    await server.listen(PORT);
  });

  afterAll(() => {
    server.close()
  })

  it('should handle GET requests', async () => {
    const responseData = { message: 'Hello, World!' };
    const route = { methods: Methods.GET, url: '/', callback: async () => ({ status: StatusCodeEnum.OK, data: responseData }) };
    server.on(route);

    const response = await axios.get(`${BASE_URL}/`);

    expect(response.status).toBe(StatusCodeEnum.OK);
    expect(response.data).toEqual(responseData);
  });

  it('should handle POST requests', async () => {
    const requestData = { input: 'test' };
    const responseData = { result: 'success' };
    const route = {
      methods: Methods.POST,
      url: '/post',
      callback: async (input: any) => ({ status: StatusCodeEnum.OK, data: { ...input, ...responseData } }),
    };
    server.on(route);

    const response = await axios.post(`${BASE_URL}/post`, requestData);

    expect(response.status).toBe(StatusCodeEnum.OK);
    expect(response.data).toEqual({ ...requestData, ...responseData });
  });
});
