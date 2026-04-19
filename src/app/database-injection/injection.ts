import { Container } from 'inversify';
import 'reflect-metadata';

import { DatabaseConnection } from '../../infra/api/database/connection';
import { IDatabaseConnection } from '../@shared/database/database.interface';

import { UserRepository } from '../../infra/api/repositories/users/user-repository';
import { UserRepositoryInterface } from '../@shared/users/repository/user-repository.interface';
import UserUseCaseInterface from '../@shared/users/usecases/user.usecase.interface';
import { UserUseCase } from '../usecases/users/user.usecase';

import { StickersRepository } from '../../infra/api/repositories/stickers/stickers-repository';
import { StickersRepositoryInterface } from '../@shared/stickers/repository/stickers-repository.interface';
import StickersUseCaseInterface from '../@shared/stickers/usecases/stickers.usecase.interface';
import { StickersUseCase } from '../usecases/stickers/stickers.usecase';

import { UserStickersRepository } from '../../infra/api/repositories/user-stickers/user-stickers-repository';
import { UserStickersRepositoryInterface } from '../@shared/user-stickers/repository/user-stickers-repository.interface';
import UserStickersUseCaseInterface from '../@shared/user-stickers/usecases/user-stickers.usecase.interface';
import { UserStickersUseCase } from '../usecases/user-stickers/user-stickers.usecase';

const container = new Container();

container
  .bind<IDatabaseConnection>('IDatabaseConnection')
  .to(DatabaseConnection)
  .inSingletonScope();

container
  .bind<UserRepositoryInterface>('UserRepository')
  .to(UserRepository)
  .inSingletonScope();
container
  .bind<UserUseCaseInterface>('UserUseCase')
  .to(UserUseCase)
  .inSingletonScope();

container
  .bind<StickersRepositoryInterface>('StickersRepository')
  .to(StickersRepository)
  .inSingletonScope();
container
  .bind<StickersUseCaseInterface>('StickersUseCase')
  .to(StickersUseCase)
  .inSingletonScope();

container
  .bind<UserStickersRepositoryInterface>('UserStickersRepository')
  .to(UserStickersRepository)
  .inSingletonScope();
container
  .bind<UserStickersUseCaseInterface>('UserStickersUseCase')
  .to(UserStickersUseCase)
  .inSingletonScope();

export { container };
