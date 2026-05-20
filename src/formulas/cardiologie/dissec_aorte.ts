import type { FormulaDefinition } from '../types'

const dissecAorte: FormulaDefinition = {
  id: 'dissec_aorte',
  slug: 'dissec_aorte',
  name: 'Dissections Aortiques (Classifications DeBakey, Stanford, TEM)',
  specialty: 'cardiologie',
  category: 'Pathologie aortique',
  description: 'Classifications des dissections aortiques : DeBakey, Stanford et TEM',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'classification',
      type: 'radio',
      label: 'Choisir la classification',
      options: [
        { value: 0, label: 'DeBakey (Type I, II, III)' },
        { value: 1, label: 'Stanford (Type A, B)' },
      ],
    },
    {
      id: 'debakey_type',
      type: 'radio',
      label: 'Type DeBakey',
      options: [
        { value: 1, label: 'DeBakey I — Faux chenal naît dans l\'aorte ascendante, s\'étend à la crosse et/ou descendante' },
        { value: 2, label: 'DeBakey II — Faux chenal limité à l\'aorte ascendante' },
        { value: 3, label: 'DeBakey III — Faux chenal naît dans l\'aorte descendante (après l\'artère sous-clavière gauche)' },
      ],
    },
    {
      id: 'stanford_type',
      type: 'radio',
      label: 'Type Stanford',
      options: [
        { value: 1, label: 'Stanford A — Dissection atteignant l\'aorte ascendante' },
        { value: 2, label: 'Stanford B — Dissection limitée à l\'aorte descendante' },
      ],
    },
  ],
  calculate: (values) => {
    const cls = Number(values.classification)
    if (cls === 0) {
      const debakey = Number(values.debakey_type)
      const labels: Record<number, string> = { 1: 'DeBakey I', 2: 'DeBakey II', 3: 'DeBakey III' }
      return {
        value: debakey,
        label: labels[debakey] || 'DeBakey',
        severity: debakey <= 2 ? 'critical' : 'high',
        ranges: [
          { min: 1, max: 1, label: 'DeBakey I', severity: 'critical', recommendation: 'Chirurgie cardiaque EN URGENCE : remplacement de l\'aorte ascendante sous CEC. Mortalite > 50 % a 48h sans chirurgie.' },
          { min: 2, max: 2, label: 'DeBakey II', severity: 'critical', recommendation: 'Chirurgie urgente : remplacement de l\'aorte ascendante. Meilleur pronostic que le type I.' },
          { min: 3, max: 3, label: 'DeBakey III', severity: 'high', recommendation: 'Traitement medical conservateur (b-bloquant, controle tensionnel). TEVAR si complications (rupture, malperfusion).' },
        ],
      }
    } else {
      const stanford = Number(values.stanford_type)
      return {
        value: stanford,
        label: stanford === 1 ? 'Stanford A' : 'Stanford B',
        severity: stanford === 1 ? 'critical' : 'high',
        ranges: [
          { min: 1, max: 1, label: 'Stanford A', severity: 'critical', recommendation: 'CHIRURGIE EN URGENCE ABSOLUE. Mortalite 1-2 % par heure sans chirurgie. Preparer le bloc sans delai.' },
          { min: 2, max: 2, label: 'Stanford B', severity: 'high', recommendation: 'Traitement medical : betabloquant, nicardipine IV, objectif PAS < 120 mmHg. TEVAR si complications (rupture, malperfusion viscerale).' },
        ],
      }
    }
  },
  interpretation: `Les **classifications des dissections aortiques** guident la stratégie therapeutique.

**Classification de DeBakey :**
- **Type I** : nait dans l’aorte ascendante et s’etend distalement (crosse, descendante)
- **Type II** : limitee a l\'aorte ascendante
- **Type III** : nait dans l’aorte descendante (apres l\'artere sous-claviere gauche)

**Classification de Stanford :**
- **Type A** : toute dissection touchant l\'aorte ascendante (DeBakey I + II) -> **chirurgie urgente**
- **Type B** : dissection limitee a l’aorte descendante -> **traitement medical** +/- TEVAR

**Classification TEM** : ajoute la notion de phase (aigue < 14 j, subaigue 15-90 j, chronique > 90 j).`,
  clinicalCommentary: `Toute dissection de l\'aorte ascendante (Stanford A) est une urgence chirurgicale absolue. Le traitement medical initial (betabloquant +/- nicardipine IV, objectif PAS 100-120 mmHg) est a debuter immediatement, en attendant le bloc. Ne pas oublier l\'angio-TDM thoraco-abdominal pour evaluer l’extension. La TEVAR a revoltionne le traitement des dissections de type B.`,
  references: [
    {
      type: 'pubmed',
      title: 'Nienaber CA et al. Aortic dissection: new frontiers in diagnosis and management. Circulation 2003',
      pmid: '12821581',
    },
    {
      type: 'pubmed',
      title: 'DeBakey ME et al. Surgical treatment of dissecting aneurysm of the aorta. J Thorac Cardiovasc Surg 1965',
      pmid: '14278147',
    },
  ],
}
export default dissecAorte
