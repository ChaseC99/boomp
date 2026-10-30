import { Fragment, useEffect, useState } from 'react';
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
      <section className="info-card find-court" aria-labelledby="find-court">
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
      </section>

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
