import type { FormulaDefinition } from '../types'

const riete: FormulaDefinition = {
  id: `riete`, slug: `riete`,
  name: `RIETE (Score de risque hemorragique sous anticoagulant pour MTEV)`,
  specialty: `cardiologie`, category: `Thrombose`,
  description: `Score RIETE de risque hemorragique sous anticoagulant pour thrombose veineuse (6 items originaux)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`saignement`,type:`boolean`,label:`Saignement recent majeur (ayant necessite hospitalisation)`,weight:2},
    {id:`creatinine`,type:`boolean`,label:`Creatinine > 1.2 mg/dL (> 106 μmol/L)`,weight:1.5},
    {id:`anemie`,type:`boolean`,label:`Anemie (Hb: F < 12 g/dL, H < 13 g/dL)`,weight:1.5},
    {id:`cancer`,type:`boolean`,label:`Cancer actif`,weight:1},
    {id:`ep_manifeste`,type:`boolean`,label:`Embolie pulmonaire cliniquement manifeste`,weight:1},
    {id:`age75`,type:`boolean`,label:`Age > 75 ans`,weight:1},
  ],
  calculate: (values) => {
    const s = (values.saignement?2:0)
      + (values.creatinine?1.5:0)
      + (values.anemie?1.5:0)
      + (values.cancer?1:0)
      + (values.ep_manifeste?1:0)
      + (values.age75?1:0)

    let label = ''
    let severity: 'low' | 'moderate' | 'high' = 'low'

    if (s < 1.5) { label = 'Risque faible'; severity = 'low' }
    else if (s < 3) { label = 'Risque modere'; severity = 'moderate' }
    else { label = 'Risque eleve'; severity = 'high' }

    return {
      value: Math.round(s * 10) / 10,
      label,
      severity,
      details: {
        'Saignement recent majeur': values.saignement ? 'Oui (2 pts)' : 'Non',
        'Creatinine > 1.2 mg/dL': values.creatinine ? 'Oui (1.5 pts)' : 'Non',
        'Anemie': values.anemie ? 'Oui (1.5 pts)' : 'Non',
        'Cancer actif': values.cancer ? 'Oui (1 pt)' : 'Non',
        'EP cliniquement manifeste': values.ep_manifeste ? 'Oui (1 pt)' : 'Non',
        'Age > 75 ans': values.age75 ? 'Oui (1 pt)' : 'Non',
      },
      ranges: [
        {min:0,max:1.4,label:'Risque faible (< 1.5)',severity:'low' as const, recommendation:'Surveillance clinique standard. Risque hemorragique a 3 mois < 1%.'},
        {min:1.5,max:2.9,label:'Risque modere (1.5-2.9)',severity:'moderate' as const, recommendation:'Anticoagulation standard. Surveillance rapprochee. Risque hemorragique ~2-3%.'},
        {min:3,max:999,label:'Risque eleve (≥ 3)',severity:'high' as const, recommendation:'Risque hemorragique ~5-8%. Justifie une surveillance renforcee. Discuter la duree d\'anticoagulation. Ponderer le risque thrombotique vs hemorragique.'},
      ],
    }
  },
  interpretation: `Le **score RIETE** (Ruiz-Gimenez et al. 2008) estime le risque de saignement majeur sous anticoagulant pour maladie thromboembolique veineuse (MTEV) sur les 3 premiers mois de traitement.

**6 items :**
- Saignement recent majeur: 2 pts
- Creatinine > 1.2 mg/dL: 1.5 pts
- Anemie (Hb F<12, H<13): 1.5 pts
- Cancer actif: 1 pt
- EP cliniquement manifeste: 1 pt
- Age > 75 ans: 1 pt

**Score :** < 1.5 faible, 1.5-2.9 modere, ≥ 3 eleve.`,
  clinicalCommentary: `Score developpe a partir du registre RIETE (> 8000 patients). Un score eleve ne contre-indique pas l\'anticoagulation mais justifie une surveillance rapprochee. La duree minimale de traitement est de 3 mois pour une TVP proximale. Les AOD sont une alternative aux AVK pour le traitement de la MTEV.`,
  references: [
    {type:`pubmed`,title:`Ruiz-Gimenez N et al. Predictive variables for major bleeding in patients presenting with documented acute venous thromboembolism. Findings from the RIETE Registry. J Thromb Haemost 2008`,pmid:`18433427`}
  ],
}
export default riete
