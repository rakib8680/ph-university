import config from './app/config';
import app from './app';
import mongoose from 'mongoose';
import { Server } from 'http';
import seedSuperAdmin from './app/DB';

let server: Server;

async function main() {
  try {
    await mongoose.connect(config.database_url as string);

    seedSuperAdmin();

    server = app.listen(config.port, () => {
      console.log(` app listening on port ${config.port}`);
    });
  } catch (err) {
    console.error(err);
  }
}

main();

// unhandled Rejection
process.on('unhandledRejection', () => {
  console.log('Unhandled Rejection Shutting Down');

  if (server) {
    server.close(() => {
      process.exit(1);
    });
  } else {
    process.exit(1);
  }
});

// uncaught Exception
process.on('uncaughtException', () => {
  console.log('Uncaught Exception Shutting Down');

  process.exit(1);
});
