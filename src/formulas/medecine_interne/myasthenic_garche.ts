import type { FormulaDefinition } from '../types'

const myasthenicGarche: FormulaDefinition = {
  id: 'myasthenic_garche',
  slug: 'myasthenic_garche',
  name: 'Myasthénique de Garche — Score de gravité',
  specialty: 'medecine_interne',
  category: 'Neurologie',
  description: 'Score de cotation de la gravité de la myasthénie selon Garche (classification clinique).',
  version: '2023',
  lastValidated: '2023-06',
  evidenceLevel: 'C',
  inputs: [
    {
      id: 'oculaire',
      type: 'radio',
      label: 'Atteinte oculaire',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Ptôsis unilatéral, diplopie intermittente' },
        { value: 2, label: 'Ptôsis bilatéral, diplopie constante' },
      ],
    },
    {
      id: 'bulbaire',
      type: 'radio',
      label: 'Atteinte bulbaire (phonation, déglutition, mastication)',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Légère : voix nasillarde, gêne à la déglutition des solides' },
        { value: 2, label: 'Modérée : dysphagie pour les liquides, fausses routes intermittentes' },
        { value: 3, label: 'Sévère : sonde nasogastrique nécessaire, fausses routes constantes' },
      ],
    },
    {
      id: 'respiratoire',
      type: 'radio',
      label: 'Atteinte respiratoire',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Dyspnée d\'effort, CV > 80% théorique' },
        { value: 2, label: 'Dyspnée au moindre effort, CV 60–80%, VNI intermittente' },
        { value: 3, label: 'Détresse respiratoire, CV < 60%, VNI continue ou intubation' },
      ],
    },
    {
      id: 'membres',
      type: 'radio',
      label: 'Atteinte des membres',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Légère : fatigue à l\'effort mais marche autonome' },
        { value: 2, label: 'Modérée : marche limitée (< 500 m), canne nécessaire' },
        { value: 3, label: 'Sévère : fauteuil roulant, alitement' },
      ],
    },
    {
      id: 'crise',
      type: 'boolean',
      label: 'Crise myasthénique actuelle (aggravation aiguë nécessitant hospitalisation)',
    },
  ],
  calculate: (values) => {
    const oculaire = values.oculaire ?? 0
    const bulbaire = values.bulbaire ?? 0
    const respiratoire = values.respiratoire ?? 0
    const membres = values.membres ?? 0
    const crise = values.crise ? 5 : 0
    const score = oculaire + bulbaire + respiratoire + membres + crise

    if (score >= 8) {
      return {
        value: score,
        label: `Score = ${score} — Myasthénie sévère`,
        severity: 'high',
        details: { oculaire, bulbaire, respiratoire, membres, crise: crise > 0 ? 1 : 0 },
        ranges: [
          { min: 8, max: 99, label: 'Sévère : formes généralisées avec atteinte respiratoire ou crise', severity: 'high' },
          { min: 4, max: 7, label: 'Modérée : formes généralisées sans atteinte respiratoire', severity: 'moderate' },
          { min: 1, max: 3, label: 'Légère : formes oculaires ou minimes', severity: 'low' },
          { min: 0, max: 0, label: 'Rémission complète', severity: 'low' },
        ],
      }
    }
    if (score >= 4) {
      return {
        value: score,
        label: `Score = ${score} — Myasthénie modérée`,
        severity: 'moderate',
        details: { oculaire, bulbaire, respiratoire, membres, crise: crise > 0 ? 1 : 0 },
        ranges: [
          { min: 0, max: 0, label: 'Rémission', severity: 'low' },
          { min: 1, max: 3, label: 'Légère', severity: 'low' },
          { min: 4, max: 7, label: 'Modérée', severity: 'moderate' },
          { min: 8, max: 99, label: 'Sévère', severity: 'high' },
        ],
      }
    }
    return {
      value: score,
      label: `Score = ${score} — Myasthénie légère / rémission`,
      severity: 'low',
      details: { oculaire, bulbaire, respiratoire, membres, crise: crise > 0 ? 1 : 0 },
      ranges: [
        { min: 0, max: 0, label: 'Rémission complète', severity: 'low' },
        { min: 1, max: 3, label: 'Légère', severity: 'low' },
        { min: 4, max: 7, label: 'Modérée', severity: 'moderate' },
        { min: 8, max: 99, label: 'Sévère', severity: 'high' },
      ],
    }
  },
  interpretation: `**Score de Garche** — Classification de la gravité de la myasthénie :

- **0** : Rémission complète (aucun symptôme)
- **1–3** : Forme légère (oculaire pure principalement)
- **4–7** : Forme modérée (généralisée sans atteinte respiratoire)
- **≥ 8** : Forme sévère (avec atteinte respiratoire ou crise)

**Conduite** : Forme oculaire → anticholinestérasique. Forme généralisée → corticothérapie puis immunosuppresseurs. Crise myasthénique → hospitalisation en réanimation, échanges plasmatiques ou IgIV.`,
  clinicalCommentary: `La crise myasthénique est une urgence vitale (insuffisance respiratoire aiguë). Facteurs déclenchants : infection, chirurgie, changement de traitement, grossesse. Les scores quantitatifs (QMG, MG-ADL) sont plus précis que le score de Garche en pratique clinique actuelle.`,
  references: [
    {
      type: 'pubmed',
      title: 'Jaretzki A et al. Myasthenia gravis. Neurology 2000',
      pmid: '10770837',
    },
    {
      type: 'guideline',
      title: 'EFNS/ENS Guidelines for the treatment of myasthenia gravis 2010',
      pmid: '21059191',
    },
  ],
}

export default myasthenicGarche
