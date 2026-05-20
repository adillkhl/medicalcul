import type { FormulaDefinition } from '../types'

const wells_cath: FormulaDefinition = {
  id: `wells_cath`, slug: `wells_cath`,
  name: `Wells Score - Recidive de TVP apres arret des AVK`,
  specialty: `hematologie`, category: `Thrombose`,
  description: `Score de Wells pour la probabilite de recidive de thrombose veineuse profonde apres arret des anticoagulants`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`cancer`,type:`boolean`,label:`Cancer actif (traite dans les 6 mois ou palliatif)`,weight:1.5},
    {id:`paralysie`,type:`boolean`,label:`Paralysie, paresie ou immobilisation platre d\'un membre inferieur`,weight:1.5},
    {id:`alitement`,type:`boolean`,label:`Alitement > 3 jours ou chirurgie majeure < 12 semaines`,weight:1.5},
    {id:`tendinite`,type:`boolean`,label:`Sensibilite le long du trajet veineux profond`,weight:1},
    {id:`ocdme_membre`,type:`boolean`,label:`Oedeme du membre inferieur (unilateral)`,weight:1},
    {id:`oedeme_mollet`,type:`boolean`,label:`Oedeme du mollet (> 3 cm par rapport a l\'autre jambe)`,weight:1},
    {id:`circulation`,type:`boolean`,label:`Circulation collaterale superficielle`,weight:1},
    {id:`tvp_ant`,type:`boolean`,label:`Antecedent de TVP documente`,weight:1.5},
    {id:`diagnostic_alt`,type:`boolean`,label:`Diagnostic alternatif au moins aussi probable que la TVP`,weight:-2},
  ],
  calculate: (values) => {
    let s = 0
    if (values.cancer) s += 1.5
    if (values.paralysie) s += 1.5
    if (values.alitement) s += 1.5
    if (values.tendinite) s += 1
    if (values.ocdme_membre) s += 1
    if (values.oedeme_mollet) s += 1
    if (values.circulation) s += 1
    if (values.tvpp_ant) s += 1.5
    if (values.diagnostic_alt) s += -2
    
    return {value:s, label:s <= 0 ? 'Probabilite faible' : s <= 2 ? 'Probabilite moderee' : 'Probabilite elevee', severity: s <= 0 ? 'low' : s <= 2 ? 'moderate' : 'high',
      ranges:[
        {min:-99,max:0,label:'Probabilite faible (< 10% de TVP)',severity:'low'},
        {min:0.1,max:2,label:'Probabilite moderee (10-30% de TVP)',severity:'moderate'},
        {min:2.1,max:99,label:'Probabilite elevee (> 30% de TVP)',severity:'high'},
      ]}
  },
  interpretation: `Le score de Wells estime la probabilite pre-test de TVP. Un score ≤ 0 avec un D-dimeres negatif exclut pratiquement la TVP. Un score modere ou eleve necessite une echo-Doppler veineux. Le seuil de decision clinique est influence par le contexte (post-operatoire, cancer).`,
  clinicalCommentary: `L\'utilisation combinee du score de Wells et des D-dimeres (ELISA ou immunoturbidimetrie) permet de reduire de 30% le nombre d\'echographies necessaires. Attention: le score de Wells original differe legerement du score de Wells simplifie. Ne s\'applique pas aux patients hospitalises ou a risque eleve de base.`,
  references: [
    {type:`pubmed`,title:`Wells PS et al. Lancet 1997`,pmid:`9314251`},
    {type:`pubmed`,title:`Wells PS et al. Thromb Haemost 2000`,pmid:`11035598`},
  ],
}
export default wells_cath
