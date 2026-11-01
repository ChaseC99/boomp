export type Pool = 'A' | 'B' | 'C';

export interface Team {
  id: string;
  name: string;
  shortName: string;
  icon:
    | 'ghost'
    | 'pumpkin'
    | 'moon'
    | 'bolt'
    | 'coffee'
    | 'bat'
    | 'sparkles'
    | 'leaf'
    | 'hat';
  color: 'orange' | 'purple' | 'green';
  pool: Pool;
  players: string[];
}

export interface Match {
  id: string;
  stage: 'pool' | 'playoff';
  pool?: Pool;
  round: number;
  time: string;
  court: number;
  homeId: string;
  awayId: string;
  // The four players from each team on court this round.
  homePlayers?: string[];
  awayPlayers?: string[];
  refereeId?: string;
  status: 'scheduled' | 'final';
  score: [number, number] | null;
}

export interface TournamentData {
  mode: 'planning';
  teams: Team[];
  matches: Match[];
}

export const event = {
  name: 'BOOmp, set, spike! 🏐👻',
  date: 'Sunday, November 1, 2026',
  shortDate: 'Sunday, Nov 1',
  time: '12:30pm',
  location: 'Golden Gate Park — Big Rec',
  locationUrl: 'https://maps.app.goo.gl/Z9FG7jFSeixKhUTLA',
  teamCount: 3,
  format: '3 teams · 4v4 games',
} as const;

// Each eight-player team will split into groups of four for individual games.
const teams: Team[] = [
  {
    id: 't1',
    name: 'Team 1',
    shortName: 'Team 1',
    icon: 'pumpkin',
    color: 'orange',
    pool: 'A',
    players: [
      'Alan',
      'Ellie',
      'Ethan',
      'Evan',
      'James',
      'Justin',
      'Leeam',
      'Matthew',
    ],
  },
  {
    id: 't2',
    name: 'Team 2',
    shortName: 'Team 2',
    icon: 'ghost',
    color: 'purple',
    pool: 'A',
    players: [
      'Barney',
      'Bob',
      'Chase',
      'Christi',
      'Fayaz',
      'Harshith',
      'Jasper',
      'Rachel',
    ],
  },
  {
    id: 't3',
    name: 'Team 3',
    shortName: 'Team 3',
    icon: 'hat',
    color: 'green',
    pool: 'A',
    players: [
      'Connor',
      'Dhruvit',
      'Eugene',
      'Jack',
      'Johanan',
      'Kasey',
      'Nathan',
      'Saketh',
    ],
  },
];

// Five rounds. Groups of 4 reshuffle each round; times are not shown yet.
// Evan replaces Jasper from round 1. Team 2's substitutions begin in round 2:
// Jasper replaces Jeff and Harshith replaces Karl; round 1 keeps its lineup.
const draftRounds = [
  [
    ['Ellie James Evan Justin', 'Barney Chase Fayaz Rachel'],
    ['Bob Christi Jeff Karl', 'Dhruvit Jack Kasey Nathan'],
    ['Connor Eugene Johanan Saketh', 'Alan Ethan Leeam Matthew'],
  ],
  [
    ['Ellie Ethan James Leeam', 'Fayaz Jasper Harshith Rachel'],
    ['Barney Bob Chase Christi', 'Connor Jack Johanan Kasey'],
    ['Dhruvit Eugene Nathan Saketh', 'Alan Evan Justin Matthew'],
  ],
  [
    ['Ethan James Evan Matthew', 'Chase Christi Harshith Rachel'],
    ['Barney Bob Fayaz Jasper', 'Dhruvit Eugene Johanan Kasey'],
    ['Connor Jack Nathan Saketh', 'Alan Ellie Justin Leeam'],
  ],
  [
    ['Ellie Ethan Justin Matthew', 'Barney Bob Christi Rachel'],
    ['Chase Fayaz Jasper Harshith', 'Dhruvit Eugene Kasey Saketh'],
    ['Connor Jack Johanan Nathan', 'Alan James Evan Leeam'],
  ],
  [
    ['Alan Ellie Ethan James', 'Bob Chase Jasper Rachel'],
    ['Barney Christi Fayaz Harshith', 'Eugene Jack Johanan Kasey'],
    ['Connor Dhruvit Nathan Saketh', 'Evan Justin Leeam Matthew'],
  ],
];

// Final scores as [home, away], keyed by game: 'r1-c1' is round 1, court 1.
// A game counts toward the standings once its score is added here.
const scores: Record<string, [number, number]> = {
  'r1-c1': [20, 22],
  'r1-c2': [16, 21],
  'r1-c3': [21, 19],
  'r2-c1': [21, 15],
  'r2-c2': [21, 19],
  'r2-c3': [21, 16],
  'r3-c1': [13, 21],
  'r3-c2': [20, 22],
  'r3-c3': [11, 21],
  'r4-c1': [21, 19],
  'r4-c2': [25, 23],
  'r4-c3': [13, 21],
};

const teamIdFor = (players: string[]) =>
  teams.find((team) => team.players.includes(players[0]))?.id ?? '';

const matches: Match[] = draftRounds.flatMap((courts, roundIndex) =>
  courts.map(([home, away], courtIndex) => {
    const homePlayers = home.split(' ');
    const awayPlayers = away.split(' ');
    const id = `r${roundIndex + 1}-c${courtIndex + 1}`;
    const score = scores[id] ?? null;
    return {
      id,
      stage: 'pool',
      round: roundIndex + 1,
      time: '',
      court: courtIndex + 1,
      homeId: teamIdFor(homePlayers),
      awayId: teamIdFor(awayPlayers),
      homePlayers,
      awayPlayers,
      status: score ? 'final' : 'scheduled',
      score,
    };
  }),
);

// Data boundary for a future Supabase adapter. No UI component talks to a database.
export async function getTournamentData(): Promise<TournamentData> {
  return { mode: 'planning', teams, matches };
}
