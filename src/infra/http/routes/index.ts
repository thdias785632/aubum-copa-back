import { Router } from 'express';
import userRoute from './user.routes';
import stickersRoute from './stickers.routes';
import userStickersRoute from './user-stickers.routes';

const api = Router();

api.use('/api/user', userRoute);
api.use('/api/aubum/stickers', stickersRoute);
api.use('/api/aubum', userStickersRoute);

export default Router().use('', api);
