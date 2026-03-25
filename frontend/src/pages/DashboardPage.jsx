import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api/client";
import ReportModal from "../components/ReportModal";
import { buildAvatarUrl } from "../utils/avatar";

const DashboardPage = () => {
  const [matches, setMatches] = useState([]);
  const [message, setMessage] = useState("");
  const [reportTarget, setReportTarget] = useState(null);
  const [reportSubmitting, setReportSubmitting] = useState(false);

  const load = async () => {
    await api.post("/matches/refresh");
    const { data } = await api.get("/matches");
    setMatches(data);
  };

  useEffect(() => {
    load();
  }, []);

  const reveal = async (matchId) => {
    const { data } = await api.post(`/matches/${matchId}/reveal`);
    setMessage(data.revealed ? "Identity reveal activated by mutual consent." : "Reveal request sent. Waiting for mutual consent.");
    load();
  };

  const block = async (userId) => {
    await api.post(`/moderation/block/${userId}`);
    setMessage("User blocked.");
    load();
  };

  const submitReport = async (reason) => {
    if (!reportTarget?.id || !reason?.trim()) return;

    try {
      setReportSubmitting(true);
      await api.post(`/moderation/report/${reportTarget.id}`, { reason });
      setMessage("Report submitted. Thank you for helping keep the space safe.");
      setReportTarget(null);
    } finally {
      setReportSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-3xl font-bold">Aligned Matches</h1>
      <p className="text-slate-400 mt-2">Compatibility is based on life strategy alignment, not romantic scoring.</p>
      {message && <p className="mt-3 text-mint text-sm">{message}</p>}

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mt-6">
        {matches.map((match) => (
          <article className="card p-4" key={match.id}>
            <div className="flex items-center gap-3">
              <img
                src={buildAvatarUrl(match.partner.avatarStyle, match.partner.avatarSeed)}
                alt={`${match.partner.displayName} avatar`}
                className="h-12 w-12 rounded-xl border border-slate-600 bg-slate-900"
              />
              <div>
                <h2 className="font-bold text-lg leading-tight">{match.partner.displayName}</h2>
                <p className="text-slate-400 text-xs">{match.partner.personalityTag || "Calm thinker"}</p>
              </div>
            </div>
            <p className="text-slate-400 text-sm mt-3">Age {match.partner.age || "N/A"}</p>
            <p className="text-slate-300 text-sm mt-2 min-h-14">{match.partner.bio || "No bio yet."}</p>
            <p className="mt-3 text-glow font-semibold">{match.compatibility}% compatible</p>
            <div className="flex flex-wrap gap-2 mt-4">
              <Link to={`/chat/${match.id}/${match.partner.id}`} className="btn-primary">Open Chat</Link>
              <button className="btn-muted" onClick={() => reveal(match.id)}>{match.revealed ? "Revealed" : "Reveal Identity"}</button>
              <button className="btn-muted" onClick={() => block(match.partner.id)}>Block</button>
              <button className="btn-muted" onClick={() => setReportTarget({ id: match.partner.id, name: match.partner.displayName })}>Report</button>
            </div>
          </article>
        ))}
      </div>
      {matches.length === 0 && <p className="text-slate-400 mt-6">No matches yet. Update profile details to improve alignment.</p>}

      <ReportModal
        open={Boolean(reportTarget)}
        partnerName={reportTarget?.name || "this user"}
        onClose={() => setReportTarget(null)}
        onSubmit={submitReport}
        submitting={reportSubmitting}
      />
    </div>
  );
};

export default DashboardPage;
