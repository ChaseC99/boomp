import { useEffect, useState } from 'react';
import type { Match, Team, TournamentData } from '../data/tournament';
import { event } from '../data/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

function MeetingBanner() {
  return (
    <aside className="players-meeting" aria-labelledby="event-start-heading">
      <Icon name="clock" size={22} />
      <div>
        <h2 id="event-start-heading">{event.time} · See you at the park!</h2>
        <p>
          {event.shortDate} ·{' '}
          <a
            className="location-link"
            href={event.locationUrl}
            target="_blank"
            rel="noopener noreferrer"
          >
            {event.location}
          </a>
        </p>
      </div>
    </aside>
  );
}

function CourtSide({
  team,
  players,
  me,
}: {
  team: Team;
  players: string[];
  me: string;
}) {
  return (
    <div className={`court-side ${team.color}`}>
      <TeamBadge team={team} />
      <div>
        <h3>{team.name}</h3>
        <p>
          {players.map((name, index) => (
            <span key={name}>
              {index > 0 && ' · '}
              <span className={name === me ? 'me' : undefined}>{name}</span>
            </span>
          ))}
        </p>
      </div>
    </div>
  );
}

const playersIn = (match: Match) => [
  ...(match.homePlayers ?? []),
  ...(match.awayPlayers ?? []),
];

export default function Schedule({ teams, matches }: TournamentData) {
  const rounds = [...new Set(matches.map((match) => match.round))].sort(
    (a, b) => a - b,
  );
  const [me, setMe] = useState('');
  const [round, setRound] = useState(rounds[0] ?? 1);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const name = params.get('me') ?? '';
    if (teams.some((team) => team.players.includes(name))) setMe(name);
    const picked = Number(params.get('round'));
    if (rounds.includes(picked)) setRound(picked);
    setReady(true);
  }, [teams]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    if (me) url.searchParams.set('me', me);
    else url.searchParams.delete('me');
    url.searchParams.set('round', String(round));
    window.history.replaceState(null, '', url);
  }, [me, round, ready]);

  if (matches.length === 0) {
    return (
      <>
        <MeetingBanner />
        <section className="empty-state">
          <span className="empty-icon">
            <Icon name="ball" size={36} />
          </span>
          <span className="coming-soon">Coming soon</span>
          <h2>The schedule is still brewing</h2>
          <p>4v4 matchups and court times will be posted here later.</p>
          <a className="button" href="/teams/">
            See the teams <Icon name="arrow" size={18} />
          </a>
        </section>
      </>
    );
  }

  const teamById = (id: string) => teams.find((team) => team.id === id);
  const myTeam = teams.find((team) => team.players.includes(me));
  const myCourts = rounds.map((number) => ({
    round: number,
    match: matches.find(
      (match) => match.round === number && playersIn(match).includes(me),
    ),
  }));
  const games = matches
    .filter((match) => match.round === round)
    .sort((a, b) => a.court - b.court);

  return (
    <>
      <section
        className={`info-card find-court ${myTeam?.color ?? ''}`}
        aria-labelledby="find-court"
      >
        <label id="find-court" htmlFor="me-select">
          Find your court
        </label>
        <div className="select-field">
          <select
            id="me-select"
            disabled={!ready}
            value={me}
            onChange={(event) => setMe(event.target.value)}
          >
            <option value="">Pick your name</option>
            {teams.map((team) => (
              <optgroup key={team.id} label={team.name}>
                {team.players.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </optgroup>
            ))}
          </select>
          <Icon name="chevron" size={17} />
        </div>
        {me && (
          <ol className="my-courts" aria-label={`${me}'s courts by round`}>
            {myCourts.map(({ round: number, match }) => (
              <li key={number}>
                <button
                  className={number === round ? 'selected' : ''}
                  aria-pressed={number === round}
                  onClick={() => setRound(number)}
                >
                  <span className="my-round">Round {number}</span>
                  <strong>{match ? `Court ${match.court}` : '–'}</strong>
                </button>
              </li>
            ))}
          </ol>
        )}
      </section>

      <div className="round-picker" role="tablist" aria-label="Rounds">
        {rounds.map((number) => (
          <button
            key={number}
            role="tab"
            aria-selected={number === round}
            className={number === round ? 'selected' : ''}
            onClick={() => setRound(number)}
          >
            Round {number}
          </button>
        ))}
      </div>

      <h2 className="round-title">Round {round}</h2>
      <div className="court-list">
        {games.map((match) => {
          const home = teamById(match.homeId);
          const away = teamById(match.awayId);
          if (!home || !away) return null;
          const mine = Boolean(me) && playersIn(match).includes(me);
          return (
            <article
              className={`court-card ${mine ? `mine ${myTeam?.color}` : ''}`}
              key={match.id}
              aria-label={`Court ${match.court}: ${home.name} versus ${away.name}`}
            >
              <header className="court-header">
                <span className="court-number" aria-hidden="true">
                  {match.court}
                </span>
                <strong>Court {match.court}</strong>
                {mine && <span className="you-here">You're here</span>}
              </header>
              <CourtSide
                team={home}
                players={match.homePlayers ?? home.players}
                me={me}
              />
              <div className="court-vs" aria-hidden="true">
                vs
              </div>
              <CourtSide
                team={away}
                players={match.awayPlayers ?? away.players}
                me={me}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}
