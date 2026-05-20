import type { FormulaDefinition } from '../types'

const stadenvip: FormulaDefinition = {
  id: 'stade-envenimation-viperine',
  slug: 'stadenvip',
  name: 'Envenimation Vipérine (Grades)',
  specialty: 'toxicologie',
  category: 'Envenimation',
  description: 'Classification des grades de sévérité de l\'envenimation par les vipères européennes (Vipera aspis, Vipera berus). Guide la décision d\'administration du sérum antivénimeux.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'local_swelling',
      type: 'radio',
      label: 'Œdème local',
      options: [
        { value: 0, label: 'Absent ou trace de morsure sans réaction' },
        { value: 1, label: 'Œdème localisé au segment de membre atteint' },
        { value: 2, label: 'Œdème dépassant l\'articulation adjacente' },
        { value: 3, label: 'Œdème extensif dépassant la racine du membre ou atteignant le tronc' },
      ],
    },
    {
      id: 'general_signs',
      type: 'radio',
      label: 'Signes généraux',
      options: [
        { value: 0, label: 'Absents' },
        { value: 1, label: 'Modérés : nausées, vomissements, douleurs abdominales, céphalées' },
        { value: 2, label: 'Sévères : hypotension transitoire, tachycardie, vertiges, lipothymie' },
        { value: 3, label: 'Très sévères : collapsus, choc, trouble de conscience, convulsions' },
      ],
    },
    {
      id: 'coagulopathy',
      type: 'radio',
      label: 'Troubles de l\'hémostase / Biologie',
      options: [
        { value: 0, label: 'Normale' },
        { value: 1, label: 'Légers : plaquettes 100-150 G/L, TP 50-70%, fibrinogène 1,5-2 g/L' },
        { value: 2, label: 'Modérés : plaquettes 50-100 G/L, TP 30-50%, fibrinogène 1-1,5 g/L' },
        { value: 3, label: 'Sévères : plaquettes < 50 G/L, TP < 30%, fibrinogène < 1 g/L, CIVD' },
      ],
    },
  ],
  calculate: (values) => {
    const localScore = values.local_swelling as number
    const generalScore = values.general_signs as number
    const coagScore = values.coagulopathy as number

    // Calculate total and determine grade
    // Grade is based on the highest component
    const maxScore = Math.max(localScore, generalScore, coagScore)

    let grade = 0
    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (maxScore === 0 && localScore === 0 && generalScore === 0 && coagScore === 0) {
      grade = 0
      label = 'Grade 0 — Morsure blanche (sans envenimation)'
      severity = 'low'
      recommendation = 'Surveillance simple 6-12h. Pas de sérum. Antiseptique local, VAT à jour.'
    } else if (maxScore === 1) {
      grade = 1
      label = 'Grade I — Envenimation minime'
      severity = 'low'
      recommendation = 'Surveillance hospitalière 24h. Pas de sérum systématique. Traitement symptomatique : antalgiques, surélévation du membre.'
    } else if (maxScore === 2) {
      grade = 2
      label = 'Grade II — Envenimation modérée'
      severity = 'moderate'
      recommendation = 'Sérum antivénimeux (ViperaTAb®) indiqué : 1 à 2 flacons IV. Hospitalisation 48-72h. Surveillance clinique et biologique (NFS, TP, fibrinogène).'
    } else {
      grade = 3
      label = 'Grade III — Envenimation sévère'
      severity = 'critical'
      recommendation = 'URGENCE VITALE. Sérum antivénimeux (ViperaTAb®) 2 à 4 flacons IV immédiat. Réanimation (remplissage, vasopresseurs). Surveillance coagulopathie. VAT + SAT.'
    }

    return {
      value: grade,
      label,
      severity,
      details: {
        'Œdème local': ['Absent', 'Localisé', 'Dépassant articulation', 'Extensif'][localScore],
        'Signes généraux': ['Absents', 'Modérés', 'Sévères', 'Très sévères'][generalScore],
        'Coagulopathie': ['Normale', 'Légère', 'Modérée', 'Sévère'][coagScore],
        Grade: `Grade ${grade}`,
      },
      ranges: [
        { min: 0, max: 0, label: 'Grade 0 — Morsure blanche', severity: 'low', recommendation: 'Surveillance' },
        { min: 1, max: 1, label: 'Grade I — Envenimation minime', severity: 'low', recommendation: 'Surveillance 24h' },
        { min: 2, max: 2, label: 'Grade II — Envenimation modérée', severity: 'moderate', recommendation: 'Sérum antivénimeux indiqué' },
        { min: 3, max: 3, label: 'Grade III — Envenimation sévère', severity: 'critical', recommendation: 'Réanimation + sérum en urgence' },
      ],
    }
  },
  interpretation: `La classification française de **l'envenimation vipérine** comporte 4 grades :

- **Grade 0** : Morsure sans envenimation (trace de crochets sans signe clinique)
- **Grade I** : Envenimation minime — œdème local modéré, pas de signes généraux
- **Grade II** : Envenimation modérée — œdème étendu, signes généraux modérés
- **Grade III** : Envenimation sévère — signes généraux sévères, coagulopathie, choc

Le sérum **ViperaTAb®** (immunoglobulines Fab de mouton) est indiqué à partir du grade II.`,
  clinicalCommentary: `En France, les principales espèces de vipères sont Vipera aspis et Vipera berus. La morsure a lieu principalement au printemps et en été. La décision d'administer le sérum repose sur la présence de signes d'envenimation systémique. Le sérum doit être administré dans les 4 à 6 heures suivant la morsure pour une efficacité maximale. Contre-indications relatives : allergie connue aux protéines de mouton (préférer ViperaTAb® sous surveillance). Toujours vérifier la vaccination antitétanique (VAT).`,
  references: [
    {
      type: 'pubmed',
      title: 'Boels D et al. Vipera aspis envenomation: a review of 268 cases. Clin Toxicol 2013',
      pmid: '23879172',
    },
    {
      type: 'pubmed',
      title: 'de Haro L et al. Vipera envenomations in France: management and immunotherapy. Ann Fr Anesth Reanim 2008',
      pmid: '18617357',
    },
  ],
}

export default stadenvip
