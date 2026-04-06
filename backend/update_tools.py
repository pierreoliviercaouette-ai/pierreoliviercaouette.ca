"""
Script to update all financial tools with professional HTML templates
"""
import asyncio
from motor.motor_asyncio import AsyncIOMotorClient

# Tool HTML templates
TOOLS_DATA = [
    {
        "slug": "simulateur-reer",
        "name": "Simulateur REER Québec 2026",
        "description": "Calculez votre économie d'impôt avec les taux fédéraux et provinciaux actuels",
        "icon": "📊",
        "tags": ["REER", "Impôt", "Épargne", "Retraite"],
        "html_content": '''
<div class="intro-box">
    <h2>Simulateur REER Québec 2026</h2>
    <p>Calculez précisément votre économie d'impôt selon les tables d'imposition fédérale et québécoise en vigueur, incluant l'abattement du Québec de 16.5%.</p>
</div>

<div class="form-section">
    <h3 class="form-title">💼 Votre situation</h3>
    <div class="form-grid">
        <div class="form-row">
            <div class="form-group">
                <label for="revenu">Revenu annuel brut ($)</label>
                <input type="number" id="revenu" placeholder="75000">
                <small>Avant impôts et déductions</small>
            </div>
            <div class="form-group">
                <label for="cotisation">Cotisation REER prévue ($)</label>
                <input type="number" id="cotisation" placeholder="10000">
                <small>Max 18% du revenu ou <span id="droits_max">0 $</span> (2026)</small>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="situation">Situation familiale</label>
                <select id="situation">
                    <option value="celibataire">Célibataire</option>
                    <option value="couple">En couple</option>
                    <option value="monoparental">Famille monoparentale</option>
                </select>
            </div>
            <div class="form-group">
                <label for="enfants">Nombre d'enfants à charge</label>
                <select id="enfants">
                    <option value="0">0</option>
                    <option value="1">1</option>
                    <option value="2">2</option>
                    <option value="3">3+</option>
                </select>
            </div>
        </div>
    </div>
</div>

<div class="results-box">
    <h3>💰 Votre économie d'impôt</h3>
    
    <div class="result-item">
        <span>Cotisation REER</span>
        <span id="r_cotisation">0 $</span>
    </div>
    <div class="result-item">
        <span>Taux marginal combiné</span>
        <span id="r_taux">0</span>%
    </div>
    <div class="result-item main">
        <span>Économie d'impôt totale</span>
        <span id="r_economie">0 $</span>
    </div>
    
    <div class="tax-detail">
        <h4>Détail de l'économie</h4>
        <div class="tax-row">
            <span>Impôt fédéral économisé</span>
            <span id="r_federal">0 $</span>
        </div>
        <div class="tax-row">
            <span>Impôt Québec économisé</span>
            <span id="r_quebec">0 $</span>
        </div>
        <div class="tax-row">
            <span>Abattement Québec (16.5%)</span>
            <span id="r_abattement">0 $</span>
        </div>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Entrez vos informations pour voir votre économie d'impôt personnalisée.
    </div>
</div>
'''
    },
    {
        "slug": "calculateur-hypothecaire",
        "name": "Calculateur hypothécaire complet",
        "description": "Calculez vos paiements avec prime SCHL et tableau d'amortissement",
        "icon": "🏠",
        "tags": ["Hypothèque", "Immobilier", "SCHL"],
        "html_content": '''
<div class="intro-box">
    <h2>Calculateur hypothécaire Québec</h2>
    <p>Calculez vos paiements hypothécaires incluant la prime SCHL si applicable. Visualisez la répartition capital vs intérêts sur la durée de votre prêt.</p>
</div>

<div class="form-section">
    <h3 class="form-title">🏠 Détails du prêt</h3>
    <div class="form-grid">
        <div class="form-row">
            <div class="form-group">
                <label for="prix">Prix de la propriété ($)</label>
                <input type="number" id="prix" placeholder="450000">
            </div>
            <div class="form-group">
                <label for="mise">Mise de fonds ($)</label>
                <input type="number" id="mise" placeholder="90000">
                <small>Minimum 5% (ou 20% pour éviter SCHL)</small>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="taux">Taux d'intérêt annuel (%)</label>
                <input type="number" id="taux" placeholder="5.5" step="0.01">
            </div>
            <div class="form-group">
                <label for="amortissement">Amortissement</label>
                <select id="amortissement">
                    <option value="15">15 ans</option>
                    <option value="20">20 ans</option>
                    <option value="25" selected>25 ans</option>
                    <option value="30">30 ans</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="frequence">Fréquence de paiement</label>
                <select id="frequence">
                    <option value="12" selected>Mensuel</option>
                    <option value="26">Aux 2 semaines</option>
                    <option value="52">Hebdomadaire</option>
                    <option value="24">Bimensuel</option>
                </select>
            </div>
            <div class="form-group">
                <label for="schl">Inclure assurance SCHL?</label>
                <select id="schl">
                    <option value="auto" selected>Automatique</option>
                    <option value="oui">Oui</option>
                    <option value="non">Non</option>
                </select>
            </div>
        </div>
    </div>
</div>

<div class="results-box">
    <h3>Votre paiement hypothécaire</h3>
    
    <div class="payment-main">
        <div class="amount" id="paiement">0 $</div>
        <div class="period" id="periode">par mois</div>
    </div>
    
    <div class="stats-grid">
        <div class="stat-card">
            <div class="label">Montant emprunté</div>
            <div class="value" id="montant_pret">0 $</div>
        </div>
        <div class="stat-card">
            <div class="label">Prime SCHL</div>
            <div class="value" id="prime_schl">0 $</div>
        </div>
        <div class="stat-card">
            <div class="label">Mise de fonds %</div>
            <div class="value" id="mise_pct">0%</div>
        </div>
    </div>
    
    <div class="cost-breakdown">
        <h4>Coût total sur la durée du prêt</h4>
        <div class="bar-visual">
            <div class="bar-capital" id="bar_cap" style="width: 50%"></div>
            <div class="bar-interet" id="bar_int" style="width: 50%"></div>
        </div>
        <div class="bar-legend">
            <span>🟢 Capital</span>
            <span>🔴 Intérêts</span>
        </div>
        <div class="cost-details">
            <div class="cost-row">
                <span>Capital remboursé</span>
                <span id="total_capital">0 $</span>
            </div>
            <div class="cost-row">
                <span>Intérêts payés</span>
                <span id="total_interets">0 $</span>
            </div>
            <div class="cost-row total">
                <span>Coût total</span>
                <span id="cout_total">0 $</span>
            </div>
        </div>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Entrez les détails de votre prêt pour voir vos paiements.
    </div>
</div>
'''
    },
    {
        "slug": "simulateur-reee",
        "name": "Simulateur REEE Québec 2026",
        "description": "Maximisez les subventions SCEE et IQEE pour l'éducation de vos enfants",
        "icon": "🎓",
        "tags": ["REEE", "Éducation", "Subventions", "SCEE", "IQEE"],
        "html_content": '''
<div class="intro-box">
    <h2>Simulateur REEE Québec 2026</h2>
    <p>Calculez les subventions fédérales (SCEE) et québécoises (IQEE) auxquelles vous avez droit. Les familles à revenu modeste peuvent recevoir jusqu'à 60% de bonification!</p>
</div>

<div class="form-section">
    <h3 class="form-title">👨‍👩‍👧‍👦 Votre situation</h3>
    <div class="form-grid">
        <div class="form-row">
            <div class="form-group">
                <label for="cotisation">Cotisation annuelle prévue ($)</label>
                <input type="number" id="cotisation" placeholder="2500">
                <small>Maximum pour subventions: 2 500$/enfant/an</small>
            </div>
            <div class="form-group">
                <label for="nb_enfants">Nombre d'enfants bénéficiaires</label>
                <select id="nb_enfants">
                    <option value="1">1 enfant</option>
                    <option value="2">2 enfants</option>
                    <option value="3">3 enfants</option>
                    <option value="4">4+ enfants</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="revenu">Revenu familial net ($)</label>
                <input type="number" id="revenu" placeholder="80000">
                <small>Pour déterminer les subventions supplémentaires</small>
            </div>
            <div class="form-group">
                <label for="droits_inutilises">Droits de cotisation inutilisés ($)</label>
                <input type="number" id="droits_inutilises" placeholder="0">
                <small>Optionnel - pour rattrapage</small>
            </div>
        </div>
    </div>
</div>

<div class="results-box">
    <h3>💰 Vos subventions annuelles</h3>
    
    <div class="subvention-cards">
        <div class="sub-card federal">
            <div class="flag">🍁</div>
            <div class="name">SCEE (Fédéral)</div>
            <div class="amount" id="scee">0 $</div>
            <small>Base: <span id="scee_base">0 $</span> + Bonus: <span id="scee_bonus">0 $</span></small>
        </div>
        <div class="sub-card quebec">
            <div class="flag">⚜️</div>
            <div class="name">IQEE (Québec)</div>
            <div class="amount" id="iqee">0 $</div>
            <small>Base: <span id="iqee_base">0 $</span> + Bonus: <span id="iqee_bonus">0 $</span></small>
        </div>
    </div>
    
    <div class="total-row">
        <span>Total des subventions annuelles</span>
        <span class="value" id="total_sub">0 $</span>
    </div>
    
    <div class="info-box">
        <p>📈 Rendement immédiat des subventions: <strong id="rendement_sub">0</strong>% sur votre cotisation!</p>
    </div>
    
    <div class="projection-section">
        <h4>📊 Projection sur 18 ans (rendement 5%/an)</h4>
        <div class="projection-grid">
            <div class="proj-item">
                <span class="label">Vos cotisations</span>
                <span class="value" id="proj_cotis">0 $</span>
            </div>
            <div class="proj-item">
                <span class="label">Subventions reçues</span>
                <span class="value" id="proj_sub">0 $</span>
            </div>
            <div class="proj-item">
                <span class="label">Rendement accumulé</span>
                <span class="value" id="proj_rend">0 $</span>
            </div>
            <div class="proj-item total">
                <span class="label">Valeur totale projetée</span>
                <span class="value" id="proj_total">0 $</span>
            </div>
        </div>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Entrez vos informations pour calculer vos subventions.
    </div>
</div>
'''
    },
    {
        "slug": "calculateur-assurance-vie-complet",
        "name": "Calculateur d'assurance vie",
        "description": "Évaluez vos besoins réels en protection pour votre famille",
        "icon": "🛡️",
        "tags": ["Assurance", "Protection", "Famille"],
        "html_content": '''
<div class="intro-box">
    <h2>Calculateur d'assurance vie</h2>
    <p>Évaluez le montant d'assurance vie nécessaire pour protéger votre famille en cas de décès. Ce calcul tient compte de vos dettes, du remplacement de revenu, des études des enfants et de vos actifs existants.</p>
</div>

<div class="section dette">
    <div class="section-header">
        <div class="section-icon">💳</div>
        <h3>1. Dettes à rembourser</h3>
    </div>
    <div class="form-grid">
        <div class="input-row">
            <label>Solde hypothécaire</label>
            <input type="number" id="hypotheque" placeholder="0">
        </div>
        <div class="input-row">
            <label>Prêt automobile</label>
            <input type="number" id="pret_auto" placeholder="0">
        </div>
        <div class="input-row">
            <label>Cartes de crédit</label>
            <input type="number" id="cartes" placeholder="0">
        </div>
        <div class="input-row">
            <label>Marge de crédit</label>
            <input type="number" id="marge_credit" placeholder="0">
        </div>
        <div class="input-row">
            <label>Autres dettes</label>
            <input type="number" id="autres_dettes" placeholder="0">
        </div>
    </div>
    <div class="subtotal">
        <span>Total des dettes</span>
        <span id="total_dettes">0 $</span>
    </div>
</div>

<div class="section revenu">
    <div class="section-header">
        <div class="section-icon">💼</div>
        <h3>2. Remplacement de revenu</h3>
    </div>
    <div class="form-grid">
        <div class="input-row">
            <label>Votre revenu net annuel</label>
            <input type="number" id="revenu_net" placeholder="60000">
        </div>
        <div class="input-row">
            <label>% du revenu à remplacer</label>
            <input type="number" id="pct_remplacer" placeholder="70" max="100">
        </div>
        <div class="input-row">
            <label>Nombre d'années de protection</label>
            <input type="number" id="nb_annees" placeholder="10">
        </div>
        <div class="input-row">
            <label>Revenu du conjoint (si applicable)</label>
            <input type="number" id="revenu_conjoint" placeholder="0">
        </div>
    </div>
    <div class="subtotal">
        <span>Besoin de remplacement</span>
        <span id="total_revenu">0 $</span>
    </div>
</div>

<div class="section heritage">
    <div class="section-header">
        <div class="section-icon">🎓</div>
        <h3>3. Éducation & Legs</h3>
    </div>
    <div class="form-grid">
        <div class="input-row">
            <label>Coût des études par enfant</label>
            <input type="number" id="etudes" placeholder="30000">
        </div>
        <div class="input-row">
            <label>Nombre d'enfants</label>
            <input type="number" id="nb_enfants" placeholder="0">
        </div>
        <div class="input-row">
            <label>Fonds d'urgence souhaité</label>
            <input type="number" id="urgence" placeholder="0">
        </div>
        <div class="input-row">
            <label>Frais funéraires</label>
            <input type="number" id="funerailles" placeholder="15000">
        </div>
        <div class="input-row">
            <label>Legs désiré</label>
            <input type="number" id="legs" placeholder="0">
        </div>
    </div>
    <div class="subtotal">
        <span>Total éducation & legs</span>
        <span id="total_heritage">0 $</span>
    </div>
</div>

<div class="section actifs">
    <div class="section-header">
        <div class="section-icon">🏦</div>
        <h3>4. Actifs existants (à déduire)</h3>
    </div>
    <div class="form-grid">
        <div class="input-row">
            <label>Assurance vie actuelle</label>
            <input type="number" id="av_actuelle" placeholder="0">
        </div>
        <div class="input-row">
            <label>Assurance collective (travail)</label>
            <input type="number" id="av_groupe" placeholder="0">
        </div>
        <div class="input-row">
            <label>Épargnes liquides</label>
            <input type="number" id="epargnes" placeholder="0">
        </div>
    </div>
    <div class="subtotal">
        <span>Total des actifs</span>
        <span id="total_actifs">0 $</span>
    </div>
</div>

<div class="results-box">
    <h3>🛡️ Votre besoin d'assurance vie</h3>
    
    <div class="result-breakdown">
        <div class="result-card dette">
            <div class="label">Dettes</div>
            <div class="value" id="r_dettes">0 $</div>
        </div>
        <div class="result-card revenu">
            <div class="label">Revenu</div>
            <div class="value" id="r_revenu">0 $</div>
        </div>
        <div class="result-card heritage">
            <div class="label">Éducation & Legs</div>
            <div class="value" id="r_heritage">0 $</div>
        </div>
    </div>
    
    <div class="result-item">
        <span>Besoin brut</span>
        <span id="besoin_brut">0 $</span>
    </div>
    <div class="result-item">
        <span>Moins: Actifs existants</span>
        <span id="r_actifs">- 0 $</span>
    </div>
    <div class="result-item main">
        <span>Besoin net d'assurance</span>
        <span id="r_total">0 $</span>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Remplissez les sections ci-dessus pour calculer votre besoin.
    </div>
</div>
'''
    },
    {
        "slug": "fonds-urgence",
        "name": "Calculateur de fonds d'urgence",
        "description": "Déterminez le montant idéal pour votre coussin de sécurité",
        "icon": "🆘",
        "tags": ["Épargne", "Urgence", "Sécurité"],
        "html_content": '''
<div class="intro-box">
    <h2>Calculateur de fonds d'urgence</h2>
    <p>Déterminez le montant idéal de votre fonds d'urgence basé sur vos dépenses essentielles et votre situation personnelle. La recommandation générale est de 3 à 6 mois de dépenses.</p>
</div>

<div class="form-section">
    <h3 class="form-title">💵 Dépenses mensuelles essentielles</h3>
    <div class="form-grid">
        <div class="input-row">
            <label>Logement (loyer/hypothèque, taxes, assurance)</label>
            <input type="number" id="logement" placeholder="1500">
        </div>
        <div class="input-row">
            <label>Alimentation</label>
            <input type="number" id="alimentation" placeholder="600">
        </div>
        <div class="input-row">
            <label>Transport (auto, essence, transport en commun)</label>
            <input type="number" id="transport" placeholder="400">
        </div>
        <div class="input-row">
            <label>Assurances (vie, maladie)</label>
            <input type="number" id="assurances" placeholder="200">
        </div>
        <div class="input-row">
            <label>Paiements de dettes minimums</label>
            <input type="number" id="dettes" placeholder="300">
        </div>
        <div class="input-row">
            <label>Autres essentiels (téléphone, internet, etc.)</label>
            <input type="number" id="autres" placeholder="200">
        </div>
    </div>
    <div class="subtotal">
        <span>Dépenses mensuelles totales</span>
        <span id="depenses_mois">0 $</span>
    </div>
</div>

<div class="form-section">
    <h3 class="form-title">📋 Votre situation</h3>
    <div class="form-grid">
        <div class="form-row">
            <div class="form-group">
                <label for="stabilite">Stabilité d'emploi</label>
                <select id="stabilite">
                    <option value="stable">Stable (permanent, gouvernement)</option>
                    <option value="moyen">Moyen (PME, privé)</option>
                    <option value="variable">Variable (contractuel, saisonnier)</option>
                    <option value="autonome">Travailleur autonome</option>
                </select>
            </div>
            <div class="form-group">
                <label for="personnes">Personnes à charge</label>
                <select id="personnes">
                    <option value="1">Moi seulement</option>
                    <option value="2">2 personnes</option>
                    <option value="3">3 personnes</option>
                    <option value="4">4+ personnes</option>
                </select>
            </div>
        </div>
        <div class="form-row">
            <div class="form-group full-width">
                <label for="epargne_actuelle">Épargne d'urgence actuelle ($)</label>
                <input type="number" id="epargne_actuelle" placeholder="0">
            </div>
        </div>
    </div>
</div>

<div class="results-box">
    <h3>🎯 Votre objectif de fonds d'urgence</h3>
    
    <div class="result-main">
        <div class="label">Montant recommandé</div>
        <div class="range" id="montant_range">0 $ - 0 $</div>
        <small id="mois_recommandes">0 mois de dépenses</small>
    </div>
    
    <div class="progress-section">
        <div class="progress-header">
            <span>Votre progression</span>
            <span id="epargne_pct">0%</span>
        </div>
        <div class="progress-bar">
            <div class="progress-fill" id="progress_bar"></div>
        </div>
        <div class="progress-details">
            <span>Actuel: <span id="epargne_actuelle_display">0 $</span></span>
            <span>Objectif: <span id="objectif_moyen">0 $</span></span>
        </div>
    </div>
    
    <div class="result-item">
        <span>Montant à épargner</span>
        <span id="epargne_restant">0 $</span>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Entrez vos dépenses pour calculer votre objectif.
    </div>
</div>
'''
    },
    {
        "slug": "comparateur-reer-celi",
        "name": "Comparateur REER vs CELI",
        "description": "Découvrez quelle option est la plus avantageuse pour vous",
        "icon": "⚖️",
        "tags": ["REER", "CELI", "Comparaison", "Épargne"],
        "html_content": '''
<div class="intro-box">
    <h2>Comparateur REER vs CELI</h2>
    <p>Comparez les deux véhicules d'épargne en tenant compte de votre taux d'imposition actuel et prévu à la retraite. Le résultat dépend de votre situation fiscale personnelle.</p>
</div>

<div class="form-section">
    <h3 class="form-title">📊 Vos paramètres</h3>
    <div class="form-grid">
        <div class="form-row">
            <div class="form-group">
                <label for="revenu_actuel">Revenu annuel actuel ($)</label>
                <input type="number" id="revenu_actuel" placeholder="75000">
            </div>
            <div class="form-group">
                <label for="montant">Montant à investir ($)</label>
                <input type="number" id="montant" placeholder="10000">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="revenu_retraite">Revenu prévu à la retraite ($)</label>
                <input type="number" id="revenu_retraite" placeholder="50000">
                <small>Incluant RRQ, PSV et retraits de placements</small>
            </div>
            <div class="form-group">
                <label for="horizon">Horizon de placement (années)</label>
                <input type="number" id="horizon" placeholder="20">
            </div>
        </div>
        <div class="form-row">
            <div class="form-group">
                <label for="rendement">Rendement annuel prévu (%)</label>
                <input type="number" id="rendement" placeholder="5" step="0.5">
            </div>
            <div class="form-group">
                <label for="reinvestir">Réinvestir le remboursement REER?</label>
                <select id="reinvestir">
                    <option value="oui">Oui, dans le REER</option>
                    <option value="non">Non</option>
                </select>
            </div>
        </div>
    </div>
</div>

<div class="comparison">
    <div class="option-card reer">
        <h3>REER</h3>
        <div class="stat-row">
            <span>Cotisation</span>
            <span class="value" id="reer_cotis">0 $</span>
        </div>
        <div class="stat-row">
            <span>Remboursement d'impôt</span>
            <span class="value" id="reer_remb">0 $</span>
        </div>
        <div class="stat-row">
            <span>Taux marginal actuel</span>
            <span class="value" id="reer_taux_act">0%</span>
        </div>
        <div class="stat-row">
            <span>Taux marginal retraite</span>
            <span class="value" id="reer_taux_ret">0%</span>
        </div>
        <div class="final-value">
            <div class="label">Valeur nette après impôt</div>
            <div class="amount" id="reer_final">0 $</div>
        </div>
    </div>
    
    <div class="option-card celi">
        <h3>CELI</h3>
        <div class="stat-row">
            <span>Cotisation</span>
            <span class="value" id="celi_cotis">0 $</span>
        </div>
        <div class="stat-row">
            <span>Remboursement d'impôt</span>
            <span class="value">0 $</span>
        </div>
        <div class="stat-row">
            <span>Impôt au retrait</span>
            <span class="value">0 $</span>
        </div>
        <div class="stat-row">
            <span>Flexibilité</span>
            <span class="value">✓ Totale</span>
        </div>
        <div class="final-value">
            <div class="label">Valeur nette (libre d'impôt)</div>
            <div class="amount" id="celi_final">0 $</div>
        </div>
    </div>
</div>

<div class="verdict" id="verdict_box">
    <h4 id="verdict_titre">Entrez vos informations</h4>
    <p id="verdict_texte">Le résultat de la comparaison s'affichera ici.</p>
</div>
'''
    },
    {
        "slug": "valeur-nette",
        "name": "Calculateur de valeur nette",
        "description": "Faites le bilan complet de votre patrimoine",
        "icon": "💎",
        "tags": ["Patrimoine", "Actifs", "Passifs", "Bilan"],
        "html_content": '''
<div class="intro-box">
    <h2>Calculateur de valeur nette</h2>
    <p>Calculez votre valeur nette en faisant la différence entre vos actifs (ce que vous possédez) et vos passifs (ce que vous devez). C'est la mesure la plus importante de votre santé financière.</p>
</div>

<div class="section actifs">
    <div class="section-header">
        <div class="section-icon">📈</div>
        <h3>Actifs (ce que vous possédez)</h3>
    </div>
    
    <div class="category-title">Liquidités</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Compte chèque</label>
            <input type="number" id="cheque" placeholder="0">
        </div>
        <div class="input-row">
            <label>Compte épargne</label>
            <input type="number" id="epargne" placeholder="0">
        </div>
        <div class="input-row">
            <label>CELI</label>
            <input type="number" id="celi" placeholder="0">
        </div>
    </div>
    
    <div class="category-title">Placements</div>
    <div class="form-grid">
        <div class="input-row">
            <label>REER</label>
            <input type="number" id="reer" placeholder="0">
        </div>
        <div class="input-row">
            <label>REEE</label>
            <input type="number" id="reee" placeholder="0">
        </div>
        <div class="input-row">
            <label>Placements non enregistrés</label>
            <input type="number" id="placements" placeholder="0">
        </div>
        <div class="input-row">
            <label>Régime de retraite (valeur)</label>
            <input type="number" id="regime_retraite" placeholder="0">
        </div>
    </div>
    
    <div class="category-title">Biens immobiliers</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Résidence principale (valeur marchande)</label>
            <input type="number" id="residence" placeholder="0">
        </div>
        <div class="input-row">
            <label>Immeuble locatif</label>
            <input type="number" id="locatif" placeholder="0">
        </div>
        <div class="input-row">
            <label>Chalet / Propriété secondaire</label>
            <input type="number" id="chalet" placeholder="0">
        </div>
    </div>
    
    <div class="category-title">Autres actifs</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Véhicules (valeur actuelle)</label>
            <input type="number" id="vehicules" placeholder="0">
        </div>
        <div class="input-row">
            <label>Entreprise / Actions privées</label>
            <input type="number" id="entreprise" placeholder="0">
        </div>
        <div class="input-row">
            <label>Autres actifs</label>
            <input type="number" id="autres_actifs" placeholder="0">
        </div>
    </div>
    
    <div class="subtotal actifs-total">
        <span>Total des actifs</span>
        <span id="total_actifs">0 $</span>
    </div>
</div>

<div class="section passifs">
    <div class="section-header">
        <div class="section-icon">📉</div>
        <h3>Passifs (ce que vous devez)</h3>
    </div>
    
    <div class="category-title">Hypothèques</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Hypothèque résidence principale</label>
            <input type="number" id="hypo_res" placeholder="0">
        </div>
        <div class="input-row">
            <label>Hypothèque immeuble locatif</label>
            <input type="number" id="hypo_loc" placeholder="0">
        </div>
        <div class="input-row">
            <label>Marge hypothécaire</label>
            <input type="number" id="marge_hypo" placeholder="0">
        </div>
    </div>
    
    <div class="category-title">Prêts</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Prêt automobile</label>
            <input type="number" id="pret_auto" placeholder="0">
        </div>
        <div class="input-row">
            <label>Prêt étudiant</label>
            <input type="number" id="pret_etudiant" placeholder="0">
        </div>
        <div class="input-row">
            <label>Marge de crédit personnelle</label>
            <input type="number" id="marge_credit" placeholder="0">
        </div>
    </div>
    
    <div class="category-title">Dettes</div>
    <div class="form-grid">
        <div class="input-row">
            <label>Cartes de crédit</label>
            <input type="number" id="cartes" placeholder="0">
        </div>
        <div class="input-row">
            <label>Autres dettes</label>
            <input type="number" id="autres_dettes" placeholder="0">
        </div>
    </div>
    
    <div class="subtotal passifs-total">
        <span>Total des passifs</span>
        <span id="total_passifs">0 $</span>
    </div>
</div>

<div class="results-box">
    <h3>💎 Votre valeur nette</h3>
    
    <div class="summary-cards">
        <div class="summary-card actifs">
            <div class="label">Actifs</div>
            <div class="value" id="r_actifs">0 $</div>
        </div>
        <div class="summary-card passifs">
            <div class="label">Passifs</div>
            <div class="value" id="r_passifs">0 $</div>
        </div>
        <div class="summary-card ratio">
            <div class="label">Ratio d'endettement</div>
            <div class="value" id="r_ratio">0%</div>
        </div>
    </div>
    
    <div class="valeur-nette-box">
        <div class="label">Valeur nette totale</div>
        <div class="amount" id="valeur_nette">0 $</div>
    </div>
    
    <div class="bar-section">
        <div class="bar">
            <div class="bar-actifs" id="bar_actifs" style="width: 50%"></div>
            <div class="bar-passifs" id="bar_passifs" style="width: 50%"></div>
        </div>
        <div class="bar-legend">
            <span>🟢 Actifs (<span id="pct_actifs">50</span>%)</span>
            <span>🔴 Passifs (<span id="pct_passifs">50</span>%)</span>
        </div>
    </div>
    
    <div class="recommendation" id="conseil">
        💡 Entrez vos actifs et passifs pour calculer votre valeur nette.
    </div>
</div>
'''
    },
    {
        "slug": "budget-mensuel",
        "name": "Budget mensuel complet",
        "description": "Gérez toutes vos finances mensuelles avec analyse fiscale",
        "icon": "📒",
        "tags": ["Budget", "Dépenses", "Revenus", "Épargne"],
        "html_content": '''
<div class="section">
    <div class="section-title"><span>1</span>Revenus</div>
    <div class="input-group">
        <label>Salaire net</label>
        <input type="number" id="salaire" placeholder="0">
    </div>
    <div class="input-group">
        <label>Revenus secondaires</label>
        <input type="number" id="revenus_sec" placeholder="0">
    </div>
    <div class="input-group">
        <label>Allocations familiales</label>
        <input type="number" id="allocations" placeholder="0">
    </div>
    <div class="input-group">
        <label>Autres revenus</label>
        <input type="number" id="autres_rev" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total revenus</span>
        <span id="total_revenus">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>2</span>Logement</div>
    <div class="input-group">
        <label>Loyer / Hypothèque</label>
        <input type="number" id="loyer" placeholder="0">
    </div>
    <div class="input-group">
        <label>Électricité / Chauffage</label>
        <input type="number" id="electricite" placeholder="0">
    </div>
    <div class="input-group">
        <label>Assurance habitation</label>
        <input type="number" id="assur_hab" placeholder="0">
    </div>
    <div class="input-group">
        <label>Taxes municipales / scolaires</label>
        <input type="number" id="taxes" placeholder="0">
    </div>
    <div class="input-group">
        <label>Télécom (internet, téléphone)</label>
        <input type="number" id="telecom" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total logement</span>
        <span id="total_logement">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>3</span>Transport</div>
    <div class="input-group">
        <label>Paiement auto / Location</label>
        <input type="number" id="auto_paiement" placeholder="0">
    </div>
    <div class="input-group">
        <label>Essence</label>
        <input type="number" id="essence" placeholder="0">
    </div>
    <div class="input-group">
        <label>Assurance auto</label>
        <input type="number" id="assur_auto" placeholder="0">
    </div>
    <div class="input-group">
        <label>Entretien / Réparations</label>
        <input type="number" id="entretien_auto" placeholder="0">
    </div>
    <div class="input-group">
        <label>Transport en commun</label>
        <input type="number" id="transport_commun" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total transport</span>
        <span id="total_transport">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>4</span>Alimentation & Quotidien</div>
    <div class="input-group">
        <label>Épicerie</label>
        <input type="number" id="epicerie" placeholder="0">
    </div>
    <div class="input-group">
        <label>Restaurants / Livraison</label>
        <input type="number" id="restaurants" placeholder="0">
    </div>
    <div class="input-group">
        <label>Vêtements</label>
        <input type="number" id="vetements" placeholder="0">
    </div>
    <div class="input-group">
        <label>Soins personnels</label>
        <input type="number" id="soins" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total quotidien</span>
        <span id="total_quotidien">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>5</span>Santé & Assurances</div>
    <div class="input-group">
        <label>Assurance vie</label>
        <input type="number" id="assur_vie" placeholder="0">
    </div>
    <div class="input-group">
        <label>Assurance maladie / Invalidité</label>
        <input type="number" id="assur_maladie" placeholder="0">
    </div>
    <div class="input-group">
        <label>Médicaments</label>
        <input type="number" id="medicaments" placeholder="0">
    </div>
    <div class="input-group">
        <label>Dentiste / Optométriste</label>
        <input type="number" id="dentiste" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total santé</span>
        <span id="total_sante">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>6</span>Remboursement de dettes</div>
    <div class="input-group">
        <label>Cartes de crédit</label>
        <input type="number" id="carte_credit" placeholder="0">
    </div>
    <div class="input-group">
        <label>Prêt étudiant</label>
        <input type="number" id="pret_etudiant" placeholder="0">
    </div>
    <div class="input-group">
        <label>Marge de crédit</label>
        <input type="number" id="marge" placeholder="0">
    </div>
    <div class="input-group">
        <label>Pension alimentaire</label>
        <input type="number" id="pension" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total dettes</span>
        <span id="total_dettes">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>7</span>Épargne</div>
    <div class="input-group">
        <label>REER</label>
        <input type="number" id="reer" placeholder="0">
    </div>
    <div class="input-group">
        <label>CELI</label>
        <input type="number" id="celi" placeholder="0">
    </div>
    <div class="input-group">
        <label>REEE</label>
        <input type="number" id="reee" placeholder="0">
    </div>
    <div class="input-group">
        <label>Fonds d'urgence</label>
        <input type="number" id="urgence" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total épargne</span>
        <span id="total_epargne">0 $</span>
    </div>
</div>

<div class="section">
    <div class="section-title"><span>8</span>Loisirs & Divertissement</div>
    <div class="input-group">
        <label>Abonnements (streaming, gym)</label>
        <input type="number" id="abonnements" placeholder="0">
    </div>
    <div class="input-group">
        <label>Loisirs / Sorties</label>
        <input type="number" id="loisirs" placeholder="0">
    </div>
    <div class="input-group">
        <label>Vacances (mensuel)</label>
        <input type="number" id="vacances" placeholder="0">
    </div>
    <div class="input-group">
        <label>Cadeaux</label>
        <input type="number" id="cadeaux" placeholder="0">
    </div>
    <div class="subtotal">
        <span>Total loisirs</span>
        <span id="total_loisirs">0 $</span>
    </div>
</div>

<div class="results">
    <h3>📊 Résumé de votre budget</h3>
    <div class="result-row">
        <span>Revenus totaux</span>
        <span id="res_revenus">0 $</span>
    </div>
    <div class="result-row">
        <span>Dépenses totales</span>
        <span id="res_depenses">0 $</span>
    </div>
    <div class="result-row">
        <span>Épargne</span>
        <span id="res_epargne">0 $</span>
    </div>
    <div class="result-row highlight">
        <span>Solde disponible</span>
        <span id="res_solde" class="positive">0 $</span>
    </div>
    <div id="conseil" class="conseil-box">💡 Remplissez vos revenus et dépenses pour voir votre analyse.</div>
</div>
'''
    }
]


async def update_tools():
    client = AsyncIOMotorClient("mongodb://localhost:27017")
    db = client['test_database']
    
    for tool_data in TOOLS_DATA:
        result = await db.tools.update_one(
            {"slug": tool_data["slug"]},
            {"$set": tool_data},
            upsert=True
        )
        print(f"Updated: {tool_data['name']} - Modified: {result.modified_count}, Upserted: {result.upserted_id is not None}")
    
    # List all tools
    tools = await db.tools.find({}, {"_id": 0, "slug": 1, "name": 1}).to_list(None)
    print(f"\nTotal tools: {len(tools)}")
    for t in tools:
        print(f"  - {t['slug']}: {t['name']}")
    
    client.close()


if __name__ == "__main__":
    asyncio.run(update_tools())
