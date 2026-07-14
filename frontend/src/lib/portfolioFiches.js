/**
 * Fiches PDF bundlées (URLs hashées) — chunk portefeuilles uniquement.
 * Ne pas réintroduire sous /public : chemins stables indexables.
 */
import FU021 from '../assets/fiches-fonds/FU021.pdf';
import FU280 from '../assets/fiches-fonds/FU280.pdf';
import FU505 from '../assets/fiches-fonds/FU505.pdf';
import FU530 from '../assets/fiches-fonds/FU530.pdf';
import FU607 from '../assets/fiches-fonds/FU607.pdf';
import FU705 from '../assets/fiches-fonds/FU705.pdf';
import FU707 from '../assets/fiches-fonds/FU707.pdf';
import FU762 from '../assets/fiches-fonds/FU762.pdf';
import FU870 from '../assets/fiches-fonds/FU870.pdf';
import FU920 from '../assets/fiches-fonds/FU920.pdf';

const FUND_FICHE_URLS = {
  FU021,
  FU280,
  FU505,
  FU530,
  FU607,
  FU705,
  FU707,
  FU762,
  FU870,
  FU920,
};

export function getFundFicheUrl(fuCode) {
  return FUND_FICHE_URLS[fuCode] || null;
}

export function fundHasBundledFiche(fuCode) {
  return Boolean(FUND_FICHE_URLS[fuCode]);
}
