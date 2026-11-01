import { Fragment, useEffect, useState, type ReactNode } from 'react';
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
  score,
  won,
}: {
  team: Team;
  players: string[];
  me: string;
  score?: number;
  won?: boolean;
}) {
  // The selected player always leads their group.
  const ordered = players.includes(me)
    ? [me, ...players.filter((name) => name !== me)]
    : players;
  return (
    <div className={`court-side ${team.color}`}>
      <TeamBadge team={team} />
      <div>
        <h3>{team.name}</h3>
        <p>
          {ordered.map((name, index) => (
            // Each name keeps its trailing dot so a line never starts with one.
            <Fragment key={name}>
              <span className="player">
                <span className={name === me ? 'me' : undefined}>{name}</span>
                {index < ordered.length - 1 && ' ·'}
              </span>{' '}
            </Fragment>
          ))}
        </p>
      </div>
      {score !== undefined && (
        <span className={`court-score ${won ? 'won' : ''}`}>{score}</span>
      )}
    </div>
  );
}

const playersIn = (match: Match) => [
  ...(match.homePlayers ?? []),
  ...(match.awayPlayers ?? []),
];

export default function Schedule({
  teams,
  matches,
  children,
}: TournamentData & { children: ReactNode }) {
  const rounds = [...new Set(matches.map((match) => match.round))].sort(
    (a, b) => a - b,
  );
  const [me, setMe] = useState('');
  const [round, setRound] = useState(rounds[0] ?? 1);
  const [ready, setReady] = useState(false);

  // The name picker only works once the page's script has loaded.
  useEffect(() => setReady(true), []);

  // On phones the courts stack, so bring your court into view. Desktop shows
  // all three side by side and doesn't need to scroll.
  useEffect(() => {
    if (!me || !window.matchMedia('(max-width: 599px)').matches) return;
    const reduceMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    document.querySelector('.court-card.mine')?.scrollIntoView({
      behavior: reduceMotion ? 'auto' : 'smooth',
      block: 'nearest',
    });
  }, [me, round]);

  const heading = (
    <header className="schedule-heading">
      <div className="schedule-heading-copy">
        <h1>Schedule</h1>
        {matches.length > 0 && (
          <div className="find-court">
            <label className="sr-only" htmlFor="me-select">
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
          </div>
        )}
      </div>
      <div className="schedule-art">{children}</div>
    </header>
  );

  if (matches.length === 0) {
    return (
      <>
        {heading}
        <MeetingBanner />
        <section className="empty-state">
          <span className="empty-icon">
            <Icon name="ball" size={36} />
          </span>
          <span className="coming-soon">Coming soon</span>
          <h2>The schedule is still brewing</h2>
          <p>4v4 matchups and court times will be posted here soon!</p>
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
      {heading}

      <div className="round-picker" role="tablist" aria-label="Rounds">
        {myCourts.map(({ round: number, match }) => (
          <button
            key={number}
            role="tab"
            aria-selected={number === round}
            className={number === round ? 'selected' : ''}
            onClick={() => setRound(number)}
          >
            <span>Round {number}</span>
            {me && match && (
              <span className="pill-court">Court {match.court}</span>
            )}
          </button>
        ))}
      </div>

      <h2 className="sr-only" id="round-heading">
        Round {round}
      </h2>
      <div className="court-list" aria-labelledby="round-heading">
        {games.map((match) => {
          const home = teamById(match.homeId);
          const away = teamById(match.awayId);
          if (!home || !away) return null;
          const mine = Boolean(me) && playersIn(match).includes(me);
          const score = match.status === 'final' ? match.score : null;
          return (
            <article
              className={`court-card ${mine ? `mine ${myTeam?.color}` : ''}`}
              key={match.id}
              aria-label={
                score
                  ? `Court ${match.court}: ${home.name} ${score[0]}, ${away.name} ${score[1]}`
                  : `Court ${match.court}: ${home.name} versus ${away.name}`
              }
            >
              <header className="court-header">
                <strong>Court {match.court}</strong>
                {mine && <span className="you-here">You're here</span>}
              </header>
              <CourtSide
                team={home}
                players={match.homePlayers ?? home.players}
                me={me}
                score={score?.[0]}
                won={score !== null && score[0] > score[1]}
              />
              <div className="court-vs" aria-hidden="true">
                {score ? 'Final' : 'vs'}
              </div>
              <CourtSide
                team={away}
                players={match.awayPlayers ?? away.players}
                me={me}
                score={score?.[1]}
                won={score !== null && score[1] > score[0]}
              />
            </article>
          );
        })}
      </div>
    </>
  );
}
