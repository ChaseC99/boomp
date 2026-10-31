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
    ['Ellie Jasper Justin Leeam', 'Chase Christi Karl Rachel'],
    ['Barney Bob Fayaz Jeff', 'Dhruvit Eugene Jack Johanan'],
    ['Connor Kasey Nathan Saketh', 'Alan Ethan James Matthew'],
  ],
  [
    ['Alan Ethan Jasper Justin', 'Barney Chase Fayaz Rachel'],
    ['Bob Christi Jeff Karl', 'Eugene Jack Kasey Nathan'],
    ['Connor Dhruvit Johanan Saketh', 'Ellie James Leeam Matthew'],
  ],
  [
    ['Alan Jasper Leeam Matthew', 'Barney Bob Karl Rachel'],
    ['Chase Christi Fayaz Jeff', 'Eugene Johanan Kasey Saketh'],
    ['Connor Dhruvit Jack Nathan', 'Ellie Ethan James Justin'],
  ],
  [
    ['Alan Ellie Ethan Leeam', 'Bob Chase Jeff Rachel'],
    ['Barney Christi Fayaz Karl', 'Connor Eugene Jack Saketh'],
    ['Dhruvit Johanan Kasey Nathan', 'James Jasper Justin Matthew'],
  ],
  [
    ['Ethan James Jasper Leeam', 'Barney Bob Chase Christi'],
    ['Fayaz Jeff Karl Rachel', 'Dhruvit Jack Kasey Saketh'],
    ['Connor Eugene Johanan Nathan', 'Alan Ellie Justin Matthew'],
  ],
  [
    ['Alan Ellie James Jasper', 'Bob Chase Fayaz Karl'],
    ['Barney Christi Jeff Rachel', 'Jack Johanan Nathan Saketh'],
    ['Connor Dhruvit Eugene Kasey', 'Ethan Justin Leeam Matthew'],
  ],
  [
    ['Ellie Ethan Jasper Matthew', 'Bob Christi Fayaz Rachel'],
    ['Barney Chase Jeff Karl', 'Dhruvit Eugene Nathan Saketh'],
    ['Connor Jack Johanan Kasey', 'Alan James Justin Leeam'],
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
