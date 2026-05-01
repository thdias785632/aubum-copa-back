import { UserStickersRepositoryInterface } from '../../../../app/@shared/user-stickers/repository/user-stickers-repository.interface';
import {
  TrocaUserDto,
  UserStickerDto,
  UserStickerWithInfoDto,
} from '../../../../domain/user-stickers/dto/user-sticker.dto';
import { DatabaseConnection } from '../../database/connection';

export class UserStickersRepository implements UserStickersRepositoryInterface {
  database = new DatabaseConnection();

  async findByUserId(userId: string): Promise<UserStickerWithInfoDto[]> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `
      SELECT
        us.id,
        us.user_id,
        us.sticker_id,
        us.quantity,
        us.created_at,
        us.updated_at,
        s.code,
        s.section,
        s.team,
        s.player_name,
        s.position,
        s.is_special
      FROM aubum_user_stickers us
      INNER JOIN aubum_stickers s ON s.id = us.sticker_id
      WHERE us.user_id = $1
      `,
      [userId],
    );

    await client.end();

    return rows.map((row: any) => ({
      id: row.id,
      userId: row.user_id,
      stickerId: row.sticker_id,
      quantity: row.quantity,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      code: row.code,
      section: row.section,
      team: row.team,
      playerName: row.player_name,
      position: row.position,
      isSpecial: row.is_special,
    }));
  }

  async findByUserAndSticker(
    userId: string,
    stickerId: string,
  ): Promise<UserStickerDto | undefined> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `
      SELECT * FROM aubum_user_stickers
      WHERE user_id = $1 AND sticker_id = $2
      `,
      [userId, stickerId],
    );

    await client.end();

    if (rows.length > 0) {
      return {
        id: rows[0].id,
        userId: rows[0].user_id,
        stickerId: rows[0].sticker_id,
        quantity: rows[0].quantity,
        createdAt: rows[0].created_at,
        updatedAt: rows[0].updated_at,
      };
    }

    return undefined;
  }

  async upsert(userSticker: UserStickerDto): Promise<void> {
    const client = this.database.connect();
    await client.connect();

    await client.query(
      `
      INSERT INTO aubum_user_stickers (id, user_id, sticker_id, quantity, created_at, updated_at)
      VALUES ($1, $2, $3, $4, now(), now())
      ON CONFLICT (user_id, sticker_id)
      DO UPDATE SET quantity = EXCLUDED.quantity, updated_at = now()
      `,
      [
        userSticker.id,
        userSticker.userId,
        userSticker.stickerId,
        userSticker.quantity,
      ],
    );

    await client.end();
  }

  async resetByUserId(userId: string): Promise<void> {
    const client = this.database.connect();
    await client.connect();

    await client.query(`DELETE FROM aubum_user_stickers WHERE user_id = $1`, [
      userId,
    ]);

    await client.end();
  }

  async findAllUsersWithRepetidas(): Promise<TrocaUserDto[]> {
    const client = this.database.connect();
    await client.connect();

    const { rows } = await client.query(
      `
      SELECT
        u.id AS user_id,
        u.name AS user_name,
        COALESCE(SUM(us.quantity - 1), 0)::int AS repetidas_count
      FROM users u
      INNER JOIN aubum_user_stickers us ON us.user_id = u.id
      WHERE us.quantity > 1
      GROUP BY u.id, u.name
      ORDER BY repetidas_count DESC
      `,
    );

    await client.end();

    return rows.map((row: any) => ({
      userId: row.user_id,
      userName: row.user_name,
      repetidasCount: row.repetidas_count,
    }));
  }
}

export default UserStickersRepository;
