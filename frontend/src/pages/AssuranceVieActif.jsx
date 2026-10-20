import { useMemo, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { useAuth } from '../context/AuthContext';
import { useSeoMeta } from '../lib/seo';
import {
  BANK_RATE,
  COLLATERAL_THRESHOLD,
  INSURER_RATE,
  ISSUE_AGE,
  READ_AGES,
  SAFETY_RATIO,
  SCENARIOS,
  firstCollateralYear,
  formatCad,
  formatCompactCad,
  formatMultiple,
  formatPct,
  illustrateLoan,
  rowAtAge,
  scenarioById,
} from '../data/assuranceVieActif';

const PATH = '/admin/assurance-vie-actif';
const DETAIL_AGES = [32, 40, 45, 51, 55, 60, 65, 70, 75, 80, 85, 90, 100];

const NAV = [
  { href: '#these', label: 'La thèse' },
  { href: '#mecanique', label: 'La mécanique' },
  { href: '#scenarios', label: 'Les trois contrats' },
  { href: '#lecture', label: 'Lecture chiffrée' },
  { href: '#levier', label: 'Le levier' },
  { href: '#conditions', label: 'Conditions' },
];

function formatAxis(value) {
  return formatCompactCad(value);
}

function ChartTip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl border border-prestige-beige bg-white px-3 py-2 text-xs shadow-ia">
      <p className="mb-1 font-semibold text-dark">{label} ans</p>
      {payload.map((item) => (
        <p key={item.dataKey} className="tabular-nums" style={{ color: item.color }}>
          {item.name} · {formatCad(item.value)}
        </p>
      ))}
    </div>
  );
}

function PremiumStory({ scenario }) {
  const first = scenario.rows[0];
  const after = scenario.rows[20];
  const cross = firstCollateralYear(scenario);
  const deposit = Math.round((first.premium - first.base) * 100) / 100;

  if (scenario.id === 's1') {
    return (
      <>
        <p>
          Prime de base garantie de {formatCad(first.base)} à vie. L’illustration y ajoute{' '}
          {formatCad(deposit)} de dépôt supplémentaire pendant 20 ans, pour un versement de{' '}
          {formatCad(first.premium)}. À compter de l’année 21, il ne reste que {formatCad(after.premium)}.
          Cet arrêt n’est pas une libération contractuelle.
        </p>
        <p>
          La valeur de rachat illustrée passe 100&nbsp;000&nbsp;$ à {cross.age} ans
          {' '}({formatCad(cross.csv)}).
        </p>
      </>
    );
  }

  if (scenario.id === 's3') {
    return (
      <>
        <p>
          Prime garantie de {formatCad(first.premium)} pendant 20 ans, sans dépôt supplémentaire.
          À l’année 21, la prime contractuelle tombe à {formatCad(after.premium)}. C’est le seul des
          trois contrats dont la fin des versements est garantie.
        </p>
        <p>
          La valeur de rachat illustrée passe 100&nbsp;000&nbsp;$ à {cross.age} ans
          {' '}({formatCad(cross.csv)}).
        </p>
      </>
    );
  }

  return (
    <>
      <p>
        {formatCad(first.premium)} la première année, dont {formatCad(first.base)} de prime de base
        et {formatCad(deposit)} de dépôt supplémentaire. Ensuite, {formatCad(after.premium)} par
        année, illustrés jusqu’à 100 ans. Rien, dans ce scénario, ne met fin aux versements.
      </p>
      <p>
        La valeur de rachat illustrée passe 100&nbsp;000&nbsp;$ à {cross.age} ans
        {' '}({formatCad(cross.csv)}), un an plus tôt que les deux autres.
      </p>
    </>
  );
}

