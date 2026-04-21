import { StickerDto } from '../../../../domain/stickers/dto/sticker.dto';

export interface StickersRepositoryInterface {
  findAll(): Promise<StickerDto[]>;
  findById(id: string): Promise<StickerDto | undefined>;
  findByCode(code: string): Promise<StickerDto | undefined>;
  count(): Promise<number>;
  create(sticker: StickerDto): Promise<void>;
  bulkCreate(stickers: StickerDto[]): Promise<void>;
  deleteAll(): Promise<void>;
}
