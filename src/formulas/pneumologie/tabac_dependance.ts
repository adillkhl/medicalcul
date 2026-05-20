import type { FormulaDefinition } from '../types'

const tabac_dependance: FormulaDefinition = {
  id: `tabac_dependance`, slug: `tabac_dependance`,
  name: `Dependance au tabac (Fagerstrom)`,
  specialty: `pneumologie`, category: `Tabac`,
  description: `Test de dependance a la nicotine de Fagerstrom (6 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`delai`,type:`radio`,label:`Delai avant 1ere cigarette`,options:[{value:0,label:`> 60 min`},{value:1,label:`31-60 min`},{value:2,label:`6-30 min`},{value:3,label:`< 5 min`}]},
    {id:`interdiction`,type:`radio`,label:`Difficulte a s abstenir`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`matin`,type:`radio`,label:`Fume plus le matin`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`nb`,type:`radio`,label:`Nombre de cigarettes/jour`,options:[{value:0,label:`< 11`},{value:1,label:`11-20`},{value:2,label:`21-30`},{value:3,label:`>= 31`}]},
    {id:`malade`,type:`radio`,label:`Fume meme malade`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
    {id:`profonde`,type:`radio`,label:`Inhale profondement`,options:[{value:0,label:`Non`},{value:1,label:`Oui`}]},
  ],
  calculate: (values) => {
    const s = (parseInt(values.delai)||0)+(values.interdiction?1:0)+(values.matin?1:0)+(parseInt(values.nb)||0)+(values.malade?1:0)+(values.profonde?1:0)
        const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : 'low'
        const label = s <= 3 ? 'Dependance faible' : s <= 6 ? 'Dependance moderee' : 'Dependance forte'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:3,label:'Faible - Substituts possible',severity:'low' as const},
          {min:4,max:6,label:'Moderee - TNS',severity:'moderate' as const},
          {min:7,max:10,label:'Forte - TNS + varenicline',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le test de Fagerstrom evalue la dependance physique a la nicotine. Score >= 7 = forte dependance justifiant TNS (traitement nicotinique substitutif).`,
  clinicalCommentary: `Le craving et la dependance comportementale sont egalement importants. L'arret du tabac reduit de 50% le risque CV a 1 an.`,
  references: [
    {type:`pubmed`,title:`Heatherton TF et al. Br J Addict 1991`,pmid:`1958451`}
  ],
}
export default tabac_dependance
