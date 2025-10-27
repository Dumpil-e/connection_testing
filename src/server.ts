import express from 'express';
import routes from './api/routes';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use('/api', routes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
