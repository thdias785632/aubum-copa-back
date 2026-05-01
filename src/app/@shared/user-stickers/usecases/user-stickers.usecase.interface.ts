import {
  AlbumSummaryDto,
  TrocaUserDto,
  UserStickerWithInfoDto,
} from '../../../../domain/user-stickers/dto/user-sticker.dto';

export default interface UserStickersUseCaseInterface {
  getAlbum(userId: string): Promise<AlbumSummaryDto>;
  increment(userId: string, stickerId: string): Promise<UserStickerWithInfoDto>;
  decrement(userId: string, stickerId: string): Promise<UserStickerWithInfoDto>;
  getRepetidas(userId: string): Promise<UserStickerWithInfoDto[]>;
  reset(userId: string): Promise<void>;
  getTrocaUsers(): Promise<TrocaUserDto[]>;
  getTrocaRepetidas(userId: string): Promise<UserStickerWithInfoDto[]>;
}
