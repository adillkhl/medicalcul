import type { FormulaDefinition } from '../types'

const dehydration_enfant: FormulaDefinition = {
  id: `dehydration_enfant`, slug: `dehydration_enfant`,
  name: `Score de Déshydratation de l\'Enfant`,
  specialty: `pediatrie`, category: `Urgences Pédiatriques`,
  description: `Évaluation clinique du degré de déshydratation aiguë du nourrisson et de l\'enfant (5 items) — perte de poids estimée`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`etat_general`,type:`radio`,label:`État général`,options:[{value:0,label:`Normal / éveillé`},{value:1,label:`Agité / irritable`},{value:2,label:`Abattu / lethargique`}]},
    {id:`yeux`,type:`radio`,label:`Yeux`,options:[{value:0,label:`Normaux`},{value:1,label:`Enfoncés (légèrement)`},{value:2,label:`Très enfoncés / secs`}]},
    {id:`larmes`,type:`radio`,label:`Larmes`,options:[{value:0,label:`Présentes`},{value:1,label:`Diminuées`},{value:2,label:`Absentes`}]},
    {id:`pli_cutane`,type:`radio`,label:`Pli cutané`,options:[{value:0,label:`< 1 sec (disparaît immédiatement)`},{value:1,label:`1-2 sec (disparaît lentement)`},{value:2,label:`> 2 sec (reste visible)`}]},
    {id:`muqueuses`,type:`radio`,label:`Muqueuses buccales`,options:[{value:0,label:`Humides`},{value:1,label:`Sèches`},{value:2,label:`Très sèches / lèvres gercées`}]},
  ],
  calculate: (values) => {
    const s = (values.etat_general??0)+(values.yeux??0)+(values.larmes??0)+(values.pli_cutane??0)+(values.muqueuses??0)
    const pct = s <= 2 ? '< 5%' : s <= 5 ? '5-10%' : '> 10%'
    const sev = s >= 6 ? 'high' : s >= 3 ? 'moderate' : 'low'
    return {value:s, label:`Score ${s}/10 — Perte estimée ${pct} du poids corporel`, severity: sev,
      ranges:[
        {min:0,max:2,label:`Déshydratation < 5% — Minime`,severity:'low',recommendation:`Réhydratation orale (SRO). Surveillance à domicile si pas de vomissements.`},
        {min:3,max:5,label:`Déshydratation 5-10% — Modérée`,severity:'moderate',recommendation:`Réhydratation orale ou par sonde nasogastrique en milieu hospitalier. Surveillance rapprochée.`},
        {min:6,max:10,label:`Déshydratation > 10% — Sévère`,severity:'high',recommendation:`Urgence : perfusion IV (soluté isotonique) en hospitalisation. Réhydratation en 2-4h selon protocole OMS.`},
      ]}
  },
  interpretation: `Score clinique de déshydratation aiguë chez l\'enfant. 5 items (état général, yeux, larmes, pli cutané, muqueuses) cotés 0-2. Total /10. Déshydratation < 5% (0-2) : minime. 5-10% (3-5) : modérée. > 10% (6-10) : sévère avec signes de choc.`,
  clinicalCommentary: `Indispensable aux urgences pédiatriques. Ne pas se fier uniquement au poids de base si inconnu. Associé aux signes hémodynamiques (pouls, temps de recoloration, FC, PA). La meilleure approche : perte de poids = référence, mais rarement disponible. Les SRO sont sous-utilisés en France. Attention au pli cutané : peu fiable en cas de dénutrition.`,
  references: [
    {type:`pubmed`,title:`WHO — Clinical dehydration scale. Arch Dis Child 2007`,pmid:`17428829`},
    {type:`guideline`,title:`HAS — Prise en charge de la gastroenterite aiguë du nourrisson (2021)`,url:`https://www.has-sante.fr/`},
  ],
}
export default dehydration_enfant
