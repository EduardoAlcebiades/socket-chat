import 'dotenv/config';

import { server } from './socket';

const port = process.env.APP_PORT || 3333;

server.listen(port, () => {
  console.log('Server started successful!');
});
