import type { FormulaDefinition } from '../types'

const ybocs: FormulaDefinition = {
  id: `ybocs`, slug: `ybocs`,
  name: `Yale-Brown Obsessive Compulsive Scale (Y-BOCS)`,
  specialty: `psychiatrie`, category: `TOC`,
  description: `Echelle de 10 items evaluant la severite des obsessions (5 items) et compulsions (5 items)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`temps_obsessions`,type:`radio`,label:`O1 - Temps consacre aux obsessions`,options:[{value:0,label:`Aucun`},{value:1,label:`< 1h/jour`},{value:2,label:`1-3h/jour`},{value:3,label:`3-8h/jour`},{value:4,label:`> 8h/jour`}]},
    {id:`gene_obsessions`,type:`radio`,label:`O2 - Gene fonctionnelle des obsessions`,options:[{value:0,label:`Aucune`},{value:1,label:`Legere gene`},{value:2,label:`Gene moderee`},{value:3,label:`Gene severe`},{value:4,label:`Invalidante`}]},
    {id:`lutte_obsessions`,type:`radio`,label:`O3 - Lutte contre les obsessions`,options:[{value:0,label:`Pas besoin`},{value:1,label:`Effort modere`},{value:2,label:`Effort important`},{value:3,label:`Obnubile par la lutte`},{value:4,label:`Absorption totale`}]},
    {id:`controle_obsessions`,type:`radio`,label:`O4 - Controle sur les obsessions`,options:[{value:0,label:`Controle total`},{value:1,label:`Bon controle`},{value:2,label:`Controle modere`},{value:3,label:`Peu de controle`},{value:4,label:`Aucun controle`}]},
    {id:`evitement_obsessions`,type:`radio`,label:`O5 - Evitement des obsessions`,options:[{value:0,label:`Aucun`},{value:1,label:`Evitement leger`},{value:2,label:`Evitement modere`},{value:3,label:`Evitement frequent`},{value:4,label:`Evitement extreme`}]},
    {id:`temps_compulsions`,type:`radio`,label:`C1 - Temps consacre aux compulsions`,options:[{value:0,label:`Aucun`},{value:1,label:`< 1h/jour`},{value:2,label:`1-3h/jour`},{value:3,label:`3-8h/jour`},{value:4,label:`> 8h/jour`}]},
    {id:`gene_compulsions`,type:`radio`,label:`C2 - Gene fonctionnelle des compulsions`,options:[{value:0,label:`Aucune`},{value:1,label:`Legere gene`},{value:2,label:`Gene moderee`},{value:3,label:`Gene severe`},{value:4,label:`Invalidante`}]},
    {id:`lutte_compulsions`,type:`radio`,label:`C3 - Lutte contre les compulsions`,options:[{value:0,label:`Pas besoin`},{value:1,label:`Effort modere`},{value:2,label:`Effort important`},{value:3,label:`Lutte extreme`},{value:4,label:`Absorption totale`}]},
    {id:`controle_compulsions`,type:`radio`,label:`C4 - Controle sur les compulsions`,options:[{value:0,label:`Controle total`},{value:1,label:`Bon controle`},{value:2,label:`Controle modere`},{value:3,label:`Peu de controle`},{value:4,label:`Aucun controle`}]},
    {id:`evitement_compulsions`,type:`radio`,label:`C5 - Evitement des compulsions`,options:[{value:0,label:`Aucun`},{value:1,label:`Evitement leger`},{value:2,label:`Evitement modere`},{value:3,label:`Evitement frequent`},{value:4,label:`Evitement extreme`}]},
  ],
  calculate: (values) => {
    const items_obs = ['temps_obsessions','gene_obsessions','lutte_obsessions','controle_obsessions','evitement_obsessions']
    const items_comp = ['temps_compulsions','gene_compulsions','lutte_compulsions','controle_compulsions','evitement_compulsions']
    const obs = items_obs.reduce((acc,id) => acc + (values[id]??0), 0)
    const comp = items_comp.reduce((acc,id) => acc + (values[id]??0), 0)
    const total = obs + comp
    const sev = total >= 24 ? 'high' as const : total >= 16 ? 'moderate' as const : total >= 8 ? 'moderate' as const : 'low' as const
    return {value:total, label:`Y-BOCS ${total}/40 (Obs: ${obs}/20, Comp: ${comp}/20)`, severity: sev,
      details:{obsessions:obs,compulsions:comp},
      ranges:[
        {min:0,max:7,label:`Subclinique`,severity:'low',recommendation:`Pas de TOC significatif. Surveillance.`},
        {min:8,max:15,label:`TOC leger`,severity:'moderate',recommendation:`Psychotherapie (TCC) en premiere intention.`},
        {min:16,max:23,label:`TOC modere`,severity:'moderate',recommendation:`TCC + ISRS. Suivi specialise.`},
        {min:24,max:40,label:`TOC severe`,severity:'high',recommendation:`Traitement intensif : TCC, ISRS forte dose. Hospitalisation si risque. Avis specialise.`},
      ]}
  },
  interpretation: `La Y-BOCS evalue la severite des TOC sur 10 items : 5 pour les obsessions (O1-O5) et 5 pour les compulsions (C1-C5). Chaque item cote 0-4. Score total 0-40. Sous-scores : obsessions 0-20, compulsions 0-20.`,
  clinicalCommentary: `Gold standard pour l'evaluation de la severite des TOC dans les essais cliniques. L'entretien semi-structure (Y-BOCS Interview) est recommandee. Distingue obsessions et compulsions. Attention a ne pas confondre avec d'autres comportements repetitifs (tics, addictions). Un score < 8 apres traitement est considere comme remission.`,
  references: [
    {type:`pubmed`,title:`Goodman WK et al. The Yale-Brown Obsessive Compulsive Scale. Arch Gen Psychiatry 1989`,pmid:`2928476`},
    {type:`pubmed`,title:`Goodman WK et al. The Y-BOCS II. Arch Gen Psychiatry 1989`,pmid:`2928477`},
  ],
}
export default ybocs
