export interface UserStickerDto {
  id: string;
  userId: string;
  stickerId: string;
  quantity: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserStickerWithInfoDto extends UserStickerDto {
  code: string;
  section: string;
  team?: string | null;
  playerName?: string | null;
  position: number;
  isSpecial: boolean;
}

export interface AlbumSectionDto {
  section: string;
  totalStickers: number;
  ownedStickers: number;
  stickers: AlbumStickerDto[];
}

export interface AlbumStickerDto {
  id: string;
  code: string;
  team?: string | null;
  playerName?: string | null;
  position: number;
  isSpecial: boolean;
  quantity: number;
  repetidas: number;
  owned: boolean;
}

export interface AlbumSummaryDto {
  userId: string;
  totalStickers: number;
  ownedStickers: number;
  repetidasTotal: number;
  progressPercent: number;
  sections: AlbumSectionDto[];
}
