import { StickersRepositoryInterface } from '../../../../app/@shared/stickers/repository/stickers-repository.interface';
import { StickerDto } from '../../../../domain/stickers/dto/sticker.dto';
import { DatabaseConnection } from '../../database/connection';

export class StickersRepository implements StickersRepositoryInterface {
  database = new DatabaseConnection();

  async findAll(): Promise<StickerDto[]> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `SELECT * FROM aubum_stickers ORDER BY position ASC`,
    );

    await client.end();

    return rows.map(this.mapRow);
  }

  async findById(id: string): Promise<StickerDto | undefined> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `SELECT * FROM aubum_stickers WHERE id = $1`,
      [id],
    );

    await client.end();

    if (rows.length > 0) return this.mapRow(rows[0]);
    return undefined;
  }

  async findByCode(code: string): Promise<StickerDto | undefined> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `SELECT * FROM aubum_stickers WHERE code = $1`,
      [code],
    );

    await client.end();

    if (rows.length > 0) return this.mapRow(rows[0]);
    return undefined;
  }

  async count(): Promise<number> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `SELECT COUNT(*)::int AS total FROM aubum_stickers`,
    );

    await client.end();

    return rows[0]?.total ?? 0;
  }

  async create(sticker: StickerDto): Promise<void> {
    const client = this.database.connect();
    await client.connect();

    await client.query(
      `
      INSERT INTO aubum_stickers
        (id, code, section, team, player_name, position, is_special)
      VALUES ($1,$2,$3,$4,$5,$6,$7)
      ON CONFLICT (code) DO NOTHING
      `,
      [
        sticker.id,
        sticker.code,
        sticker.section,
        sticker.team ?? null,
        sticker.playerName ?? null,
        sticker.position,
        sticker.isSpecial,
      ],
    );

    await client.end();
  }

  async deleteAll(): Promise<void> {
    const client = this.database.connect();
    await client.connect();

    try {
      await client.query('BEGIN');
      // aubum_user_stickers has ON DELETE CASCADE, so user progress is cleared.
      await client.query('DELETE FROM aubum_stickers');
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.end();
    }
  }

  async bulkCreate(stickers: StickerDto[]): Promise<void> {
    if (stickers.length === 0) return;

    const client = this.database.connect();
    await client.connect();

    try {
      await client.query('BEGIN');
      for (const sticker of stickers) {
        await client.query(
          `
          INSERT INTO aubum_stickers
            (id, code, section, team, player_name, position, is_special)
          VALUES ($1,$2,$3,$4,$5,$6,$7)
          ON CONFLICT (code) DO NOTHING
          `,
          [
            sticker.id,
            sticker.code,
            sticker.section,
            sticker.team ?? null,
            sticker.playerName ?? null,
            sticker.position,
            sticker.isSpecial,
          ],
        );
      }
      await client.query('COMMIT');
    } catch (err) {
      await client.query('ROLLBACK');
      throw err;
    } finally {
      await client.end();
    }
  }

  private mapRow(row: any): StickerDto {
    return {
      id: row.id,
      code: row.code,
      section: row.section,
      team: row.team,
      playerName: row.player_name,
      position: row.position,
      isSpecial: row.is_special,
      createdAt: row.created_at,
    };
  }
}

export default StickersRepository;
