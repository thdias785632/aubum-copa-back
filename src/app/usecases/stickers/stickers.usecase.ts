import { inject, injectable } from 'inversify';
import StickersUseCaseInterface from '../../@shared/stickers/usecases/stickers.usecase.interface';
import { StickersRepositoryInterface } from '../../@shared/stickers/repository/stickers-repository.interface';
import { StickerDto } from '../../../domain/stickers/dto/sticker.dto';

@injectable()
export class StickersUseCase implements StickersUseCaseInterface {
  constructor(
    @inject('StickersRepository')
    private stickersRepository: StickersRepositoryInterface,
  ) {}

  async findAll(): Promise<StickerDto[]> {
    return this.stickersRepository.findAll();
  }
}
