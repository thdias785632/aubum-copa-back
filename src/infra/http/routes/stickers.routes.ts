import { Request, Response, Router } from 'express';
import { container } from '../../../app/database-injection/injection';
import { StickersUseCase } from '../../../app/usecases/stickers/stickers.usecase';
import StickersController from '../../../presentation/controllers/stickers/stickers.controller';

const stickersRoute = Router();

const useCase = container.get<StickersUseCase>('StickersUseCase');

stickersRoute.get('/', async (request: Request, response: Response) => {
  const controller = new StickersController(useCase);
  await controller.findAll(request, response);
});

export default stickersRoute;
