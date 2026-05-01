import {
  TrocaUserDto,
  UserStickerDto,
  UserStickerWithInfoDto,
} from '../../../../domain/user-stickers/dto/user-sticker.dto';

export interface UserStickersRepositoryInterface {
  findByUserId(userId: string): Promise<UserStickerWithInfoDto[]>;
  findByUserAndSticker(
    userId: string,
    stickerId: string,
  ): Promise<UserStickerDto | undefined>;
  upsert(userSticker: UserStickerDto): Promise<void>;
  resetByUserId(userId: string): Promise<void>;
  findAllUsersWithRepetidas(): Promise<TrocaUserDto[]>;
}
