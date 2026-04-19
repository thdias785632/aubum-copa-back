export interface StickerDto {
  id: string;
  code: string;
  section: string;
  team?: string | null;
  playerName?: string | null;
  position: number;
  isSpecial: boolean;
  createdAt?: Date;
}
