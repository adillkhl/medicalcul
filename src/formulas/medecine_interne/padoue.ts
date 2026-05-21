import type { FormulaDefinition } from '../types'

const padoue: FormulaDefinition = {
  id: 'padoue', slug: 'padoue',
  name: 'Padua Prediction Score (Risque thromboembolique)',
  specialty: 'medecine_interne', category: 'Thromboembolie',
  description: 'Score de prédiction du risque de thrombose veineuse profonde (TVP) chez les patients hospitalisés — Padua Prediction Score',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    { id: 'cancer_actif', type: 'boolean', label: 'Cancer actif (métastases, chimiothérapie < 6 mois)' },
    { id: 'tvp_ant', type: 'boolean', label: 'Antécédent de TVP/EP' },
    { id: 'mobilite', type: 'boolean', label: 'Alitement > 3 jours / immobilisation' },
    { id: 'thrombophilie', type: 'boolean', label: 'Thrombophilie connue (déficit AT, Sd APL, FVL, etc.)' },
    { id: 'chirurgie_trauma', type: 'boolean', label: 'Chirurgie/traumatisme < 1 mois' },
    { id: 'age_70', type: 'boolean', label: 'Âge ≥ 70 ans' },
    { id: 'insuf_card_ou_resp', type: 'boolean', label: 'Insuffisance cardiaque ou respiratoire' },
    { id: 'ima_avc', type: 'boolean', label: 'IDM ou AVC < 1 mois' },
    { id: 'infection_rhumato', type: 'boolean', label: 'Infection aiguë / rhumatisme inflammatoire' },
    { id: 'obesite', type: 'boolean', label: 'Obésité (IMC ≥ 30)' },
    { id: 'contraception_hormonale', type: 'boolean', label: 'Contraception hormonale / THS' },
  ],
  calculate: (values) => {
    const total = (values.cancer_actif ? 3 : 0) + (values.tvp_ant ? 3 : 0) + (values.mobilite ? 3 : 0) + (values.thrombophilie ? 3 : 0)
      + (values.chirurgie_trauma ? 2 : 0) + (values.age_70 ? 1 : 0) + (values.insuf_card_ou_resp ? 1 : 0)
      + (values.ima_avc ? 1 : 0) + (values.infection_rhumato ? 1 : 0) + (values.obesite ? 1 : 0) + (values.contraception_hormonale ? 1 : 0)
    return { value: total, label: `Padua Score : ${total}`, severity: total >= 4 ? 'high' : 'low',
      ranges: [
        { min: 0, max: 3, label: 'Risque faible — Pas de thromboprophylaxie systématique', severity: 'low' },
        { min: 4, max: Infinity, label: 'Risque élevé — Thromboprophylaxie recommandée (HBPM)', severity: 'high' },
      ] }
  },
  interpretation: 'Score ≥ 4 = risque élevé de MTEV, thromboprophylaxie par HBPM recommandée. Score < 4 = risque faible, pas de prophylaxie systématique.',
  clinicalCommentary: 'Score validé pour les patients hospitalisés en médecine. À réévaluer régulièrement. Ne s\'applique pas aux patients chirurgicaux (utiliser Caprini). Contre-indication HBPM = discuter compression.',
  references: [{ type: 'pubmed', title: 'Barbar S et al. Padua prediction score. J Thromb Haemost 2010', pmid: '20374492' }],
}
export default padoue
