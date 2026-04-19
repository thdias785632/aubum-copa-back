import 'reflect-metadata';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

import { StickersRepository } from '../infra/api/repositories/stickers/stickers-repository';
import { StickerDto } from '../domain/stickers/dto/sticker.dto';

dotenv.config();

/**
 * Seed do album da Copa do Mundo 2026 (AUbum da Copa).
 * Estrutura (aproximada, baseada nos albuns Panini recentes escalado p/ 48 selecoes):
 *   - 20 figurinhas de introducao (troféu, mascote, cidades-sede...)
 *   - 48 selecoes × 13 figurinhas (escudo + 11 jogadores + especial) = 624
 *   - 26 lendas / especiais finais
 *   Total: 670 figurinhas
 */

const INTRO_TITLES = [
  'Logo FIFA World Cup 26',
  'Trofeu da Copa',
  'Maylynn, Clutch e Zayu - Mascotes',
  'Mapa da Copa 2026',
  'Bola oficial',
  'Host City: Mexico City',
  'Host City: Guadalajara',
  'Host City: Monterrey',
  'Host City: Toronto',
  'Host City: Vancouver',
  'Host City: Atlanta',
  'Host City: Boston',
  'Host City: Dallas',
  'Host City: Houston',
  'Host City: Kansas City',
  'Host City: Los Angeles',
  'Host City: Miami',
  'Host City: New York/New Jersey',
  'Host City: Philadelphia',
  'Host City: Seattle',
];

const TEAMS = [
  'Brasil',
  'Argentina',
  'Canada',
  'Mexico',
  'Estados Unidos',
  'Uruguai',
  'Colombia',
  'Equador',
  'Paraguai',
  'Franca',
  'Inglaterra',
  'Alemanha',
  'Espanha',
  'Portugal',
  'Italia',
  'Belgica',
  'Holanda',
  'Croacia',
  'Suica',
  'Dinamarca',
  'Austria',
  'Polonia',
  'Servia',
  'Noruega',
  'Escocia',
  'Turquia',
  'Japao',
  'Coreia do Sul',
  'Australia',
  'Ira',
  'Arabia Saudita',
  'Catar',
  'Iraque',
  'Uzbequistao',
  'Senegal',
  'Marrocos',
  'Tunisia',
  'Argelia',
  'Egito',
  'Nigeria',
  'Gana',
  'Camaroes',
  'Costa do Marfim',
  'Africa do Sul',
  'Costa Rica',
  'Panama',
  'Jamaica',
  'Nova Zelandia',
];

const TEAM_STICKERS_PER_TEAM = 13;
const LEGENDS_COUNT = 26;

function buildSection(teamIndex: number, team: string): StickerDto[] {
  const section = `Secao ${teamIndex + 1}: ${team}`;
  const stickers: StickerDto[] = [];

  // posicao global: base + offset; a posicao absoluta e ajustada no final.
  for (let i = 0; i < TEAM_STICKERS_PER_TEAM; i++) {
    let playerName: string | null = null;
    let isSpecial = false;
    if (i === 0) {
      playerName = 'Escudo da Selecao';
      isSpecial = true;
    } else if (i === TEAM_STICKERS_PER_TEAM - 1) {
      playerName = 'Craque da Selecao';
      isSpecial = true;
    } else {
      playerName = `Jogador ${i}`;
    }

    stickers.push({
      id: randomUUID(),
      code: '',
      section,
      team,
      playerName,
      position: 0,
      isSpecial,
    });
  }

  return stickers;
}

async function run(): Promise<void> {
  const repo = new StickersRepository();
  const existing = await repo.count();

  if (existing > 0) {
    console.log(
      `Stickers table ja possui ${existing} registros. Pulando seed. Delete os registros para reseedar.`,
    );
    return;
  }

  const all: StickerDto[] = [];

  // Intro
  INTRO_TITLES.forEach((title) => {
    all.push({
      id: randomUUID(),
      code: '',
      section: 'Intro',
      team: null,
      playerName: title,
      position: 0,
      isSpecial: true,
    });
  });

  // Selecoes
  TEAMS.forEach((team, teamIdx) => {
    const stickers = buildSection(teamIdx, team);
    all.push(...stickers);
  });

  // Lendas / Especiais
  for (let i = 0; i < LEGENDS_COUNT; i++) {
    all.push({
      id: randomUUID(),
      code: '',
      section: 'Lendas da Copa',
      team: null,
      playerName: `Lenda ${i + 1}`,
      position: 0,
      isSpecial: true,
    });
  }

  // posiciona globalmente + gera code sequencial
  all.forEach((sticker, idx) => {
    const position = idx + 1;
    const code = String(position).padStart(4, '0');
    sticker.position = position;
    sticker.code = code;
  });

  console.log(`Inserindo ${all.length} figurinhas...`);
  await repo.bulkCreate(all);
  console.log('Seed concluido com sucesso.');
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
