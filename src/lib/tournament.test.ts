import test from 'node:test';
import assert from 'node:assert/strict';
import { event, getTournamentData, type Match } from '../data/tournament.ts';
import { calculateStandings, filterMatches, formatTime } from './tournament.ts';

const { teams, matches } = await getTournamentData();

// Test-only games: the published schedule stays empty until groups are assigned.
const fixture = (overrides: Partial<Match> = {}): Match => ({
  id: 'test-game',
  stage: 'pool',
  pool: 'A',
  round: 1,
  time: '13:00',
  court: 1,
  homeId: 't1',
  awayId: 't2',
  status: 'final',
  score: [21, 15],
  ...overrides,
});

test('the roster has three teams of eight with 24 unique players and no inherited fixtures', () => {
  assert.equal(teams.length, event.teamCount);
  assert.equal(teams.length, 3);
  assert.ok(teams.every((team) => team.players.length === 8));
  assert.equal(new Set(teams.flatMap((team) => team.players)).size, 24);
  assert.equal(matches.length, 0);
});

test('unplayed teams have no results', () => {
  const rows = calculateStandings(teams, matches);
  assert.equal(rows.length, 3);
  assert.ok(
    rows.every(
      (row) => row.played === 0 && row.wins === 0 && row.difference === 0,
    ),
  );
});

test('games on multiple courts accumulate under the parent teams and conserve wins and points', () => {
  const games = [
    fixture(),
    fixture({
      id: 'test-c2',
      court: 2,
      homeId: 't2',
      awayId: 't3',
      score: [21, 18],
    }),
    fixture({
      id: 'test-c3',
      court: 3,
      homeId: 't3',
      awayId: 't1',
      score: [21, 19],
    }),
  ];
  const rows = calculateStandings(teams, games);
  assert.ok(
    rows.every((row) => row.played === 2 && row.wins === 1 && row.losses === 1),
  );
  assert.equal(
    rows.reduce((total, row) => total + row.difference, 0),
    0,
  );
  assert.equal(
    rows.reduce((total, row) => total + row.wins, 0),
    games.length,
  );
  assert.deepEqual(
    rows.map((row) => row.team.id),
    ['t1', 't3', 't2'],
  );
});

test('unplayed, tied, invalid, and playoff scores do not alter pool standings', () => {
  const games = [
    fixture({ status: 'scheduled' }),
    fixture({ score: [21, 21] }),
    fixture({ score: [-1, 21] }),
    fixture({ score: [Number.NaN, 21] }),
    fixture({ stage: 'playoff' }),
    fixture({ score: null }),
  ];
  assert.ok(
    calculateStandings(teams, games).every(
      (row) => row.played === 0 && row.rank === 1,
    ),
  );
});

test('equivalent records share a rank with competition numbering', () => {
  const rows = calculateStandings(teams, [
    fixture(),
    fixture({ homeId: 't3', awayId: 't2' }),
  ]);
  assert.deepEqual(
    rows.map((row) => row.rank),
    [1, 1, 3],
  );
});

test('search supports player names, accents, whitespace, and intersecting team filters', () => {
  const games = [
    fixture({ id: 'one' }),
    fixture({ id: 'two', homeId: 't2', awayId: 't3' }),
  ];
  assert.deepEqual(
    filterMatches(games, teams, '  ALÁN  ', '', 'all').map((match) => match.id),
    ['one'],
  );
  assert.equal(filterMatches(games, teams, 'chase', '', 'pool').length, 2);
  assert.equal(filterMatches(games, teams, 'alan', 't3', 'all').length, 0);
  assert.equal(filterMatches(games, teams, 'saketh', 't2', 'all').length, 1);
  assert.equal(
    filterMatches(games, teams, 'not a player', '', 'all').length,
    0,
  );
  assert.equal(filterMatches(games, teams, '', '', 'playoff').length, 0);
});

test('referee search includes the assigned team without adding unassigned teams', () => {
  assert.equal(
    filterMatches([fixture({ refereeId: 't3' })], teams, 'kasey', '', 'all')
      .length,
    1,
  );
  assert.equal(filterMatches([fixture()], teams, 'kasey', '', 'all').length, 0);
});

test('times format as local tournament times without a browser timezone shift', () => {
  assert.equal(formatTime('13:00'), '1:00 pm');
  assert.equal(formatTime('12:00'), '12:00 pm');
  assert.equal(formatTime('16:00'), '4:00 pm');
});

test('win percentage takes priority over total wins', () => {
  const games = [
    fixture({ homeId: 't1', awayId: 't3' }),
    fixture({ homeId: 't1', awayId: 't3' }),
    fixture({ homeId: 't1', awayId: 't3', score: [15, 21] }),
    fixture({ homeId: 't2', awayId: 't3' }),
  ];
  const rows = calculateStandings(teams, games);
  assert.equal(rows[0].team.id, 't2');
  assert.equal(rows[0].winPercentage, 1);
  assert.equal(rows[1].team.id, 't1');
  assert.equal(rows[1].wins, 2);
});
