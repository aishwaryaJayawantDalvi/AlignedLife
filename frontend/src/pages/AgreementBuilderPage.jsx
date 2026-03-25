import { useEffect, useState } from "react";
import { api } from "../api/client";

const baseForm = {
  partnerId: "",
  relationshipType: "Social marriage only",
  livingPlan: "Same house / separate rooms",
  familyInteraction: "Low",
  kids: "No",
  durationType: "Temporary",
  temporaryYears: 2,
  exitPlan: "Either party can leave with notice. No financial dependency. Mutual respect clause."
};

const AgreementBuilderPage = () => {
  const [matches, setMatches] = useState([]);
  const [agreements, setAgreements] = useState([]);
  const [form, setForm] = useState(baseForm);
  const [message, setMessage] = useState("");

  const load = async () => {
    const [{ data: matchData }, { data: agreementData }] = await Promise.all([
      api.get("/matches"),
      api.get("/agreements")
    ]);

    setMatches(matchData);
    setAgreements(agreementData);

    if (!form.partnerId && matchData[0]?.partner?.id) {
      setForm((prev) => ({ ...prev, partnerId: matchData[0].partner.id }));
    }
  };

  useEffect(() => {
    load();
  }, []);

  const save = async (e) => {
    e.preventDefault();
    const payload = {
      ...form,
      temporaryYears: form.durationType === "Temporary" ? Number(form.temporaryYears) : null
    };
    await api.post("/agreements", payload);
    setMessage("Agreement saved.");
    load();
  };

  const download = async (id) => {
    const response = await api.get(`/agreements/${id}/export`, { responseType: "blob" });
    const url = URL.createObjectURL(response.data);
    const link = document.createElement("a");
    link.href = url;
    link.download = `alignedlife-agreement-${id}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="grid lg:grid-cols-2 gap-6">
      <form onSubmit={save} className="card p-5 space-y-3">
        <h1 className="text-2xl font-bold">Agreement Builder</h1>
        <p className="text-slate-400 text-sm">Define clear terms before family-facing decisions.</p>
        <select className="input" value={form.partnerId} onChange={(e) => setForm({ ...form, partnerId: e.target.value })} required>
          <option value="">Select matched partner</option>
          {matches.map((m) => <option key={m.partner.id} value={m.partner.id}>{m.partner.displayName}</option>)}
        </select>
        <select className="input" value={form.relationshipType} onChange={(e) => setForm({ ...form, relationshipType: e.target.value })}>
          <option>Social marriage only</option><option>Friendship + co-living</option><option>Independent lives</option>
        </select>
        <select className="input" value={form.livingPlan} onChange={(e) => setForm({ ...form, livingPlan: e.target.value })}>
          <option>Same house / separate rooms</option><option>Same city / different cities</option>
        </select>
        <select className="input" value={form.familyInteraction} onChange={(e) => setForm({ ...form, familyInteraction: e.target.value })}>
          <option>Low</option><option>Medium</option><option>High</option>
        </select>
        <select className="input" value={form.kids} onChange={(e) => setForm({ ...form, kids: e.target.value })}>
          <option>No</option><option>Maybe</option>
        </select>
        <select className="input" value={form.durationType} onChange={(e) => setForm({ ...form, durationType: e.target.value })}>
          <option>Temporary</option><option>Long-term</option>
        </select>
        {form.durationType === "Temporary" && <input className="input" type="number" min="1" max="25" value={form.temporaryYears} onChange={(e) => setForm({ ...form, temporaryYears: e.target.value })} />}
        <textarea className="input min-h-24" value={form.exitPlan} onChange={(e) => setForm({ ...form, exitPlan: e.target.value })} />
        <button className="btn-primary">Save Agreement</button>
        {message && <p className="text-mint text-sm">{message}</p>}
      </form>

      <section className="card p-5">
        <h2 className="text-xl font-bold">Saved Agreements</h2>
        <div className="space-y-3 mt-4">
          {agreements.map((a) => (
            <div key={a._id} className="bg-slate-900 border border-slate-700 rounded-xl p-3">
              <p className="text-sm">{a.relationshipType}</p>
              <p className="text-xs text-slate-400">{new Date(a.createdAt).toLocaleString()}</p>
              <button className="btn-muted mt-2" type="button" onClick={() => download(a._id)}>Export PDF</button>
            </div>
          ))}
          {agreements.length === 0 && <p className="text-slate-400 text-sm">No agreements yet.</p>}
        </div>
      </section>
    </div>
  );
};

export default AgreementBuilderPage;
