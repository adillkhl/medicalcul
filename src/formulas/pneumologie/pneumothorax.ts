import type { FormulaDefinition } from '../types'

const pneumothorax: FormulaDefinition = {
  id: `pneumothorax`, slug: `pneumothorax`,
  name: `Pneumothorax (Classification)`,
  specialty: `pneumologie`, category: `Thorax`,
  description: `Classification et prise en charge du pneumothorax`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`type`,type:`radio`,label:`Type`,options:[{value:0,label:`Spontane primaire`},{value:1,label:`Spontane secondaire`},{value:2,label:`Traumatique`},{value:3,label:`Sous tension`}]},
    {id:`taille`,type:`radio`,label:`Taille`,options:[{value:0,label:`Petit (< 2 cm apical)`},{value:1,label:`Moyen (2-4 cm)`},{value:2,label:`Grand (> 4 cm ou complet)`}]},
    {id:`dyspnee`,type:`boolean`,label:`Dyspnee severe`,weight:1},
    {id:`hypermobilite`,type:`boolean`,label:`Signes de tension (distension, deviation TLC)`,weight:1},
  ],
  calculate: (values) => {
    const type = parseInt(values.type)||0; const taille = parseInt(values.taille)||0; const dysp = values.dyspnee?1:0; const tens = values.hypermobilite?1:0
        const s = taille + dysp + (tens?3:0)
        const sev = tens ? 'critical' : s >= 3 ? 'high' : s >= 2 ? 'moderate' : 'low'
        let label = ''
        if (tens) label = 'Pneumothorax sous tension - EXSUFFLATION IMMEDIATE'
        else if (taille === 0 && type === 0) label = 'Petit pneumothorax - Abstention + surveillance'
        else if (taille >= 1 || type >= 1) label = 'Drainage thoracique'
        else label = 'Surveillance'
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [
          {min:0,max:0,label:'Petit - Surveillance',severity:'low' as const},
          {min:1,max:2,label:'Drainage probable',severity:'moderate' as const},
          {min:3,max:3,label:'Drainage necessaire',severity:'high' as const},
          {min:4,max:999,label:'URGENCE - Tension',severity:'critical' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `Le pneumothorax spontane primaire (sujet sain) peut etre surveille si petit (< 2 cm). Spontane secondaire (BPCO, fibrose) necessite souvent un drainage.`,
  clinicalCommentary: `Le pneumothorax sous tension est une urgence vitale (exsufflation a l\'aiguille en 2e espace intercostal ligne M-C). Le drainage est indique si taille > 2 cm, secondaire, ou symptomatique.`,
  references: [
    {type:`pubmed`,title:`MacDuff A et al. Thorax 2010`,pmid:`20696681`}
  ],
}
export default pneumothorax
