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

// Draft rounds for previewing the schedule layout. Groups of 4 reshuffle each
// round; times and the final round count are not decided yet.
const draftRounds = [
  [
    ['James Justin Leeam Matthew', 'Barney Fayaz Jeff Rachel'],
    ['Bob Chase Christi Karl', 'Connor Eugene Johanan Kasey'],
    ['Dhruvit Jack Nathan Saketh', 'Alan Ellie Ethan Jasper'],
  ],
  [
    ['Alan Ellie Justin Matthew', 'Barney Bob Chase Fayaz'],
    ['Christi Jeff Karl Rachel', 'Connor Dhruvit Jack Nathan'],
    ['Eugene Johanan Kasey Saketh', 'Ethan James Jasper Leeam'],
  ],
  [
    ['Ellie Ethan Justin Leeam', 'Bob Christi Karl Rachel'],
    ['Barney Chase Fayaz Jeff', 'Jack Kasey Nathan Saketh'],
    ['Connor Dhruvit Eugene Johanan', 'Alan James Jasper Matthew'],
  ],
  [
    ['Alan Ellie Jasper Leeam', 'Chase Christi Fayaz Jeff'],
    ['Barney Bob Karl Rachel', 'Eugene Jack Johanan Nathan'],
    ['Connor Dhruvit Kasey Saketh', 'Ethan James Justin Matthew'],
  ],
  [
    ['Alan Ethan Leeam Matthew', 'Chase Fayaz Karl Rachel'],
    ['Barney Bob Christi Jeff', 'Dhruvit Eugene Kasey Nathan'],
    ['Connor Jack Johanan Saketh', 'Ellie James Jasper Justin'],
  ],
  [
    ['Alan Jasper Justin Leeam', 'Barney Chase Christi Rachel'],
    ['Bob Fayaz Jeff Karl', 'Connor Eugene Nathan Saketh'],
    ['Dhruvit Jack Johanan Kasey', 'Ellie Ethan James Matthew'],
  ],
  [
    ['Alan Ellie James Leeam', 'Bob Chase Jeff Rachel'],
    ['Barney Christi Fayaz Karl', 'Connor Johanan Kasey Nathan'],
    ['Dhruvit Eugene Jack Saketh', 'Ethan Jasper Justin Matthew'],
  ],
];

const teamIdFor = (players: string[]) =>
  teams.find((team) => team.players.includes(players[0]))?.id ?? '';

const matches: Match[] = draftRounds.flatMap((courts, roundIndex) =>
  courts.map(([home, away], courtIndex) => {
    const homePlayers = home.split(' ');
    const awayPlayers = away.split(' ');
    return {
      id: `r${roundIndex + 1}-c${courtIndex + 1}`,
      stage: 'pool',
      round: roundIndex + 1,
      time: '',
      court: courtIndex + 1,
      homeId: teamIdFor(homePlayers),
      awayId: teamIdFor(awayPlayers),
      homePlayers,
      awayPlayers,
      status: 'scheduled',
      score: null,
    };
  }),
);

// Data boundary for a future Supabase adapter. No UI component talks to a database.
export async function getTournamentData(): Promise<TournamentData> {
  return { mode: 'planning', teams, matches };
}
