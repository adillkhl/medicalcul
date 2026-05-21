import type { FormulaDefinition } from '../types'

const abc_transfu: FormulaDefinition = {
  id: 'abc_transfu', slug: 'abc_transfu',
  name: 'Transfusion sanguine (Classification ABC)',
  specialty: 'hematologie', category: 'Transfusion',
  description: 'Classification ABC des transfusions sanguines — évaluation de l\'indication transfusionnelle en culots globulaires selon le taux d\'hémoglobine et le terrain',
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'B',
  inputs: [
    { id: 'hb', type: 'number', label: 'Hémoglobine', unit: 'g/dL', min: 3, max: 18, step: 0.1, placeholder: 'Ex: 9.5' },
    { id: 'terrain', type: 'radio', label: 'Terrain / Contexte clinique', options: [
      { value: 0, label: 'Patient stable sans comorbidité cardiovasculaire' },
      { value: 1, label: 'Patient instable (hypotension, tachycardie, signes d\'hypoperfusion)' },
      { value: 2, label: 'Patient coronarien / insuffisant cardiaque' },
      { value: 3, label: 'Hémorragie active avec choc hémorragique' },
    ]},
    { id: 'symptomes', type: 'boolean', label: 'Symptômes d\'anémie (dyspnée, asthénie, vertiges, pâleur)' },
  ],
  calculate: (values) => {
    const hb = Number(values.hb) || 12
    const terrain = Number(values.terrain) || 0
    const symptomes = !!values.symptomes

    let indication: string
    let classe: string
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'

    if (hb < 7) {
      indication = 'Transfusion recommandée (seuil transfusionnel absolu)'
      classe = 'Classe A'
      severity = hb < 5 ? 'critical' : 'high'
    } else if (hb < 8) {
      if (terrain >= 1 || symptomes) {
        indication = 'Transfusion recommandée (terrain à risque ou symptomatique)'
        classe = 'Classe B'
        severity = 'high'
      } else {
        indication = 'Transfusion à discuter — monitorage possible en l\'absence de signes'
        classe = 'Classe C'
        severity = 'low'
      }
    } else if (hb < 10) {
      if (terrain >= 2) {
        indication = 'Transfusion recommandée (patient coronarien/ICC avec Hb < 10)'
        classe = 'Classe B'
        severity = 'high'
      } else if (terrain === 1 || symptomes) {
        indication = 'Transfusion possible si symptômes ou instabilité'
        classe = 'Classe C'
        severity = 'moderate'
      } else {
        indication = 'Transfusion non indiquée en l\'absence de signes'
        classe = 'Classe C'
        severity = 'low'
      }
    } else {
      indication = 'Transfusion non indiquée — Hb > 10 g/dL'
      classe = 'Classe C'
      severity = 'low'
    }

    return {
      value: Math.round(hb * 10) / 10,
      label: classe + ' — ' + indication,
      severity,
      details: {
        'Hémoglobine': `${hb} g/dL`,
        'Terrain': ['Stable', 'Instable', 'Coronarien/ICC', 'Choc hémorragique'][terrain],
        'Symptômes': symptomes ? 'Oui' : 'Non',
        'Classe': classe,
      },
      ranges: [
        { min: 0, max: 6.9, label: 'Hb < 7 : Transfusion recommandée', severity: 'high' },
        { min: 7, max: 7.9, label: 'Hb 7-8 : Selon terrain/symptômes', severity: 'moderate' },
        { min: 8, max: 9.9, label: 'Hb 8-10 : Rarement indiquée si stable', severity: 'low' },
        { min: 10, max: 18, label: 'Hb > 10 : Transfusion non indiquée', severity: 'low' },
      ],
    }
  },
  interpretation: 'La **classification ABC** guide l\'indication transfusionnelle en culots globulaires :\n\n• **Classe A** : Transfusion formelle (Hb < 7 g/dL, ou < 8 g/dL si terrain à risque)\n• **Classe B** : Transfusion recommandée (patient coronarien/ICC avec Hb < 10 g/dL, ou patient instable)\n• **Classe C** : Transfusion non indiquée ou à discuter au cas par cas\n\nLe seuil transfusionnel standard est de 7 g/dL chez le patient stable, et de 8 g/dL chez le patient avec antécédent cardiovasculaire (recommandations HAS 2014).',
  clinicalCommentary: 'La transfusion sanguine doit être réservée aux situations où le bénéfice est démontré. Une stratégie transfusionnelle restrictive (seuil à 7 g/dL) est associée à une morbi-mortalité comparable voire inférieure à une stratégie libérale. Chez le coronarien, le seuil de 8 g/dL est recommandé par les sociétés savantes (AABB, HAS).',
  references: [
    { type: 'guideline', title: 'HAS — Transfusion de globules rouges homologues. Recommandations 2014', url: 'https://www.has-sante.fr/' },
    { type: 'pubmed', title: 'Carson JL et al. Restrictive vs liberal transfusion strategy. NEJM 2011', pmid: '21615299' },
    { type: 'pubmed', title: 'Hébert PC et al. A multicenter RCT of transfusion requirements in critical care. NEJM 1999', pmid: '10067742' },
  ],
}
export default abc_transfu
