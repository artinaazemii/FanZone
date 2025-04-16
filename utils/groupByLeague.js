export const groupFixturesByLeague = (fixtures) => {
    const grouped = {};
  
    fixtures.forEach(fixture => {
      const leagueName = fixture.league.name;
      if (!grouped[leagueName]) {
        grouped[leagueName] = [];
      }
      grouped[leagueName].push(fixture);
    });
  
    return Object.entries(grouped).map(([league, matches]) => ({
      league,
      matches,
    }));
  };
  