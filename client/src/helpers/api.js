import axios from 'axios';

const baseURL = 'http://hacktivoverflow-server.cloudeyeglobal.com';

export default axios.create({
  baseURL: `${baseURL}`,
  timeout: 10000,
});
