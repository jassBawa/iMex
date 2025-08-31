import { Router } from 'express';
import authRouter from './auth.route';
import candlesRouter from './candles.route';
import ordersRouter from './order.route';

const router = Router();

router.use('/auth', authRouter);
router.use('/candles', candlesRouter);
router.use('/order', ordersRouter);

export default router;
