import type { FormulaDefinition } from '../types'

const timed_up_and_go: FormulaDefinition = {
  id: `timed_up_and_go`, slug: `timed_up_and_go`,
  name: `Timed Up and Go (TUG) - Version detaillee`,
  specialty: `geriatrie`, category: `Evaluation Motrice`,
  description: `TUG detaille avec interpretation selon les classes de risque fonctionnel et de chute`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`temps`,type:`number`,label:`Temps total (secondes)`,unit:`s`,min:0,step:0.1,placeholder:`Entrez le temps en secondes`},
    {id:`aide_technique`,type:`boolean`,label:`Utilisation d'une aide technique (canne, deambulateur)`},
    {id:`ralentissement`,type:`boolean`,label:`Ralentissement observe ou apprehention a la marche`},
  ],
  calculate: (values) => {
    const t = parseFloat(values.temps||0)
    const aide = values.aide_technique?1:0
    const ralent = values.ralentissement?1:0
    
    let label = ``
    let sev: 'low' | 'moderate' | 'high' = `low`
    if (t < 10) { label = `Normal - Mobilite libre`; sev = `low` }
    else if (t < 14) { label = `Risque de chute faible`; sev = `low` }
    else if (t < 20) { label = `Risque de chute modere`; sev = `moderate` }
    else { label = `Risque de chute eleve`; sev = `high` }
    
    if (ralent) label += ` (ralentissement observe)`
    if (aide) label += ` [aide technique]`
    
    return {value:t, unit:`s`, label, severity: sev,
      ranges:[
        {min:0,max:9.9,label:`Normal - Personne en bonne sante`,severity:`low`},
        {min:10,max:13.9,label:`Faible risque de chute - Personne agee autonome`,severity:`low`},
        {min:14,max:19.9,label:`Risque modere de chute - Fragilite debutante`,severity:`moderate`},
        {min:20,max:999,label:`Risque eleve de chute - Dependance motrice`,severity:`high`},
      ]}
  },
  interpretation: `Le TUG evalue la mobilite fonctionnelle. Le patient doit se lever d'une chaise (hauteur 46cm), marcher 3 metres, faire demi-tour, revenir et se rasseoir.<br/><br/>Interpretation:<br/>• < 10s: Normal, mobilite libre<br/>• 10-13.9s: Risque faible (personne agee autonome)<br/>• 14-19.9s: Risque modere (fragilite)<br/>• ≥ 20s: Risque eleve de chute et de perte d'autonomie<br/><br/>Le seuil de 13.5s est le plus utilise pour identifier les patients a risque de chute.`,
  clinicalCommentary: `Test valide et reproductible. Le seuil de 13.5 secondes est le plus utilise dans la litterature. Un TUG > 30 secondes est associe a une dependance pour les activites de la vie quotidienne. Influence par l'age, le sexe et la taille. A effectuer avec les chaussures habituelles du patient.`,
  references: [
    {type:`pubmed`,title:`Podsiadlo D, Richardson S. J Am Geriatr Soc 1991`,pmid:`1991946`},
    {type:`pubmed`,title:`Bohannon RW. Phys Ther 2006`,pmid:`16571512`},
  ],
}
export default timed_up_and_go
