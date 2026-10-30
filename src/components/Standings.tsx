import type { TournamentData } from '../data/tournament';
import { calculateStandings } from '../lib/tournament';
import Icon from './Icon';
import TeamBadge from './TeamBadge';

export default function Standings({ teams, matches }: TournamentData) {
  // Teams always appear in their fixed order; the table is not a ranking.
  const standings = calculateStandings(teams, matches).sort(
    (a, b) => teams.indexOf(a.team) - teams.indexOf(b.team),
  );
  return (
    <>
      <section className="leaderboard">
        <div className="leaderboard-heading">
          <div>
            <h2>Team standings</h2>
            <p>Select a team below to see all players.</p>
          </div>
        </div>
        <div className="table-scroll">
          <table>
            <caption className="sr-only">
              Team standings in team order. Select a team name for its roster.
            </caption>
            <thead>
              <tr>
                <th scope="col" className="team-cell">
                  Team
                </th>
                <th scope="col" className="played-cell">
                  Played
                </th>
                <th scope="col" className="stat-cell">
                  <abbr title="Wins">W</abbr>
                </th>
                <th scope="col" className="stat-cell">
                  <abbr title="Losses">L</abbr>
                </th>
                <th scope="col" className="percent-cell">
                  <abbr title="Win percentage">W%</abbr>
                </th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => (
                <tr key={row.team.id}>
                  <th
                    scope="row"
                    className="team-cell"
                    aria-label={`${row.team.name}, ${row.team.players.length} players`}
                  >
                    <div className="table-team">
                      <TeamBadge team={row.team} />
                      <details>
                        <summary>
                          {row.team.name}
                          <Icon name="chevron" size={13} />
                        </summary>
                        <p className="table-roster">
                          {row.team.players.join(' · ')}
                        </p>
                      </details>
                      <span className="pool-label">
                        {row.team.players.length} players
                      </span>
                    </div>
                  </th>
                  <td className="played-cell">{row.played}</td>
                  <td className="wins-cell">{row.wins}</td>
                  <td>{row.losses}</td>
                  <td className="percent-cell">
                    {Math.round(row.winPercentage * 100)}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <Icon name="info" size={16} />
          <p>In case of a tie, the best dressed team takes the win.</p>
        </div>
      </section>
    </>
  );
}
