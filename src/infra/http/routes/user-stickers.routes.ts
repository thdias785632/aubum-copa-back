import { Request, Response, Router } from 'express';
import { container } from '../../../app/database-injection/injection';
import { UserStickersUseCase } from '../../../app/usecases/user-stickers/user-stickers.usecase';
import UserStickersController from '../../../presentation/controllers/user-stickers/user-stickers.controller';

const userStickersRoute = Router();

const useCase = container.get<UserStickersUseCase>('UserStickersUseCase');

userStickersRoute.get(
  '/album/:userId',
  async (request: Request, response: Response) => {
    const controller = new UserStickersController(useCase);
    await controller.getAlbum(request, response);
  },
);

userStickersRoute.post(
  '/increment',
  async (request: Request, response: Response) => {
    const controller = new UserStickersController(useCase);
    await controller.increment(request, response);
  },
);

userStickersRoute.post(
  '/decrement',
  async (request: Request, response: Response) => {
    const controller = new UserStickersController(useCase);
    await controller.decrement(request, response);
  },
);

userStickersRoute.get(
  '/repetidas/:userId',
  async (request: Request, response: Response) => {
    const controller = new UserStickersController(useCase);
    await controller.getRepetidas(request, response);
  },
);

userStickersRoute.delete(
  '/reset/:userId',
  async (request: Request, response: Response) => {
    const controller = new UserStickersController(useCase);
    await controller.reset(request, response);
  },
);

export default userStickersRoute;
