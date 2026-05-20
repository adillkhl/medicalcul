import type { FormulaDefinition } from '../types'

const lefort: FormulaDefinition = {
  id: 'le-fort',
  slug: 'le-fort',
  name: 'Le Fort — Classification fractures faciales',
  specialty: 'orl',
  category: 'Traumatologie ORL',
  description: 'Classification des fractures du massif facial selon Le Fort (type I, II, III) — orientation du trait de fracture',
  version: '2023',
  lastValidated: '2023-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'palate',
      type: 'boolean',
      label: 'Mobilisation du palais / arcade dentaire (maxillaire mobile)',
    },
    {
      id: 'nasal',
      type: 'boolean',
      label: 'Mobilisation de la pyramide nasale (nez mobile)',
    },
    {
      id: 'zygomatic',
      type: 'boolean',
      label: 'Mobilisation du complexe zygomatico-maxillaire (pommette mobile)',
    },
    {
      id: 'epistaxis',
      type: 'boolean',
      label: 'Épistaxis bilatérale / écoulement LCR (rhinorrhée)',
    },
    {
      id: 'ecchymosis',
      type: 'radio',
      label: 'Ecchymoses',
      options: [
        { value: 0, label: 'Absentes' },
        { value: 1, label: 'Ecchymoses sous-orbitales bilatérales (lunettes) # Cas particulier des classes Le Fort II' },
        { value: 2, label: 'Oedème en « visage de lune » + ecchymoses diffuses' },
      ],
    },
    {
      id: 'diplopia',
      type: 'boolean',
      label: 'Diplopie / énophtalmie / trouble oculomoteur',
    },
    {
      id: 'malocclusion',
      type: 'radio',
      label: 'Malocclusion dentaire',
      options: [
        { value: 0, label: 'Absente — occlusion normale' },
        { value: 1, label: 'Béance antérieure (open bite)' },
        { value: 2, label: 'Contact dentaire prématuré postérieur' },
      ],
    },
    {
      id: 'stepoff',
      type: 'boolean',
      label: 'Marche d\'escalier palpatoire (rebord orbitaire, arcade zygomatique)',
    },
  ],
  calculate: (values) => {
    const palate = !!values.palate
    const nasal = !!values.nasal
    const zygomatic = !!values.zygomatic
    const epistaxis = !!values.epistaxis
    const ecchymosis = values.ecchymosis ?? 0
    const diplopia = !!values.diplopia
    const malocclusion = values.malocclusion ?? 0
    const stepoff = !!values.stepoff

    // Le Fort III — disjonction cranio-faciale (the most severe)
    if (zygomatic && nasal && palate && diplopia && malocclusion >= 1) {
      return {
        value: 3,
        label: 'Le Fort III — Disjonction cranio-faciale',
        severity: 'critical',
        details: {
          'Classification': 'Le Fort III',
          'Trait': 'Cranio-faciale',
        },
        ranges: [
          { min: 3, max: 3, label: 'Le Fort III — Disjonction cranio-faciale', severity: 'critical', recommendation: 'URGENCE. TDM faciale + base du crâne. Intubation précoce (difficile, risque de lésion médullaire cervicale associée). Antibiothérapie (amox/clav) si fracture ouverte ou sinus. Stabilisation chirurgicale par plaques d\'ostéosynthèse (titanium). Consultation neurochirurgie + ophtalmologie.' },
        ],
      }
    }

    // Le Fort II — fracture pyramidale
    if (nasal && palate && !zygomatic) {
      return {
        value: 2,
        label: 'Le Fort II — Fracture pyramidale',
        severity: 'high',
        details: {
          'Classification': 'Le Fort II',
          'Trait': 'Pyramidale',
        },
        ranges: [
          { min: 2, max: 2, label: 'Le Fort II — Fracture pyramidale', severity: 'high', recommendation: 'TDM faciale en urgence. Antibiothérapie si sinusien (amox/ac clav). Réduction chirurgicale sous AG : ostéosynthèse rigide (mini-plaques titane). Surveillance des voies aériennes. Avis ophtalmo si atteinte orbitaire. Alimentation liquide puis mixée.' },
        ],
      }
    }

    // Le Fort I — fracture transverse (Guerin)
    if (palate && !nasal && !zygomatic) {
      return {
        value: 1,
        label: 'Le Fort I — Fracture transverse de Guérin',
        severity: 'moderate',
        details: {
          'Classification': 'Le Fort I',
          'Trait': 'Transverse',
        },
        ranges: [
          { min: 1, max: 1, label: 'Le Fort I — Fracture transverse', severity: 'moderate', recommendation: 'TDM faciale. Réduction chirurgicale sous AG avec ostéosynthèse par plaques. Surveillance de l\'occlusion dentaire post-op. Alimentation mixée 4-6 semaines. Antibiothérapie péri-opératoire.' },
        ],
      }
    }

    // Not meeting any Le Fort pattern — classify as fracture suspec or isolated fracture
    const hasSigns = palate || nasal || zygomatic || malocclusion >= 1
    if (!hasSigns) {
      return {
        value: 0,
        label: 'Pas de fracture Le Fort — Isolée ou absente',
        severity: 'low',
        details: {
          'Classification': 'Aucune',
          'Trait': 'Absent',
        },
        ranges: [
          { min: 0, max: 0, label: 'Pas de fracture Le Fort', severity: 'low', recommendation: 'Rechercher fractures isolées (nasale, orbitaire, zygomatique, dento-alvéolaire). Si suspicion clinique : TDM faciale en fenêtres osseuses ± TDM du crâne en cas de TC associé.' },
        ],
      }
    }

    // Mixed/incomplete presentation — suggest imaging
    return {
      value: 0,
      label: 'Fracture possible — Bilan TDM nécessaire',
      severity: 'moderate',
      details: {
        'Classification': 'Incomplète',
        'Trait': 'À déterminer',
      },
      ranges: [
        { min: 0, max: 1, label: 'Bilan TDM nécessaire', severity: 'moderate', recommendation: 'TDM faciale en urgence pour classification. Antibiothérapie prophylactique si suspicion de fracture sinusienne. Surveillance des voies aériennes.' },
        { min: 2, max: 3, label: 'Le Fort II ou III', severity: 'critical' },
      ],
    }
  },
  interpretation: `La **classification de Le Fort** (1901) décrit les fractures du massif facial selon le trait fracturaire. Elle repose sur les « lignes de faiblesse » de l’os facial.

| Type | Description | TDM | Traitement |
|------|-------------|-----|------------|
| **Le Fort I** (Guérin) | Transverse sus-palatine | Détache le palais dur + processus ptérygoïde | Mini-plaques |
| **Le Fort II** (Pyramidale) | Nasale → orbitaire → ptérygoïdienne | Détache la pyramide faciale | Plaques + suspension |
| **Le Fort III** (Disjonction) | Cranio-faciale complète | Sépare le massif facial de la base | Plaques lourdes + neurochirurgie |

Ne pas oublier que les fractures de Le Fort sont souvent bilatérales et peuvent être associées à un traumatisme crânien (TDM cérébrale systématique).`,
  clinicalCommentary: `Les fractures du massif facial sont des urgences ORL fréquentes (AVP, chutes, agressions). La classification de Le Fort reste la référence mais est souvent associée à des fractures mixtes (complexe naso-ethmoïdo-orbitaire, NOE). Le signe le plus sensible est la mobilisation du palais (Le Fort I) ou du massif facial (Le Fort III). La TDM faciale avec reconstructions 3D est indispensable. Attention : intubation difficile fréquente (voies aériennes compromises), oedème pharyngé, hémorragie. Toujours éliminer un traumatisme cervical associé.`,
  references: [
    {
      type: 'pubmed',
      title: 'Le Fort R. Étude expérimentale sur les fractures de la mâchoire. Rev Chir 1901',
      pmid: 'none',
    },
    {
      type: 'pubmed',
      title: 'Bagheri SC et al. Current concepts in maxillofacial trauma. J Oral Maxillofac Surg 2021',
      pmid: '34058258',
    },
    {
      type: 'guideline',
      title: 'SFORL — Prise en charge des traumatismes faciaux (2022)',
      url: 'https://www.sforl.org',
    },
  ],
}

export default lefort
