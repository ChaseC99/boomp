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
      'James',
      'Jasper',
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
      'Jeff',
      'Karl',
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
const draftRounds = [
  [
    ['Ellie James Jasper Justin', 'Barney Chase Fayaz Rachel'],
    ['Bob Christi Jeff Karl', 'Dhruvit Jack Kasey Nathan'],
    ['Connor Eugene Johanan Saketh', 'Alan Ethan Leeam Matthew'],
  ],
  [
    ['Ellie Ethan James Leeam', 'Fayaz Jeff Karl Rachel'],
    ['Barney Bob Chase Christi', 'Connor Jack Johanan Kasey'],
    ['Dhruvit Eugene Nathan Saketh', 'Alan Jasper Justin Matthew'],
  ],
  [
    ['Ethan James Jasper Matthew', 'Chase Christi Karl Rachel'],
    ['Barney Bob Fayaz Jeff', 'Dhruvit Eugene Johanan Kasey'],
    ['Connor Jack Nathan Saketh', 'Alan Ellie Justin Leeam'],
  ],
  [
    ['Ellie Ethan Justin Matthew', 'Barney Bob Christi Rachel'],
    ['Chase Fayaz Jeff Karl', 'Dhruvit Eugene Kasey Saketh'],
    ['Connor Jack Johanan Nathan', 'Alan James Jasper Leeam'],
  ],
  [
    ['Alan Ellie Ethan James', 'Bob Chase Jeff Rachel'],
    ['Barney Christi Fayaz Karl', 'Eugene Jack Johanan Kasey'],
    ['Connor Dhruvit Nathan Saketh', 'Jasper Justin Leeam Matthew'],
  ],
];

// Final scores as [home, away], keyed by game: 'r1-c1' is round 1, court 1.
// A game counts toward the standings once its score is added here.
const scores: Record<string, [number, number]> = {};

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
