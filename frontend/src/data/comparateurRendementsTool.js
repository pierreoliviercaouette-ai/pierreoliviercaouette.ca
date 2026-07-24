/**
 * Contenu HTML + métadonnées — Comparateur de rendements (outil public).
 * Upsert via scripts/seed_comparateur_rendements.mjs ou Admin.
 */
export const COMPARATEUR_RENDEMENTS_META = {
  slug: 'comparateur-rendements',
  name: 'Comparateur de rendements',
  description:
    'Comparez le rendement de votre portefeuille bancaire à profil égal avec les Portefeuilles Modèles iA (5 ans net).',
  tags: ['Rendement', 'Banque', 'Portefeuilles', 'Comparaison'],
  is_active: true,
  requires_auth: false,
};

export const COMPARATEUR_RENDEMENTS_HTML = `
<div class="intro-box">
  <h2>Comparateur de rendements</h2>
  <p>Entrez le rendement de votre portefeuille (ou utilisez la moyenne bancaire illustrative) et comparez-le, <strong>à profil égal</strong>, aux Portefeuilles Modèles iA (série Classique 75/75, 5&nbsp;ans net).</p>
  <p style="margin-top:0.75rem;font-size:0.9rem;"><a href="/guides/guide-releves-rendements-banques.pdf" target="_blank" rel="noopener">Guide : trouver votre rendement sur votre relevé bancaire (PDF)</a></p>
</div>

<div class="form-section">
  <h3 class="form-title">Votre situation</h3>
  <div class="form-grid">
    <div class="form-row">
      <div class="form-group">
        <label for="profil">Profil de risque</label>
        <select id="profil">
          <option value="prudent">Prudent</option>
          <option value="modere">Modéré</option>
          <option value="equilibre" selected>Équilibré</option>
          <option value="croissance">Croissance</option>
          <option value="audacieux">Audacieux</option>
        </select>
        <small>Comparez toujours à profil égal</small>
      </div>
      <div class="form-group">
        <label for="source_banque">Rendement bancaire à utiliser</label>
        <select id="source_banque">
          <option value="moyenne" selected>Moyenne illustrative des banques</option>
          <option value="perso">Mon rendement personnel (%)</option>
        </select>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="rendement_perso">Mon rendement 5 ans annualisé (%)</label>
        <input type="number" id="rendement_perso" placeholder="6.3" step="0.1" min="0" max="40">
        <small>Si « Mon rendement personnel » est choisi</small>
      </div>
      <div class="form-group">
        <label for="capital">Capital investi aujourd'hui ($)</label>
        <input type="number" id="capital" placeholder="50000" step="1000" min="0">
        <small>Pour illustrer l'écart en dollars sur 5 à 20 ans</small>
      </div>
    </div>
    <div class="form-row">
      <div class="form-group">
        <label for="horizon">Horizon (années)</label>
        <select id="horizon">
          <option value="5" selected>5 ans</option>
          <option value="10">10 ans</option>
          <option value="15">15 ans</option>
          <option value="20">20 ans</option>
        </select>
      </div>
      <div class="form-group">
        <label for="versement">Versement annuel additionnel ($)</label>
        <input type="number" id="versement" placeholder="0" step="500" min="0">
        <small>Optionnel — cotisations futures estimées</small>
      </div>
    </div>
  </div>
</div>

<div class="results-box">
  <h3>Comparaison à profil égal</h3>
  <div class="result-item">
    <span>Profil</span>
    <span id="r_profil">—</span>
  </div>
  <div class="result-item">
    <span>Moyenne banques (5 ans)</span>
    <span id="r_banque_pct">0</span>%
  </div>
  <div class="result-item">
    <span>Rendement utilisé (banque / vous)</span>
    <span id="r_utilise_pct">0</span>%
  </div>
  <div class="result-item main">
    <span>Portefeuille Modèle iA (5 ans net)</span>
    <span id="r_ia_pct">0</span>%
  </div>
  <div class="result-item">
    <span>Écart de rendement</span>
    <span id="r_ecart_pct">0</span> pts
  </div>
</div>

<div class="results-box" style="margin-top:1.25rem;">
  <h3>Projection illustrative</h3>
  <div class="result-item">
    <span>Valeur estimée — scénario banque / vous</span>
    <span id="r_valeur_banque">0 $</span>
  </div>
  <div class="result-item main">
    <span>Valeur estimée — scénario modèle iA</span>
    <span id="r_valeur_ia">0 $</span>
  </div>
  <div class="result-item">
    <span>Écart estimé sur l'horizon</span>
    <span id="r_ecart_dollars">0 $</span>
  </div>
  <p id="r_resume" style="margin-top:1rem;font-size:0.95rem;line-height:1.5;"></p>
</div>

<div class="intro-box" style="margin-top:1.25rem;">
  <p style="font-size:0.85rem;color:#64748b;margin:0;">
    Illustration seulement. Moyennes bancaires : portefeuilles de succursale / solutions clés en main (séries grand public).
    iA : rendements nets annualisés 5 ans au 30 juin 2026, série Classique 75/75.
    Les rendements passés ne garantissent pas les rendements futurs. Le bon profil dépend de votre tolérance au risque et de vos objectifs.
    <a href="/rendez-vous">Réserver 15 minutes</a> pour une analyse personnalisée.
  </p>
</div>
`;
