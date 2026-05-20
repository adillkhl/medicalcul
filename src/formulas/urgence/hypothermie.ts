import type { FormulaDefinition } from '../types'

const hypothermie: FormulaDefinition = {
  id: `hypothermie`, slug: `hypothermie`,
  name: `Hypothermie (Gravite)`,
  specialty: `urgence`, category: `Temperature`,
  description: `Classification de la severite de l\'hypothermie accidentelle`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`temperature`,type:`number`,label:`Temperature centrale`,unit:`°C`},
    {id:`frissons`,type:`boolean`,label:`Frissons presents`,weight:1},
    {id:`trouble_conscience`,type:`boolean`,label:`Trouble de conscience`,weight:1},
    {id:`ecg`,type:`boolean`,label:`ECG anormal (onde J d Osborne, arythmie)`,weight:1},
    {id:`arret_cardiaque`,type:`boolean`,label:`Arret cardiaque`,weight:1},
  ],
  calculate: (values) => {
    const t = parseFloat(values.temperature)||37; const fr = values.frissons?0:1; const tc = values.trouble_conscience?1:0; const ecg = values.ecg?1:0; const ac = values.arret_cardiaque?1:0
        let sev = 'low'; let label = ''
        if (ac) { sev = 'critical'; label = 'Arret cardiaque hypothermique - RCP prolongee + ECMO' }
        else if (t < 28) { sev = 'high'; label = 'Hypothermie severe (< 28C) - Rechauffement actif interne' }
        else if (t < 32) { sev = 'moderate'; label = 'Hypothermie moderee (28-32C) - Rechauffement actif externe' }
        else if (t < 35) { sev = 'low'; label = 'Hypothermie legere (32-35C) - Rechauffement passif' }
        else { label = 'Temperature normale' }
        const retval = t; const retlabel = label; const retsev = sev
        const ranges = [
          {min:35,max:37.4,label:'Normale',severity:'low' as const},
          {min:32,max:34.9,label:'Hypothermie legere',severity:'low' as const},
          {min:28,max:31.9,label:'Hypothermie moderee',severity:'moderate' as const},
          {min:0,max:27.9,label:'Hypothermie severe',severity:'high' as const},
        ]
        return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `L\'hypothermie accidentelle se definit par une temperature centrale < 35°C. Le stade severite guide le rechauffement.`,
  clinicalCommentary: `L\'arret cardiaque hypothermique est reversible si on rechauffe. La RCP peut etre prolongee. Pas de limites d\'age pour la RCP. ECMO si disponible.`,
  references: [
    {type:`pubmed`,title:`Brown DJ et al. N Engl J Med 2012`,pmid:`23117979`}
  ],
}
export default hypothermie
