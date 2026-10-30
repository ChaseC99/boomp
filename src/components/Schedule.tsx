import { useEffect, useState } from 'react';
import type { Match, TournamentData } from '../data/tournament';
import { event } from '../data/tournament';
import { filterMatches } from '../lib/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

function RefereeFooter({ assignment }: { assignment: string }) {
  return (
    <footer className="match-referee">
      <span className="match-referee-label">
        <Icon name="whistle" size={16} />
        Referees
      </span>
      <p className="match-referee-names">{assignment}</p>
    </footer>
  );
}

export default function Schedule({ teams, matches }: TournamentData) {
  const [query, setQuery] = useState('');
  const [teamId, setTeamId] = useState('');
  const [stage, setStage] = useState<'all' | 'pool' | 'playoff'>('all');
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    setQuery(params.get('q') ?? '');
    const candidate = params.get('team') ?? '';
    setTeamId(teams.some((team) => team.id === candidate) ? candidate : '');
    const phase = params.get('stage');
    if (phase === 'pool' || phase === 'playoff') setStage(phase);
    setReady(true);
  }, [teams]);

  useEffect(() => {
    if (!ready) return;
    const url = new URL(window.location.href);
    for (const [key, value] of [
      ['q', query],
      ['team', teamId],
      ['stage', stage === 'all' ? '' : stage],
    ]) {
      if (value) url.searchParams.set(key, value);
      else url.searchParams.delete(key);
    }
    window.history.replaceState(null, '', url);
  }, [query, teamId, stage, ready]);

  const filtered = filterMatches(matches, teams, query, teamId, stage);
  const matchCount = filtered.length;
  const rounds = [...new Set(filtered.map((match) => match.round))];
  const hasFilters = Boolean(query || teamId || stage !== 'all');
  const clear = () => {
    setQuery('');
    setTeamId('');
    setStage('all');
  };
  const selected = teams.find((team) => team.id === teamId);

  if (matches.length === 0) {
    return (
      <>
        <aside
          className="players-meeting"
          aria-labelledby="event-start-heading"
        >
          <Icon name="clock" size={22} />
          <div>
            <h2 id="event-start-heading">
              {event.time} · See you at the park!
            </h2>
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
        <section className="empty-state">
          <span className="empty-icon">
            <Icon name="ball" size={36} />
          </span>
          <h2>4v4 across three courts</h2>
          <p>
            Three teams of eight will split into groups of four, with three
            games happening at a time. Four-player groups, matchups, and start
            times are coming soon.
          </p>
          <a className="button" href="/#teams-heading">
            See the teams <Icon name="arrow" size={18} />
          </a>
        </section>
      </>
    );
  }

  const renderMatch = (match: Match) => {
    const home = teams.find((team) => team.id === match.homeId)!;
    const away = teams.find((team) => team.id === match.awayId)!;
    return (
      <article
        className="match-card"
        key={match.id}
        aria-label={`${home.name} versus ${away.name}, time TBD, court ${match.court}`}
      >
        <div className="match-topline">
          <span>
            <span className="court-dot" />
            Court {match.court}
          </span>
          <span className={`match-status ${match.status}`}>
            {match.status === 'final' ? (
              <>
                <Icon name="check" size={12} /> Final
              </>
            ) : (
              'Upcoming'
            )}
          </span>
        </div>
        {[home, away].map((team, index) => (
          <div
            className={`match-team ${match.score && match.score[index] > match.score[1 - index] ? 'winner' : ''}`}
            key={team.id}
          >
            <TeamBadge team={team} />
            <div>
              <h3>{team.name}</h3>
              <p>
                {team.players.map((name) => name.split(' ')[0]).join(' · ')}
              </p>
            </div>
            <span className="match-score">
              {match.score ? (
                match.score[index]
              ) : (
                <span className="score-dash">—</span>
              )}
            </span>
          </div>
        ))}
        {match.refereeId && (
          <RefereeFooter
            assignment={
              teams
                .find((team) => team.id === match.refereeId)
                ?.players.join(' · ') ?? match.refereeId
            }
          />
        )}
      </article>
    );
  };

  return (
    <>
      <aside className="demo-notice" aria-label="Schedule note">
        <Icon name="info" size={17} />
        <p>
          Match times and four-player court assignments will be confirmed here.
        </p>
      </aside>
      <div className="schedule-toolbar">
        <div className="search-field">
          <Icon name="search" size={20} />
          <label className="sr-only" htmlFor="schedule-search">
            Search by team or player name
          </label>
          <input
            id="schedule-search"
            type="search"
            disabled={!ready}
            placeholder="Team or player name"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          {query && (
            <button
              className="icon-button"
              aria-label="Clear search"
              onClick={() => setQuery('')}
            >
              <Icon name="close" size={17} />
            </button>
          )}
        </div>
        <div className="select-field">
          <label className="sr-only" htmlFor="team-filter">
            Filter by team
          </label>
          <select
            id="team-filter"
            disabled={!ready}
            value={teamId}
            onChange={(event) => setTeamId(event.target.value)}
          >
            <option value="">All teams</option>
            {teams.map((team) => (
              <option key={team.id} value={team.id}>
                {team.name}
              </option>
            ))}
          </select>
          <Icon name="chevron" size={17} />
        </div>
      </div>
      <div className="schedule-tabs-row">
        <div className="segmented" aria-label="Tournament stage">
          {(
            [
              ['all', 'All matches'],
              ['pool', 'Pool play'],
              ['playoff', 'Playoffs'],
            ] as const
          ).map(([value, label]) => (
            <button
              key={value}
              disabled={!ready}
              aria-pressed={stage === value}
              className={stage === value ? 'selected' : ''}
              onClick={() => setStage(value)}
            >
              {label}
            </button>
          ))}
        </div>
        <p className="results-count" role="status">
          {matchCount} {matchCount === 1 ? 'match' : 'matches'}
          {hasFilters && (
            <button onClick={clear}>
              Reset filters <Icon name="close" size={12} />
            </button>
          )}
        </p>
      </div>
      {selected && (
        <div className="selected-team">
          <TeamBadge team={selected} />
          <div>
            <strong>{selected.name}</strong>
            <p>{selected.players.join(' · ')}</p>
          </div>
          <span>POOL PLAY</span>
        </div>
      )}
      <aside
        className="players-meeting"
        aria-labelledby="players-meeting-heading"
      >
        <Icon name="clock" size={22} />
        <div>
          <h2 id="players-meeting-heading">
            {event.time} · See you at the park!
          </h2>
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
      {filtered.length === 0 ? (
        <div className="empty-state">
          <span className="empty-icon">
            <Icon name="ghost" size={36} />
          </span>
          <h2>No matches found</h2>
          <p>Try another team or player name, or clear your filters.</p>
          <button className="button secondary" onClick={clear}>
            Clear filters <Icon name="arrow" size={18} />
          </button>
        </div>
      ) : (
        <div className="rounds">
          {rounds.map((round) => {
            const games = filtered.filter((match) => match.round === round);
            return (
              <section className="round" key={round}>
                <div className="round-heading">
                  <h2>Round {round}</h2>
                  <span>Time TBD</span>
                  <div />
                </div>
                <div className="match-grid">{games.map(renderMatch)}</div>
              </section>
            );
          })}
        </div>
      )}
    </>
  );
}
