import type { FormulaDefinition } from '../types'

const altemeier: FormulaDefinition = {
  id: 'altemeier',
  slug: 'altemeier',
  name: 'Altemeier (Classification)',
  specialty: 'infectiologie',
  category: 'Classification des plaies',
  description: 'Classification d Altemeier pour le risque infectieux des plaies chirurgicales, utilisée en épidémiologie et antibioprophylaxie.',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'classe',
      type: 'radio',
      label: 'Classe de la plaie chirurgicale',
      options: [
        { value: 1, label: 'Classe I — Propre : plaie non infectée, pas d ouverture des voies aérodigestives' },
        { value: 2, label: 'Classe II — Propre-contaminée : ouverture des voies aérodigestives sous contrôle, sans contamination majeure' },
        { value: 3, label: 'Classe III — Contaminée : plaie traumatique récente, brèche ou fuite septique per-opératoire' },
        { value: 4, label: 'Classe IV — Sale / Infectée : plaie traumatique ancienne, perforation viscérale, infection active' },
      ],
    },
  ],
  calculate: (values) => {
    const classe = parseInt(values.classe) || 0

    const risques: Record<number, { label: string; risk: number; severity: 'low' | 'moderate' | 'high' | 'critical'; rec: string }> = {
      1: { label: 'Classe I — Propre', risk: 1.5, severity: 'low', rec: 'Antibioprophylaxie non indiquée (sauf mise en place de prothèse, chirurgie cardiaque ou immunodépression).' },
      2: { label: 'Classe II — Propre-contaminée', risk: 10, severity: 'moderate', rec: 'Antibioprophylaxie indiquée selon le geste. Dose unique pré-opératoire (céfazoline ou cefoxitine).' },
      3: { label: 'Classe III — Contaminée', risk: 25, severity: 'high', rec: 'Antibioprophylaxie systématique. Antibiotiques à large spectre. Traitement curatif si signes infectieux avérés.' },
      4: { label: 'Classe IV — Sale / Infectée', risk: 50, severity: 'critical', rec: 'Antibiothérapie curative (pas seulement prophylactique). Prélèvements bactériologiques per-opératoires. Traitement adapté à la documentation microbiologique.' },
    }

    const info = risques[classe] || { label: 'Non classifié', risk: 0, severity: 'low' as const, rec: '' }

    return {
      value: classe,
      label: info.label,
      severity: info.severity,
      risk: info.risk,
      riskUnit: '% risque d infection du site opératoire (ISO)',
      ranges: [
        { min: 1, max: 1, label: 'Classe I — Propre', severity: 'low', recommendation: 'Pas d antibioprophylaxie systématique sauf prothèse, immunodépression, ou chirurgie cardiaque.' },
        { min: 2, max: 2, label: 'Classe II — Propre-contaminée', severity: 'moderate', recommendation: 'Antibioprophylaxie selon recommandations SFAR. Céfazoline 2g IV dose unique avant incision.' },
        { min: 3, max: 3, label: 'Classe III — Contaminée', severity: 'high', recommendation: 'Antibiotique large spectre per-opératoire. Réévaluation à 48h selon évolution et prélèvements.' },
        { min: 4, max: 4, label: 'Classe IV — Sale / Infectée', severity: 'critical', recommendation: 'Antibiothérapie curative. Prélèvements per-opératoires. Avis spécialisé en infectiologie.' },
      ],
    }
  },
  interpretation: `La **classification d\'Altemeier** (ou classification de la contamination des plaies chirurgicales) est utilisée dans le cadre de la surveillance épidémiologique des infections du site opératoire (ISO).

**Quatre classes :**
- **Classe I — Propre** : Risque ISO ≤ 2 %.
- **Classe II — Propre-contaminée** : Risque ISO 5–15 %.
- **Classe III — Contaminée** : Risque ISO 15–30 %.
- **Classe IV — Sale** : Risque ISO ≥ 30 %.

Cette classification guide l indication de l antibioprophylaxie chirurgicale.`,
  clinicalCommentary: `La classification d Altemeier est un standard international. Elle doit être déterminée par le chirurgien en fin d intervention. Les facteurs de risque d ISO incluent aussi : diabète, obésité, tabac, durée opératoire prolongée, transfusion. L antibioprophylaxie doit être administrée dans les 60 minutes avant l incision (sauf vancomycine ou fluoroquinolones : 120 min).`,
  references: [
    {
      type: 'pubmed',
      title: 'Altemeier WA et al. Manual on control of infection in surgical patients. Am Coll Surg 1984',
      pmid: '6364849',
    },
    {
      type: 'guideline',
      title: 'SFAR — Antibioprophylaxie en chirurgie (Recommandations 2021)',
      url: 'https://sfar.org',
    },
  ],
}
export default altemeier
