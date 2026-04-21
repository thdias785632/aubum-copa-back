import 'reflect-metadata';
import { randomUUID } from 'crypto';
import dotenv from 'dotenv';

import { StickersRepository } from '../infra/api/repositories/stickers/stickers-repository';
import { StickerDto } from '../domain/stickers/dto/sticker.dto';

dotenv.config();

/**
 * Seed do AUbum da Copa 2026 - catalogo oficial.
 *
 * Estrutura:
 *   - 12 Grupos (A-L), cada um com 4 selecoes x 20 figurinhas = 960 (grupo)
 *   - Serie Especial:
 *       - FIFA World Cup History: FWC00..FWC19 (20 figurinhas, padding 2)
 *       - Coca-Cola: CC1..CC14 (14 figurinhas)
 *   Total: 994 figurinhas
 *
 * Codigos seguem o padrao oficial: {ABREV}{N}
 *   ex: MEX1..MEX20, BRA1..BRA20, FWC00..FWC19, CC1..CC14
 */

const STICKERS_PER_TEAM = 20;
const FWC_START = 0;
const FWC_END = 19;
const FWC_PAD = 2;
const CC_START = 1;
const CC_END = 14;

interface TeamEntry {
  code: string;
  name: string;
}

interface GroupEntry {
  letter: string;
  teams: TeamEntry[];
}

const GROUPS: GroupEntry[] = [
  {
    letter: 'A',
    teams: [
      { code: 'MEX', name: 'Mexico' },
      { code: 'RSA', name: 'Africa do Sul' },
      { code: 'KOR', name: 'Coreia do Sul' },
      { code: 'CZE', name: 'Republica Tcheca' },
    ],
  },
  {
    letter: 'B',
    teams: [
      { code: 'CAN', name: 'Canada' },
      { code: 'BIH', name: 'Bosnia e Herzegovina' },
      { code: 'QAT', name: 'Catar' },
      { code: 'SUI', name: 'Suica' },
    ],
  },
  {
    letter: 'C',
    teams: [
      { code: 'BRA', name: 'Brasil' },
      { code: 'MAR', name: 'Marrocos' },
      { code: 'HAI', name: 'Haiti' },
      { code: 'SCO', name: 'Escocia' },
    ],
  },
  {
    letter: 'D',
    teams: [
      { code: 'USA', name: 'Estados Unidos' },
      { code: 'PAR', name: 'Paraguai' },
      { code: 'AUS', name: 'Australia' },
      { code: 'TUR', name: 'Turquia' },
    ],
  },
  {
    letter: 'E',
    teams: [
      { code: 'GER', name: 'Alemanha' },
      { code: 'CUW', name: 'Curacao' },
      { code: 'CIV', name: 'Costa do Marfim' },
      { code: 'ECU', name: 'Equador' },
    ],
  },
  {
    letter: 'F',
    teams: [
      { code: 'NED', name: 'Holanda' },
      { code: 'JPN', name: 'Japao' },
      { code: 'SWE', name: 'Suecia' },
      { code: 'TUN', name: 'Tunisia' },
    ],
  },
  {
    letter: 'G',
    teams: [
      { code: 'BEL', name: 'Belgica' },
      { code: 'EGY', name: 'Egito' },
      { code: 'IRN', name: 'Ira' },
      { code: 'NZL', name: 'Nova Zelandia' },
    ],
  },
  {
    letter: 'H',
    teams: [
      { code: 'ESP', name: 'Espanha' },
      { code: 'CPV', name: 'Cabo Verde' },
      { code: 'KSA', name: 'Arabia Saudita' },
      { code: 'URU', name: 'Uruguai' },
    ],
  },
  {
    letter: 'I',
    teams: [
      { code: 'FRA', name: 'Franca' },
      { code: 'SEN', name: 'Senegal' },
      { code: 'IRQ', name: 'Iraque' },
      { code: 'NOR', name: 'Noruega' },
    ],
  },
  {
    letter: 'J',
    teams: [
      { code: 'ARG', name: 'Argentina' },
      { code: 'ALG', name: 'Argelia' },
      { code: 'AUT', name: 'Austria' },
      { code: 'JOR', name: 'Jordania' },
    ],
  },
  {
    letter: 'K',
    teams: [
      { code: 'POR', name: 'Portugal' },
      { code: 'COD', name: 'Congo' },
      { code: 'UZB', name: 'Uzbequistao' },
      { code: 'COL', name: 'Colombia' },
    ],
  },
  {
    letter: 'L',
    teams: [
      { code: 'ENG', name: 'Inglaterra' },
      { code: 'CRO', name: 'Croacia' },
      { code: 'GHA', name: 'Gana' },
      { code: 'PAN', name: 'Panama' },
    ],
  },
];

const FWC_SECTION = 'Serie Especial - FIFA World Cup History';
const CC_SECTION = 'Serie Especial - Coca-Cola';

function buildTeamStickers(groupLetter: string, team: TeamEntry): StickerDto[] {
  const section = `Grupo ${groupLetter}`;
  const stickers: StickerDto[] = [];

  for (let i = 1; i <= STICKERS_PER_TEAM; i++) {
    const isEscudo = i === 1;
    const playerName = isEscudo ? 'Escudo da Selecao' : `Figurinha ${i}`;

    stickers.push({
      id: randomUUID(),
      code: `${team.code}${i}`,
      section,
      team: team.name,
      playerName,
      position: 0,
      isSpecial: isEscudo,
    });
  }

  return stickers;
}

function buildAllStickers(): StickerDto[] {
  const all: StickerDto[] = [];

  // Grupos A-L
  GROUPS.forEach((group) => {
    group.teams.forEach((team) => {
      all.push(...buildTeamStickers(group.letter, team));
    });
  });

  // Serie Especial - FIFA World Cup History (FWC00..FWC19, padding 2)
  for (let n = FWC_START; n <= FWC_END; n++) {
    const suffix = String(n).padStart(FWC_PAD, '0');
    all.push({
      id: randomUUID(),
      code: `FWC${suffix}`,
      section: FWC_SECTION,
      team: null,
      playerName: `FIFA World Cup History #${suffix}`,
      position: 0,
      isSpecial: true,
    });
  }

  // Serie Especial - Coca-Cola
  for (let n = CC_START; n <= CC_END; n++) {
    all.push({
      id: randomUUID(),
      code: `CC${n}`,
      section: CC_SECTION,
      team: null,
      playerName: `Coca-Cola #${n}`,
      position: 0,
      isSpecial: true,
    });
  }

  // Atribui position sequencial global respeitando a ordem do catalogo.
  all.forEach((sticker, idx) => {
    sticker.position = idx + 1;
  });

  return all;
}

async function run(): Promise<void> {
  const repo = new StickersRepository();
  const expected = buildAllStickers();
  const existing = await repo.count();

  if (existing === expected.length) {
    console.log(
      `Catalogo ja populado com ${existing} figurinhas. Nada a fazer.`,
    );
    return;
  }

  if (existing > 0) {
    console.log(
      `Catalogo existente (${existing}) diferente do esperado (${expected.length}). Reseedando.`,
    );
    await repo.deleteAll();
  }

  console.log(`Inserindo ${expected.length} figurinhas...`);
  await repo.bulkCreate(expected);
  console.log('Seed concluido com sucesso.');
}

run()
  .then(() => process.exit(0))
  .catch((err) => {
    console.error(err);
    process.exit(1);
  });
