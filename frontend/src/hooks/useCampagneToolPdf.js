import { useState } from 'react';
import { toast } from 'sonner';
import { trackEvent } from '../lib/analytics';
import { downloadCampagneToolPdf } from '../lib/campagneToolPdf';

/**
 * Téléchargement PDF + tracking pour les mini-outils campagnes.
 */
export function useCampagneToolPdf(eventItemId) {
  const [busy, setBusy] = useState(false);

  const downloadPdf = async (payload) => {
    setBusy(true);
    try {
      await downloadCampagneToolPdf(payload);
      if (eventItemId) {
        trackEvent('select_content', {
          content_type: 'tool_pdf',
          item_id: eventItemId,
        });
      }
      toast.success('PDF téléchargé.');
    } catch (err) {
      console.error(err);
      toast.error('Impossible de générer le PDF pour le moment.');
    } finally {
      setBusy(false);
    }
  };

  return { busy, downloadPdf };
}
