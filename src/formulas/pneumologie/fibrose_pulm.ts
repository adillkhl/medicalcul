import type { FormulaDefinition } from '../types'

const fibrose_pulm: FormulaDefinition = {
  id: `fibrose_pulm`, slug: `fibrose_pulm`,
  name: `Fibrose pulmonaire (Classification)`,
  specialty: `pneumologie`, category: `Poumon interstitiel`,
  description: `Classification des pneumopathies interstitielles diffuses (PID) selon la clinique et le scanner`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`debut`,type:`radio`,label:`Debut des symptomes`,options:[{value:0,label:`Aigu (< 3 mois)`},{value:1,label:`Subaigu (3-12 mois)`},{value:2,label:`Chronique (> 12 mois)`}]},
    {id:`toux`,type:`boolean`,label:`Toux seche`,weight:1},
    {id:`dyspnee`,type:`boolean`,label:`Dyspnee d effort`,weight:1},
    {id:`crepitants`,type:`boolean`,label:`Crepitants velcro`,weight:1},
    {id:`hippocratisme`,type:`boolean`,label:`Hippocratisme digital`,weight:1},
    {id:`tabac`,type:`boolean`,label:`Tabagisme > 30 PA`,weight:1},
    {id:`connectivite`,type:`boolean`,label:`Connectivite / expositions pro`,weight:1},
  ],
  calculate: (values) => {
    const debut = parseInt(values.debut)||0; const s = (values.toux?1:0)+(values.dyspnee?1:0)+(values.crepitants?1:0)+(values.hippocratisme?1:0)+(values.tabac?1:0)+(values.connectivite?1:0)
        const sev = s >= 4 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = debut === 0 ? 'PID aigue possible (hypersensibilite, eosinophilique)' : debut === 1 ? 'PID subaigu (NSIP, sarcoidose)' : 'PID chronique (PIU, fibrose) probable'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:1,label:'PID peu probable',severity:'low' as const},
          {min:2,max:3,label:'PID possible - Scanner + EFR',severity:'moderate' as const},
          {min:4,max:6,label:'PID probable - Avis specialise',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Les PID classifient selon le mode d\'installation, le scanner et le contexte. La fibrose pulmonaire idiopathique est la plus severe.`,
  clinicalCommentary: `Le scanner HR coupe fine est l\'examen cle. Les crepitants velcro sont tres evocateur de fibrose. La biopsie chirurgicale est parfois necessaire.`,
  references: [
    {type:`pubmed`,title:`Travis WD et al. Am J Respir Crit Care Med 2013`,pmid:`23549056`}
  ],
}
export default fibrose_pulm
