import { StickerDto } from '../../../../domain/stickers/dto/sticker.dto';

export default interface StickersUseCaseInterface {
  findAll(): Promise<StickerDto[]>;
}
