import express from 'express';
import switchRoutes from './api/networkDevices/switch/index';
import { errorHandler } from './middlewares/errorHandler';

const app = express();
app.use(express.json());
app.use('/api/switch', switchRoutes);
app.use(errorHandler);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});