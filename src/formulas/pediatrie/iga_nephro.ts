import type { FormulaDefinition } from '../types'

const iga_nephro: FormulaDefinition = {
  id: `iga_nephro`, slug: `iga_nephro`,
  name: `Classification de l\'Iga Nephropathie (MEST-C / Oxford)`,
  specialty: `pediatrie`, category: `Nephrologie`,
  description: `Classification histopathologique de la nephropathie a IgA selon le score de Oxford MEST-C pour le pronostic renal`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`mesangial`,type:`radio`,label:`M (Hypercellularite mesangiale)`,options:[{value:0,label:`M0 - < 50% des glomerules`},{value:1,label:`M1 - >= 50% des glomerules`}]},
    {id:`endocapillaire`,type:`radio`,label:`E (Hypercellularite endocapillaire)`,options:[{value:0,label:`E0 - Absente`},{value:1,label:`E1 - Presente`}]},
    {id:`sclerose`,type:`radio`,label:`S (Sclerose segmentaire)`,options:[{value:0,label:`S0 - Absente`},{value:1,label:`S1 - Presente`}]},
    {id:`tubulaire`,type:`radio`,label:`T (Atrophie tubulaire / Fibrose interstitielle)`,options:[{value:0,label:`T0 - 0-25%`},{value:1,label:`T1 - 26-50%`},{value:2,label:`T2 - > 50%`}]},
    {id:`croissants`,type:`radio`,label:`C (Croissants cellulaires)`,options:[{value:0,label:`C0 - Absents`},{value:1,label:`C1 - < 25% des glomerules`},{value:2,label:`C2 - >= 25% des glomerules`}]},
  ],
  calculate: (values) => {
    const m = values.mesangial ?? 0
    const e = values.endocapillaire ?? 0
    const s = values.sclerose ?? 0
    const t = values.tubulaire ?? 0
    const c = values.croissants ?? 0
    const score_global = m + e + s + t + c
    const sev = t >= 2 || score_global >= 4 ? `high` : t >= 1 || score_global >= 2 ? `moderate` : `low`
    return {value:score_global, label:`MEST-C: M${m} E${e} S${s} T${t} C${c}`, severity: sev,
      details:{M:m,E:e,S:s,T:t,C:c},
      ranges:[
        {min:0,max:1,label:`Risque faible de progression`,severity:`low`,recommendation:`Surveillance annuelle (creatinine, proteinurie, PA). Pas d\'immunosuppression systematique.`},
        {min:2,max:3,label:`Risque intermediaire de progression`,severity:`moderate`,recommendation:`IEC/ARA2 si proteinurie. Discuter corticotherapie selon proteinurie persistante > 1g/j et fonction renale.`},
        {min:4,max:7,label:`Risque eleve de progression renale`,severity:`high`,recommendation:`Corticotherapie prolongee +/- immunosuppresseurs. Surveillance rapprochee de la fonction renale. Avis nephrologique specialise.`},
      ]}
  },
  interpretation: `La classification MEST-C de Oxford (2017) est le gold standard histopathologique pour la nephropathie a IgA. 5 items : M (hypercellularite mesangiale), E (endocapillaire), S (sclerose), T (atrophie tubulaire/fibrose), C (croissants). Le score T est le plus predictif du pronostic renal a long terme.`,
  clinicalCommentary: `Utilisee pour la stratification du risque de progression de la maladie renale. Recommandee par KDIGO 2021. Les patients avec T2 ont un risque eleve d\'insuffisance renale terminale. La biopsie renale reste indispensable pour le diagnostic et la classification. Ne pas utiliser seule pour la decision therapeutique.`,
  references: [
    {type:`pubmed`,title:`Trimarchi H et al. Oxford Classification of IgA nephropathy 2016. Kidney Int 2017`,pmid:`28554733`},
    {type:`guideline`,title:`KDIGO 2021 - Glomerular Diseases`,url:`https://kdigo.org/guidelines/`},
  ],
}
export default iga_nephro
