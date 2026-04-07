import 'reflect-metadata';
import express from 'express';
import router from './routes/index.js';
import { errorHandlerMiddleware } from './middleware/errorHandlerMiddleware.js';
import cors from 'cors';

const PORT = 5002;
const app = express();

const corsAllowedOrigins = process.env.CORS_ALLOWED_ORIGINS
	?.split(',')
	.map((origin) => origin.trim())
	.filter(Boolean);

app.use(
	cors({
		origin: (origin, callback) => {
			if (!origin) {
				return callback(null, true);
			}

			if (!corsAllowedOrigins?.length || corsAllowedOrigins.includes(origin)) {
				return callback(null, true);
			}

			return callback(new Error(`Origin not allowed by CORS: ${origin}`));
		},
		credentials: true,
	}),
);

app.use(express.json());
app.use(router);

app.use((req, res) => {
	res.status(404).json({
		status: 404,
		error: 'Not Found',
		message: 'A rota que você tentou acessar não existe.',
	});
});

app.use(errorHandlerMiddleware);

app.listen(PORT, () => {
	console.log(`Server is running on port http://localhost:${PORT}`);
});
