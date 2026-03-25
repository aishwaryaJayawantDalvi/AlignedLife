import { useMemo, useState } from "react";

const presetReasons = [
  "Harassment or threatening language",
  "Pressuring for personal contact details",
  "Fake profile or misleading intent",
  "Sexual or explicit content",
  "Other safety concern"
];

const ReportModal = ({ open, partnerName, onClose, onSubmit, submitting }) => {
  const [selected, setSelected] = useState(presetReasons[0]);
  const [details, setDetails] = useState("");

  const reason = useMemo(() => {
    if (!details.trim()) return selected;
    return `${selected} - ${details.trim()}`;
  }, [selected, details]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <div className="card w-full max-w-lg p-6 border border-slate-700/80">
        <h2 className="text-xl font-bold">Report User</h2>
        <p className="text-sm text-slate-400 mt-1">
          Reporting <span className="text-slate-200 font-semibold">{partnerName}</span>. We will flag this for review.
        </p>

        <div className="mt-5 space-y-3">
          <label className="block text-sm font-semibold text-slate-200">Reason</label>
          <div className="space-y-2">
            {presetReasons.map((item) => (
              <label key={item} className="flex items-center gap-2 rounded-lg border border-slate-700 bg-slate-900 px-3 py-2 text-sm text-slate-300">
                <input
                  type="radio"
                  name="report-reason"
                  checked={selected === item}
                  onChange={() => setSelected(item)}
                />
                {item}
              </label>
            ))}
          </div>

          <label className="block text-sm font-semibold text-slate-200 mt-2">Additional context (optional)</label>
          <textarea
            className="input min-h-24"
            placeholder="Add anything that can help moderation review this quickly."
            value={details}
            onChange={(e) => setDetails(e.target.value)}
          />
        </div>

        <div className="mt-6 flex justify-end gap-2">
          <button type="button" className="btn-muted" onClick={onClose} disabled={submitting}>Cancel</button>
          <button
            type="button"
            className="btn-primary"
            onClick={() => onSubmit(reason)}
            disabled={submitting}
          >
            {submitting ? "Submitting..." : "Submit Report"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ReportModal;
