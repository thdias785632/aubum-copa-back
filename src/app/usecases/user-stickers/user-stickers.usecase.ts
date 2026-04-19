import { inject, injectable } from 'inversify';
import { randomUUID } from 'crypto';
import UserStickersUseCaseInterface from '../../@shared/user-stickers/usecases/user-stickers.usecase.interface';
import { UserStickersRepositoryInterface } from '../../@shared/user-stickers/repository/user-stickers-repository.interface';
import { StickersRepositoryInterface } from '../../@shared/stickers/repository/stickers-repository.interface';
import {
  AlbumSectionDto,
  AlbumStickerDto,
  AlbumSummaryDto,
  UserStickerWithInfoDto,
} from '../../../domain/user-stickers/dto/user-sticker.dto';

@injectable()
export class UserStickersUseCase implements UserStickersUseCaseInterface {
  constructor(
    @inject('UserStickersRepository')
    private userStickersRepository: UserStickersRepositoryInterface,
    @inject('StickersRepository')
    private stickersRepository: StickersRepositoryInterface,
  ) {}

  async getAlbum(userId: string): Promise<AlbumSummaryDto> {
    const [allStickers, userStickers] = await Promise.all([
      this.stickersRepository.findAll(),
      this.userStickersRepository.findByUserId(userId),
    ]);

    const userMap = new Map<string, UserStickerWithInfoDto>();
    for (const us of userStickers) {
      userMap.set(us.stickerId, us);
    }

    const sectionMap = new Map<string, AlbumSectionDto>();

    let ownedTotal = 0;
    let repetidasTotal = 0;

    for (const sticker of allStickers) {
      const us = userMap.get(sticker.id);
      const quantity = us?.quantity ?? 0;
      const owned = quantity > 0;
      const repetidas = quantity > 1 ? quantity - 1 : 0;

      if (owned) ownedTotal += 1;
      repetidasTotal += repetidas;

      const albumSticker: AlbumStickerDto = {
        id: sticker.id,
        code: sticker.code,
        team: sticker.team,
        playerName: sticker.playerName,
        position: sticker.position,
        isSpecial: sticker.isSpecial,
        quantity,
        repetidas,
        owned,
      };

      let section = sectionMap.get(sticker.section);
      if (!section) {
        section = {
          section: sticker.section,
          totalStickers: 0,
          ownedStickers: 0,
          stickers: [],
        };
        sectionMap.set(sticker.section, section);
      }

      section.totalStickers += 1;
      if (owned) section.ownedStickers += 1;
      section.stickers.push(albumSticker);
    }

    const sections = Array.from(sectionMap.values());
    for (const section of sections) {
      section.stickers.sort((a, b) => a.position - b.position);
    }
    sections.sort(
      (a, b) => (a.stickers[0]?.position ?? 0) - (b.stickers[0]?.position ?? 0),
    );

    const totalStickers = allStickers.length;
    const progressPercent =
      totalStickers > 0
        ? Math.round((ownedTotal / totalStickers) * 1000) / 10
        : 0;

    return {
      userId,
      totalStickers,
      ownedStickers: ownedTotal,
      repetidasTotal,
      progressPercent,
      sections,
    };
  }

  async increment(
    userId: string,
    stickerId: string,
  ): Promise<UserStickerWithInfoDto> {
    const sticker = await this.stickersRepository.findById(stickerId);
    if (!sticker) {
      throw new Error('Sticker not found');
    }

    const existing = await this.userStickersRepository.findByUserAndSticker(
      userId,
      stickerId,
    );

    const newQuantity = (existing?.quantity ?? 0) + 1;

    await this.userStickersRepository.upsert({
      id: existing?.id ?? randomUUID(),
      userId,
      stickerId,
      quantity: newQuantity,
    });

    return {
      id: existing?.id ?? '',
      userId,
      stickerId,
      quantity: newQuantity,
      code: sticker.code,
      section: sticker.section,
      team: sticker.team,
      playerName: sticker.playerName,
      position: sticker.position,
      isSpecial: sticker.isSpecial,
    };
  }

  async decrement(
    userId: string,
    stickerId: string,
  ): Promise<UserStickerWithInfoDto> {
    const sticker = await this.stickersRepository.findById(stickerId);
    if (!sticker) {
      throw new Error('Sticker not found');
    }

    const existing = await this.userStickersRepository.findByUserAndSticker(
      userId,
      stickerId,
    );

    const newQuantity = Math.max((existing?.quantity ?? 0) - 1, 0);

    await this.userStickersRepository.upsert({
      id: existing?.id ?? randomUUID(),
      userId,
      stickerId,
      quantity: newQuantity,
    });

    return {
      id: existing?.id ?? '',
      userId,
      stickerId,
      quantity: newQuantity,
      code: sticker.code,
      section: sticker.section,
      team: sticker.team,
      playerName: sticker.playerName,
      position: sticker.position,
      isSpecial: sticker.isSpecial,
    };
  }

  async getRepetidas(userId: string): Promise<UserStickerWithInfoDto[]> {
    const all = await this.userStickersRepository.findByUserId(userId);
    return all
      .filter((item) => item.quantity > 1)
      .sort((a, b) => a.position - b.position);
  }

  async reset(userId: string): Promise<void> {
    await this.userStickersRepository.resetByUserId(userId);
  }
}
