import type { FormulaDefinition } from '../types'

const inhalation_fumee: FormulaDefinition = {
  id: `inhalation_fumee`, slug: `inhalation_fumee`,
  name: `Inhalation de fumees (Score)`,
  specialty: `brules`, category: `Inhalation`,
  description: `Score diagnostique clinique de tri pour les inhalations de fumees d\'incendies`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`enfermement`,type:`boolean`,label:`Enfermement dans un espace clos`,weight:1},
    {id:`brulure_face`,type:`boolean`,label:`Brulure faciale`,weight:1},
    {id:`poils_nez`,type:`boolean`,label:`Poils nasaux brulees`,weight:1},
    {id:`voix_rauque`,type:`boolean`,label:`Voix rauque / dysphonie`,weight:1},
    {id:`stridor`,type:`boolean`,label:`Stridor / wheezing / toux`,weight:1},
    {id:`expectoration`,type:`boolean`,label:`Expectoration charbonneuse`,weight:2},
    {id:`hypoxie`,type:`boolean`,label:`Hypoxie (SpO2 < 92%)`,weight:2},
    {id:`trou_conscience`,type:`boolean`,label:`Troubles de conscience`,weight:2},
  ],
  calculate: (values) => {
    const s = (values.enfermement?1:0)+(values.brulure_face?1:0)+(values.poils_nez?1:0)+(values.voix_rauque?1:0)+(values.stridor?1:0)+(values.expectoration?2:0)+(values.hypoxie?2:0)+(values.trou_conscience?2:0)
    const sev = s>=5?'high':s>=3?'moderate':'low'
    const label = s < 3 ? 'Faible suspicion' : s < 5 ? 'Suspicion moderee' : `Forte suspicion d\'inhalation`
    return {value:s, label, severity: sev,
      ranges:[
        {min:0,max:2,label:'Faible suspicion - Surveillance simple',severity:'low'},
        {min:3,max:4,label:'Suspicion moderee - Fibroscopie bronchique',severity:'moderate'},
        {min:5,max:999,label:'Forte suspicion - Intubation prophylactique?',severity:'high'},
      ]}
    
  },
  interpretation: `Score clinique de suspicion d\'inhalation de fumees. Combine l\'anamnese et les signes cliniques.`,
  clinicalCommentary: `L\'inhalation de fumees est un facteur de mortalite majeur chez le brule. La fibroscopie bronchique reste le gold standard diagnostique.`,
  references: [
    {type:`pubmed`,title:`Mlcak RP et al. Respir Care 2007`,pmid:`17697425`}
  ],
}
export default inhalation_fumee
