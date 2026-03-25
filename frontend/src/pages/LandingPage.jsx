import { Link } from "react-router-dom";

const LandingPage = () => {
  return (
    <section className="grid md:grid-cols-2 gap-8 items-center py-10">
      <div>
        <p className="text-mint text-sm uppercase tracking-[0.2em]">Private life alignment platform</p>
        <h1 className="text-4xl md:text-5xl font-extrabold leading-tight mt-4">
          Build calm, mutual life plans under family pressure.
        </h1>
        <p className="text-slate-300 mt-5 max-w-xl">
          AlignedLife helps people create non-traditional, independent agreements with clarity, privacy, and respect.
        </p>
        <div className="mt-6 flex gap-3">
          <Link to="/auth" className="btn-primary">Get Started</Link>
          <a href="#why" className="btn-muted">Why AlignedLife</a>
        </div>
      </div>
      <div className="card p-6">
        <h2 className="font-bold text-xl">Built for real decisions, not swipes</h2>
        <ul className="mt-4 space-y-3 text-sm text-slate-300">
          <li>Anonymous first, identity reveal only with mutual consent.</li>
          <li>Compatibility based on life expectations, not romance signals.</li>
          <li>Collaborative agreement builder with exportable PDF record.</li>
        </ul>
      </div>
    </section>
  );
};

export default LandingPage;
