import 'reflect-metadata';

import express from 'express';
import cors from 'cors';
import path from 'path';

import { connect } from './database';

connect().then(() => console.log('Database connected successful!'));

const publicPath = path.join(__dirname, '..', 'public');

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.static(publicPath));

export { app };
