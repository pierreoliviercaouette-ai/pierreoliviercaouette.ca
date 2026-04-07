/**
 * Illustration des paliers de remerciement : coffrets dont la taille augmente (SVG).
 * Les hauteurs suivent chartValue ; le coffret Privilège reste indicatif si non monétaire.
 */
const VIEW_W = 880;
const VIEW_H = 380;
const BASE_Y = 302;
const MIN_H = 48;
const MAX_H = 198;
const MAX_VAL = 300;

function barHeight(chartValue) {
  return MIN_H + (chartValue / MAX_VAL) * (MAX_H - MIN_H);
}

function tierCenterX(index) {
  const pad = 56;
  const usable = VIEW_W - pad * 2;
  const step = usable / 5;
  return pad + step * index + step / 2;
}

export function ReferralTiersInfographic({ tiers, className = '' }) {
  const boxes = tiers.map((t, i) => {
    const h = barHeight(t.chartValue);
    const cx = tierCenterX(i);
    const w = 108;
    const x = cx - w / 2;
    const y = BASE_Y - h;
    return { ...t, h, x, y, w, cx, i };
  });

  const curvePoints = boxes.map((b) => ({ x: b.cx, y: b.y - 8 }));
  let pathD = '';
  curvePoints.forEach((p, i) => {
    pathD += i === 0 ? `M ${p.x} ${p.y}` : ` L ${p.x} ${p.y}`;
  });

  return (
    <svg
      className={className}
      viewBox={`0 0 ${VIEW_W} ${VIEW_H}`}
      xmlns="http://www.w3.org/2000/svg"
      role="img"
      aria-labelledby="referral-tiers-svg-title"
    >
      <title id="referral-tiers-svg-title">
        Paliers de remerciement : récompenses de plus en plus importantes du Bronze au Privilège
      </title>

      <defs>
        <linearGradient id="bg-soft" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#fdfbf7" />
          <stop offset="100%" stopColor="#f1f5f9" />
        </linearGradient>
        <filter id="soft-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="8" stdDeviation="10" floodOpacity="0.12" />
        </filter>
        <filter id="ribbon-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feDropShadow dx="0" dy="2" stdDeviation="3" floodColor="#ffffff" floodOpacity="0.35" />
        </filter>

        {tiers.map((t) => (
          <linearGradient key={`grad-${t.name}`} id={`box-grad-${t.name}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor={t.highlight} />
            <stop offset="100%" stopColor={t.fill} />
          </linearGradient>
        ))}
      </defs>

      <rect x="0" y="0" width={VIEW_W} height={VIEW_H} rx="16" fill="url(#bg-soft)" />

      {/* Courbe de progression au-dessus des coffrets */}
      <path
        d={pathD}
        fill="none"
        stroke="#c9a227"
        strokeWidth="3"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeDasharray="1 0"
        opacity="0.85"
      />
      {curvePoints.map((p, i) => (
        <circle key={`node-${i}`} cx={p.x} cy={p.y} r="6" fill="#c9a227" stroke="#fff" strokeWidth="2" />
      ))}

      {boxes.map((b) => (
        <g key={b.name} filter="url(#soft-shadow)">
          {/* Socle */}
          <rect
            x={b.cx - 58}
            y={BASE_Y - 6}
            width={116}
            height={8}
            rx="4"
            fill="#01233f"
            opacity="0.35"
          />
          {/* Coffret */}
          <rect
            x={b.x}
            y={b.y}
            width={b.w}
            height={b.h}
            rx="14"
            fill={`url(#box-grad-${b.name})`}
            stroke="rgba(255,255,255,0.35)"
            strokeWidth="1"
          />
          {/* Ruban vertical */}
          <rect
            x={b.cx - 5}
            y={b.y + 12}
            width={10}
            height={Math.max(b.h - 24, 20)}
            rx="2"
            fill="rgba(255,255,255,0.45)"
            filter="url(#ribbon-glow)"
          />
          {/* Ruban horizontal */}
          <rect
            x={b.x + 14}
            y={b.y + b.h / 2 - 5}
            width={b.w - 28}
            height={10}
            rx="2"
            fill="rgba(255,255,255,0.35)"
          />
          {/* Montant / libellé (2 lignes si coffret) */}
          <text
            x={b.cx}
            y={b.name === 'Privilège' ? b.y + b.h / 2 - 4 : b.y + b.h / 2 + 5}
            textAnchor="middle"
            fill="white"
            fontSize={b.name === 'Privilège' ? 12 : 13}
            fontWeight="700"
            fontFamily="Georgia, 'Times New Roman', serif"
            style={{ textShadow: '0 1px 2px rgba(0,0,0,0.25)' }}
          >
            {b.name === 'Privilège'
              ? [
                  <tspan key="coffret" x={b.cx} dy="0">
                    Coffret
                  </tspan>,
                  <tspan key="priv" x={b.cx} dy="15">
                    Privilège
                  </tspan>,
                ]
              : b.reward}
          </text>
        </g>
      ))}

      {/* Légendes sous les coffrets */}
      {boxes.map((b) => (
        <g key={`lbl-${b.name}`}>
          <text
            x={b.cx}
            y={BASE_Y + 22}
            textAnchor="middle"
            fill="#0f172a"
            fontSize="13"
            fontWeight="700"
            fontFamily="Georgia, 'Times New Roman', serif"
          >
            {b.name}
          </text>
          <text x={b.cx} y={BASE_Y + 40} textAnchor="middle" fill="#64748b" fontSize="11" fontFamily="system-ui, sans-serif">
            {b.threshold} pts cumulés
          </text>
        </g>
      ))}
    </svg>
  );
}
