import { BrowserRouter, Routes, Route } from "react-router-dom";
import second from 'first'

export default function WVS() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Home />} />
          <Route path="teams" element={<Teams />}>
            <Route path=":teamId" element={<Team />} />
            <Route path="new" element={<NewTeamForm />} />
            <Route index element={<LeagueStandings />} />
          </Route>
        </Route>
        <Route path="*" element={} />
      </Routes>
    </BrowserRouter>
  );
}
