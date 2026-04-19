import { Request, Response, Router } from 'express';
import { container } from '../../../app/database-injection/injection';
import { UserUseCase } from '../../../app/usecases/users/user.usecase';
import UserController from '../../../presentation/controllers/users/user.controller';

const userRoute = Router();

const useCase = container.get<UserUseCase>('UserUseCase');

userRoute.post('/create', async (request: Request, response: Response) => {
  const controller = new UserController(useCase);
  await controller.create(request, response);
});

userRoute.post('/login', async (request: Request, response: Response) => {
  const controller = new UserController(useCase);
  await controller.login(request, response);
});

export default userRoute;