function TrajectoryChart({ horizon, showDeath }) {
  const data = useMemo(() => {
    const base = SCENARIOS[0].rows.filter((row) => row.age <= horizon);
    return base.map((row, index) => {
      const point = { age: row.age };
      SCENARIOS.forEach((scenario) => {
        const source = scenario.rows[index];
        point[`csv-${scenario.id}`] = source.csv;
        point[`death-${scenario.id}`] = source.death;
      });
      return point;
    });
  }, [horizon]);

  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <LineChart data={data} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e7e1d6" vertical={false} />
            <XAxis
            dataKey="age"
            tick={{ fontSize: 12, fill: '#756b5f' }}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            tickFormatter={formatAxis}
            tick={{ fontSize: 12, fill: '#756b5f' }}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip content={<ChartTip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <ReferenceLine
            y={COLLATERAL_THRESHOLD}
            stroke="#756b5f"
            strokeDasharray="4 4"
            label={{ value: '100 000 $', fill: '#756b5f', fontSize: 11, position: 'insideTopLeft' }}
          />
          {SCENARIOS.map((scenario) => (
            <Line
              key={scenario.id}
              type="monotone"
              dataKey={`csv-${scenario.id}`}
              name={`${scenario.label} · rachat illustré`}
              stroke={scenario.color}
              strokeWidth={2.5}
              dot={false}
              isAnimationActive={false}
            />
          ))}
          {showDeath && SCENARIOS.map((scenario) => (
            <Line
              key={`${scenario.id}-death`}
              type="monotone"
              dataKey={`death-${scenario.id}`}
              name={`${scenario.label} · décès`}
              stroke={scenario.color}
              strokeWidth={1.5}
              strokeDasharray="5 4"
              dot={false}
              isAnimationActive={false}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function LeverageChart({ projection, scenario }) {
  return (
    <div className="h-[420px] w-full">
      <ResponsiveContainer>
        <LineChart data={projection.points} margin={{ top: 16, right: 12, left: 0, bottom: 0 }}>
          <CartesianGrid stroke="#e7e1d6" vertical={false} />
          <XAxis dataKey="age" tick={{ fontSize: 12, fill: '#756b5f' }} tickLine={false} axisLine={false} />
          <YAxis
            tickFormatter={formatAxis}
            tick={{ fontSize: 12, fill: '#756b5f' }}
            tickLine={false}
            axisLine={false}
            width={64}
          />
          <Tooltip content={<ChartTip />} />
          <Legend wrapperStyle={{ fontSize: 12, paddingTop: 12 }} />
          <ReferenceLine y={COLLATERAL_THRESHOLD} stroke="#756b5f" strokeDasharray="4 4" />
          <Line type="monotone" dataKey="cumulative" name="Primes cumulées" stroke="#c4b8a8" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="csvG" name="Rachat garanti" stroke="#73c4ef" strokeWidth={2} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="csv" name="Rachat illustré" stroke={scenario.color} strokeWidth={2.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="death" name="Capital décès" stroke="#01233f" strokeDasharray="5 4" strokeWidth={1.75} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="ceiling" name="Limite de prudence · 80 %" stroke="#9a3412" strokeDasharray="2 4" strokeWidth={1.5} dot={false} isAnimationActive={false} />
          <Line type="monotone" dataKey="balance" name="Solde du prêt" stroke="#9f1239" strokeWidth={2.5} dot={false} isAnimationActive={false} />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
}

function AccessGate({ user }) {
  const location = useLocation();
  return (
    <div className="min-h-[70vh] bg-[#f4f1eb] flex items-center justify-center px-4">
      <div className="max-w-md text-center space-y-4 rounded-2xl border border-prestige-beige bg-white p-8 shadow-ia">
        <p className="text-xs uppercase tracking-[0.18em] text-prestige-taupe">Dossier privé</p>
        <h1 className="font-heading text-2xl text-dark">Accès réservé à l’administration</h1>
        <p className="text-sm text-prestige-taupe leading-relaxed">
          {user
            ? 'Ce compte ne peut pas ouvrir la présentation.'
            : 'Connectez-vous avec un compte administrateur pour ouvrir le dossier.'}
        </p>
        {!user && (
          <Link
            to="/connexion"
            state={{ from: location }}
            className="inline-flex items-center justify-center rounded-full bg-dark px-5 py-2.5 text-sm font-semibold text-white"
          >
            Se connecter
          </Link>
        )}
      </div>
    </div>
  );
}

export const AssuranceVieActif = () => {
  const { user, loading } = useAuth();
  const [horizon, setHorizon] = useState(85);
  const [showDeath, setShowDeath] = useState(false);
  const [readAge, setReadAge] = useState(65);
  const [focusId, setFocusId] = useState('s3');
  const [loanStart, setLoanStart] = useState(15);
  const [loanAmount, setLoanAmount] = useState(100000);
  const [repayment, setRepayment] = useState(0);
  const [fullTable, setFullTable] = useState(false);

  useSeoMeta({
    title: 'Dossier privé | Assurance vie comme classe d’actif',
    description: 'Présentation interne. Trois illustrations d’assurance vie participante détenue par une société.',
    canonicalPath: PATH,
    noindex: true,
  });

  const focus = scenarioById(focusId);
  const projection = useMemo(
    () => illustrateLoan(focus.rows, {
      startYear: loanStart,
      amount: loanAmount,
      repayment,
      horizonAge: horizon,
    }),
    [focus, loanStart, loanAmount, repayment, horizon],
  );
  const startRow = focus.rows.find((row) => row.year === loanStart);

  if (loading) {
    return (
      <div className="min-h-[70vh] bg-[#f4f1eb] flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user?.is_admin) {
    return <AccessGate user={user} />;
  }

  const detailRows = focus.rows.filter((row) => fullTable || DETAIL_AGES.includes(row.age));

  return (
    <div className="bg-[#f4f1eb] text-dark" data-testid="assurance-vie-actif">
      <nav className="sticky top-20 z-40 border-b border-prestige-beige bg-[#f4f1eb]/95 backdrop-blur print:hidden">
        <div className="container-max flex items-center gap-6 overflow-x-auto px-4 py-3 md:px-8">
          <Link to="/admin" className="shrink-0 text-xs font-semibold uppercase tracking-[0.16em] text-prestige-taupe hover:text-dark">
            Admin
          </Link>
          {NAV.map((item) => (
            <a key={item.href} href={item.href} className="shrink-0 text-sm text-dark/80 hover:text-dark">
              {item.label}
            </a>
          ))}
        </div>
      </nav>

      <header className="bg-dark text-white">
        <div className="container-max px-4 py-16 md:px-8 md:py-24">
          <p className="text-sm font-medium text-white/90">Pierre-Olivier Caouette</p>
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.22em] text-[#73c4ef]">
            Dossier de rencontre · Illustration à {ISSUE_AGE} ans
          </p>
          <h1 className="mt-5 max-w-4xl font-heading text-4xl leading-tight md:text-6xl">
            L’assurance vie participante comme classe d’actif
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-white/80">
            Que devient le surplus d’une société lorsqu’il est versé dans un contrat d’assurance
            vie entière participante, plutôt que dans un placement qui produit un revenu imposable
            chaque année. Trois architectures. Les mêmes hypothèses. Aucune n’est désignée d’avance.
          </p>
          <dl className="mt-12 grid max-w-4xl grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/10 md:grid-cols-4">
            {[
              ['Assuré à l’émission', `${ISSUE_AGE} ans`],
              ['Contrats au dossier', '1, 3 et 4'],
              ['Seuil de lecture', '100 000 $'],
              ['Horizon illustré', 'Jusqu’à 100 ans'],
            ].map(([label, value]) => (
              <div key={label} className="bg-white/5 px-4 py-5">
                <dt className="text-[11px] uppercase tracking-[0.14em] text-white/50">{label}</dt>
                <dd className="mt-2 font-heading text-xl">{value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </header>

      <section id="these" className="scroll-mt-32 container-max px-4 py-16 md:px-8 md:py-20">
        <div className="grid gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">La thèse</p>
            <h2 className="mt-3 font-heading text-3xl md:text-4xl">Un actif de bilan, pas une dépense</h2>
          </div>
          <div className="space-y-5 text-[15px] leading-relaxed text-dark/80 lg:col-span-7">
            <p>
              La société est propriétaire et bénéficiaire. Elle déplace une partie de sa trésorerie
              vers un contrat. Dans cette structure, la prime n’est pas une dépense courante
              déductible. Elle achète deux choses en même temps&nbsp;: une protection au décès, et
              une valeur de rachat qui demeure dans le contrat.
            </p>
            <p>
              Cette valeur a deux couches. L’une est garantie. L’autre suit le barème de
              participations courant, qui n’est pas garanti et peut être revu. À 65 ans, selon le
              contrat, la couche garantie représente entre 16&nbsp;% et 38&nbsp;% de la valeur
              illustrée. Le reste est une projection.
            </p>
            <p>
              L’intérêt corporatif n’est pas le rendement affiché. C’est l’endroit où la croissance
              se loge. Elle n’entre pas, année après année, dans le revenu de placement qui réduit
              la déduction pour petite entreprise au-delà du seuil fédéral de 50&nbsp;000&nbsp;$.
              Et l’on peut, plus tard, en tirer des liquidités par un prêt garanti par la police,
              sans racheter le contrat.
            </p>
          </div>
        </div>
      </section>

      <section id="mecanique" className="scroll-mt-32 border-y border-prestige-beige bg-white">
        <div className="container-max px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">La mécanique</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl md:text-4xl">Cinq temps, dans l’ordre où ils se présentent</h2>
          <ol className="mt-12 grid gap-8 md:grid-cols-2 xl:grid-cols-5">
            {[
              ['01', 'La société paie', 'Le surplus devient une prime. Le contrat entre à l’actif. Il ne s’agit pas d’une charge déductible.'],
              ['02', 'Deux valeurs', 'Une valeur de rachat garantie, contractuelle. Une valeur illustrée, qui dépend du barème de participations.'],
              ['03', 'Le seuil de 100 000 $', `En deçà, l’hypothèse de financement est une avance de l’assureur à ${formatPct(INSURER_RATE * 100)}. Au-delà, un collatéral bancaire peut être discuté, hypothèse de ${formatPct(BANK_RATE * 100)}. Ce ne sont pas des offres.`],
              ['04', 'Le frais de garantie', 'L’actionnaire emprunte à son nom. La société donne la police en garantie et reçoit un frais. Ce frais est un revenu pour elle. Le montant doit être raisonnable, et le montage se valide avec le fiscaliste.'],
              ['05', 'Le décès', 'Le capital rembourse d’abord le prêt. Le crédit au compte de dividendes en capital se mesure en général par le capital reçu par la société, moins le coût de base rajusté. Seule l’encaisse qui reste peut être versée.'],
            ].map(([index, title, body]) => (
              <li key={index} className="border-t border-dark/15 pt-4">
                <p className="font-heading text-2xl text-primary">{index}</p>
                <h3 className="mt-3 font-heading text-xl">{title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-dark/75">{body}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      <section id="scenarios" className="scroll-mt-32 container-max px-4 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Les trois contrats</p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl">Même âge, trois façons d’engager la trésorerie</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-dark/75">
            Les numéros sont ceux des illustrations. Le scénario 3 est le seul dont la fin des primes
            est contractuelle. Le scénario 4 est celui qui met le plus de protection en jeu dès la
            première année. Le scénario 1 laisse le dépôt supplémentaire s’arrêter dans l’illustration,
            sans que cet arrêt soit garanti.
          </p>
        </div>
        <div className="mt-10 grid gap-6 lg:grid-cols-3">
          {SCENARIOS.map((scenario) => {
            const first = scenario.rows[0];
            const at65 = rowAtAge(scenario, 65);
            const guaranteedShare = at65.csvG / at65.csv;
            return (
              <article key={scenario.id} className="flex h-full flex-col rounded-2xl border border-prestige-beige bg-white p-6 shadow-ia">
                <div className="h-1 w-12 rounded-full" style={{ backgroundColor: scenario.color }} />
                <p className="mt-5 text-xs font-semibold uppercase tracking-[0.16em] text-prestige-taupe">{scenario.label}</p>
                <h3 className="mt-2 font-heading text-2xl">{scenario.name}</h3>
                <div className="mt-5 space-y-3 text-sm leading-relaxed text-dark/80">
                  <PremiumStory scenario={scenario} />
                </div>
                <dl className="mt-auto space-y-3 border-t border-prestige-beige pt-5 text-sm">
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-prestige-taupe">Capital de base garanti</dt>
                    <dd className="tabular-nums font-semibold">{formatCad(first.deathG)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-prestige-taupe">Décès, année 1</dt>
                    <dd className="tabular-nums font-semibold">{formatCad(first.death)}</dd>
                  </div>
                  <div className="flex items-baseline justify-between gap-4">
                    <dt className="text-prestige-taupe">Rachat illustré à 65 ans</dt>
                    <dd className="tabular-nums font-semibold">{formatCad(at65.csv)}</dd>
                  </div>
                  <div>
                    <div className="flex items-baseline justify-between gap-4">
                      <dt className="text-prestige-taupe">Dont garantie, à 65 ans</dt>
                      <dd className="tabular-nums font-semibold">{formatPct(guaranteedShare * 100, 0)}</dd>
                    </div>
                    <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-dark/10">
                      <div className="h-full bg-dark" style={{ width: `${guaranteedShare * 100}%` }} />
                    </div>
                  </div>
                </dl>
              </article>
            );
          })}
        </div>
      </section>

      <section id="lecture" className="scroll-mt-32 border-y border-prestige-beige bg-white">
        <div className="container-max px-4 py-16 md:px-8 md:py-20">
          <div className="flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div className="max-w-2xl">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Lecture chiffrée</p>
              <h2 className="mt-3 font-heading text-3xl md:text-4xl">Le même âge, les trois bilans</h2>
            </div>
            <div className="flex flex-wrap gap-2 print:hidden">
              {READ_AGES.map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setReadAge(age)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    readAge === age ? 'bg-dark text-white' : 'bg-[#f4f1eb] text-dark'
                  }`}
                >
                  {age} ans
                </button>
              ))}
            </div>
          </div>

          <div className="mt-8 overflow-x-auto">
            <table className="w-full min-w-[760px] border-collapse text-sm">
              <thead>
                <tr className="border-b border-dark/15 text-left">
                  <th className="py-3 pr-4 font-medium text-prestige-taupe">À {readAge} ans</th>
                  {SCENARIOS.map((scenario) => (
                    <th key={scenario.id} className="px-4 py-3 font-heading text-lg font-semibold text-dark">
                      {scenario.label}
                      <span className="mt-1 block font-body text-xs font-medium text-prestige-taupe">{scenario.name}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  ['Prime de l’année', (row) => formatCad(row.premium)],
                  ['Primes cumulées', (row) => formatCad(row.cumulative, 0)],
                  ['Rachat garanti', (row) => formatCad(row.csvG, 0)],
                  ['Rachat illustré', (row) => formatCad(row.csv, 0)],
                  ['Part garantie', (row) => formatPct((row.csvG / row.csv) * 100, 0)],
                  ['Décès garanti', (row) => formatCad(row.deathG, 0)],
                  ['Décès illustré', (row) => formatCad(row.death, 0)],
                  ['Rachat / primes', (row) => formatMultiple(row.csv / row.cumulative)],
                  ['Rendement au rachat, avant impôt', (row) => formatPct(row.irr)],
                  ['Coût de base rajusté', (row) => formatCad(row.acb, 0)],
                  ['Impôt illustré si rachat', (row) => formatCad(row.tax, 0)],
                  ['Rachat net d’impôt', (row) => formatCad(row.net, 0)],
                ].map(([label, render]) => (
                  <tr key={label} className="border-b border-prestige-beige/80">
                    <th className="py-3 pr-4 text-left font-medium text-dark/80">{label}</th>
                    {SCENARIOS.map((scenario) => {
                      const row = rowAtAge(scenario, readAge);
                      const emphasize = label === 'Rachat illustré' || label === 'Décès illustré';
                      return (
                        <td key={scenario.id} className={`px-4 py-3 tabular-nums ${emphasize ? 'font-semibold text-dark' : 'text-dark/80'}`}>
                          {row ? render(row) : '—'}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="mt-8 grid gap-6 md:grid-cols-3">
            {SCENARIOS.map((scenario) => {
              const at65 = rowAtAge(scenario, 65);
              const at85 = rowAtAge(scenario, 85);
              return (
                <p key={scenario.id} className="text-sm leading-relaxed text-dark/75">
                  <span className="font-semibold text-dark">{scenario.label}. </span>
                  À 85 ans, la valeur de rachat illustrée représente {formatMultiple(at85.csv / at85.cumulative)} les
                  primes versées, contre {formatMultiple(at65.csv / at65.cumulative)} à 65 ans. Le capital décès
                  illustré atteint {formatCad(at85.death)}.
                </p>
              );
            })}
          </div>

          <div className="mt-12 flex flex-wrap items-center justify-between gap-4">
            <h3 className="font-heading text-2xl">Trajectoire</h3>
            <div className="flex flex-wrap gap-2 print:hidden">
              {[65, 85, 100].map((age) => (
                <button
                  key={age}
                  type="button"
                  onClick={() => setHorizon(age)}
                  className={`rounded-full px-4 py-2 text-sm font-semibold ${
                    horizon === age ? 'bg-dark text-white' : 'bg-[#f4f1eb] text-dark'
                  }`}
                >
                  Jusqu’à {age} ans
                </button>
              ))}
              <button
                type="button"
                onClick={() => setShowDeath((value) => !value)}
                className={`rounded-full px-4 py-2 text-sm font-semibold ${
                  showDeath ? 'bg-primary text-white' : 'bg-[#f4f1eb] text-dark'
                }`}
              >
                {showDeath ? 'Masquer le décès' : 'Afficher le décès'}
              </button>
            </div>
          </div>
          <p className="mt-3 max-w-3xl text-sm text-dark/70">
            Traits pleins&nbsp;: valeur de rachat illustrée. La ligne pointillée horizontale marque
            100&nbsp;000&nbsp;$. {showDeath ? 'Traits interrompus : capital décès illustré.' : ''}
            La plus grande partie de la pente repose sur le barème de participations.
          </p>
          <div className="mt-6">
            <TrajectoryChart horizon={horizon} showDeath={showDeath} />
          </div>
        </div>
      </section>

      <section id="levier" className="scroll-mt-32 container-max px-4 py-16 md:px-8 md:py-20">
        <div className="max-w-3xl">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Le levier</p>
          <h2 className="mt-3 font-heading text-3xl md:text-4xl">Accéder à la valeur sans racheter le contrat</h2>
          <p className="mt-4 text-[15px] leading-relaxed text-dark/75">
            Le prêt est une hypothèse de travail. Le taux est fixé au moment de l’ouverture, selon
            la valeur de rachat de ce moment-là, et il ne change plus dans la projection même si la
            valeur franchit 100&nbsp;000&nbsp;$ plus tard. Sans remboursement, les intérêts
            s’ajoutent au solde. La ligne de prudence retenue ici est {formatPct(SAFETY_RATIO * 100, 0)} de
            la valeur de rachat illustrée.
          </p>
        </div>

        <div className="mt-8 rounded-2xl border border-prestige-beige bg-white p-5 shadow-ia md:p-8">
          <div className="grid gap-6 lg:grid-cols-12">
            <div className="space-y-5 lg:col-span-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">Contrat</p>
                <div className="mt-2 flex flex-wrap gap-2">
                  {SCENARIOS.map((scenario) => (
                    <button
                      key={scenario.id}
                      type="button"
                      onClick={() => setFocusId(scenario.id)}
                      className={`rounded-full px-3 py-1.5 text-sm font-semibold ${
                        focusId === scenario.id ? 'bg-dark text-white' : 'bg-[#f4f1eb] text-dark'
                      }`}
                    >
                      {scenario.label}
                    </button>
                  ))}
                </div>
              </div>
              <label className="block">
                <span className="flex items-baseline justify-between text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">
                  Ouverture du prêt
                  <span className="tabular-nums normal-case tracking-normal text-dark">
                    Année {loanStart} · {startRow ? `${startRow.age} ans` : '—'}
                  </span>
                </span>
                <input
                  type="range"
                  min={1}
                  max={40}
                  value={loanStart}
                  onChange={(event) => setLoanStart(Number(event.target.value))}
                  className="mt-3 w-full accent-[#064dd9]"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">Montant</span>
                <input
                  type="number"
                  min={0}
                  step={10000}
                  value={loanAmount}
                  onChange={(event) => setLoanAmount(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-prestige-beige bg-[#f4f1eb] px-3 py-2.5 tabular-nums outline-none focus:border-primary"
                />
              </label>
              <label className="block">
                <span className="text-xs font-semibold uppercase tracking-[0.14em] text-prestige-taupe">Remboursement annuel</span>
                <input
                  type="number"
                  min={0}
                  step={1000}
                  value={repayment}
                  onChange={(event) => setRepayment(Number(event.target.value))}
                  className="mt-2 w-full rounded-xl border border-prestige-beige bg-[#f4f1eb] px-3 py-2.5 tabular-nums outline-none focus:border-primary"
                />
              </label>
              <div className={`rounded-xl px-4 py-3 text-sm ${projection.bank ? 'bg-emerald-50 text-emerald-950' : 'bg-amber-50 text-amber-950'}`}>
                <p className="font-semibold">
                  {loanAmount > 0
                    ? (projection.bank ? `Collatéral bancaire · ${formatPct(projection.rate * 100)}` : `Avance de l’assureur · ${formatPct(projection.rate * 100)}`)
                    : 'Aucun prêt illustré'}
                </p>
                <p className="mt-1 text-xs leading-relaxed opacity-80">
                  Valeur de rachat à l’ouverture&nbsp;: {formatCad(projection.csvAtStart)}.
                </p>
              </div>
            </div>

            <div className="lg:col-span-8">
              {projection.breach && (
                <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-950">
                  À {projection.breach.age} ans, le solde ({formatCad(projection.breach.balance, 0)}) dépasse
                  {' '}{formatPct(SAFETY_RATIO * 100, 0)} de la valeur de rachat illustrée
                  ({formatCad(projection.breach.ceiling, 0)}).
                </div>
              )}
              <dl className="mb-4 grid grid-cols-2 gap-3 md:grid-cols-4">
                {[
                  ['Primes cumulées', projection.last ? formatCad(projection.last.cumulative, 0) : '—'],
                  ['Rachat illustré', projection.last ? formatCad(projection.last.csv, 0) : '—'],
                  ['Solde du prêt', projection.last ? formatCad(projection.last.balance, 0) : '—'],
                  ['Décès illustré', projection.last ? formatCad(projection.last.death, 0) : '—'],
                ].map(([label, value]) => (
                  <div key={label} className="rounded-xl bg-[#f4f1eb] px-3 py-3">
                    <dt className="text-[11px] uppercase tracking-[0.12em] text-prestige-taupe">{label}</dt>
                    <dd className="mt-1 font-heading text-lg tabular-nums">{value}</dd>
                  </div>
                ))}
              </dl>
              <p className="mb-2 text-xs text-prestige-taupe">
                Chiffres à {horizon} ans, {focus.label}. Le solde du prêt culmine à {formatCad(projection.maxBalance, 0)}.
              </p>
              <LeverageChart projection={projection} scenario={focus} />
            </div>
          </div>
        </div>

        <div className="mt-8">
          <div className="flex items-center justify-between gap-4">
            <h3 className="font-heading text-2xl">{focus.label} · année par année</h3>
            <button
              type="button"
              onClick={() => setFullTable((value) => !value)}
              className="text-sm font-semibold text-primary print:hidden"
            >
              {fullTable ? 'Âges charnières' : 'Toutes les années'}
            </button>
          </div>
          <div className="mt-4 overflow-x-auto rounded-2xl border border-prestige-beige bg-white">
            <table className="w-full min-w-[880px] border-collapse text-sm">
              <thead className="bg-[#f4f1eb] text-left text-xs uppercase tracking-[0.12em] text-prestige-taupe">
                <tr>
                  {['Âge', 'Prime', 'Cumul', 'Rachat garanti', 'Rachat illustré', 'Décès', 'Rendement', 'Rachat net'].map((heading) => (
                    <th key={heading} className="px-3 py-3 font-semibold">{heading}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {detailRows.map((row) => (
                  <tr key={row.year} className="border-t border-prestige-beige/80">
                    <td className="px-3 py-2.5 tabular-nums font-semibold">{row.age}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCad(row.premium)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCad(row.cumulative, 0)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCad(row.csvG, 0)}</td>
                    <td className="px-3 py-2.5 tabular-nums font-semibold">{formatCad(row.csv, 0)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCad(row.death, 0)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatPct(row.irr)}</td>
                    <td className="px-3 py-2.5 tabular-nums">{formatCad(row.net, 0)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      <section id="conditions" className="scroll-mt-32 border-t border-prestige-beige bg-white">
        <div className="container-max px-4 py-16 md:px-8 md:py-20">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-primary">Avant d’aller plus loin</p>
          <h2 className="mt-3 max-w-3xl font-heading text-3xl md:text-4xl">Ce qui doit être vrai pour que le dossier tienne</h2>
          <div className="mt-10 grid gap-x-12 gap-y-8 md:grid-cols-2">
            {[
              ['Un surplus qui dure', 'Un rachat forcé dans les premières années casse la stratégie. La valeur est alors inférieure aux primes, et la sortie déclenche l’impôt illustré dans le tableau.'],
              ['Un taux qui peut monter', 'Le prêt collatéral est à taux variable. Si les intérêts capitalisent et que le solde dépasse la marge du prêteur, un remboursement peut être exigé.'],
              ['La déduction pour petite entreprise', 'La croissance interne du contrat n’est pas, en elle-même, un revenu de placement annuel. Le seuil de 50 000 $ se juge sur l’ensemble du revenu de placement de la société, au fédéral comme au Québec.'],
              ['La personne assurée', 'L’âge et la santé fixent le coût de la protection, donc toute la projection. Ces pages sont calibrées à 32 ans. Un autre assuré exige une autre illustration.'],
              ['L’horizon', 'Ce n’est pas un emploi de trésorerie sur cinq ans. Les premières années, la valeur de rachat garantie et la valeur illustrée restent en deçà des primes versées.'],
              ['Holdco ou société opérante', 'Le propriétaire de la police change l’exposition aux créanciers de l’entreprise. C’est une décision juridique, pas un détail de produit.'],
            ].map(([title, body]) => (
              <div key={title} className="border-t border-dark/10 pt-4">
                <h3 className="font-heading text-xl">{title}</h3>
                <p className="mt-2 text-sm leading-relaxed text-dark/75">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <footer className="bg-dark text-white/70">
        <div className="container-max space-y-4 px-4 py-12 text-xs leading-relaxed md:px-8">
          <p className="font-heading text-lg text-white">Pierre-Olivier Caouette</p>
          <p>Conseiller en sécurité financière · iA Groupe financier</p>
          <p>
            Les montants identifiés comme garantis sont ceux du contrat illustré. Tous les autres
            chiffres suivent le barème de participations en vigueur au moment de l’illustration.
            Ce barème peut être modifié. Les taux de {formatPct(BANK_RATE * 100)} et de{' '}
            {formatPct(INSURER_RATE * 100)} sont des hypothèses de lecture, pas des engagements
            d’un prêteur. L’impôt au rachat figurant dans les fichiers correspond à environ 53&nbsp;%
            de l’écart entre la valeur de rachat et le coût de base rajusté&nbsp;: c’est une
            hypothèse de l’illustration, pas le taux de la société.
          </p>
          <p>
            Le traitement du frais de garantie, du compte de dividendes en capital et de la
            déduction pour petite entreprise dépend de la situation réelle de l’entreprise et des
            règles en vigueur. Ce dossier prépare une conversation. Il ne remplace pas le
            comptable, le fiscaliste, ni le conseiller juridique, et il ne constitue pas une
            proposition.
          </p>
        </div>
      </footer>
    </div>
  );
};
