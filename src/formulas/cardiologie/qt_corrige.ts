import type { FormulaDefinition } from '../types'

const qt_corrige: FormulaDefinition = {
  id: `qt_corrige`, slug: `qt_corrige`,
  name: `QT corrige (Calcul)`,
  specialty: `cardiologie`, category: `ECG`,
  description: `Calcul du QT corrige par la formule de Bazett`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `B`,
  inputs: [
    {id:`qt`,type:`number`,label:`QT mesure`,unit:`ms`},
    {id:`fc`,type:`number`,label:`Frequence cardiaque`,unit:`bpm`},
  ],
  calculate: (values) => {
    const qt = parseFloat(values.qt)||400
        const fc = parseFloat(values.fc)||70
        const qtc = Math.round(qt / Math.sqrt(60/fc))
        const sev = qtc >= 500 ? 'high' : qtc >= 460 ? 'moderate' : 'low'
        const label = qtc + ' ms (Bazett)'
        const retval = qtc
        const retlabel = label
        const retsev = sev
        const ranges = [
          {min:0,max:430,label:'Normal (< 430 ms)',severity:'low' as const},
          {min:431,max:459,label:'Limite (430-459 ms)',severity:'low' as const},
          {min:460,max:499,label:'Allonge (460-499 ms)',severity:'moderate' as const},
          {min:500,max:999,label:'Tres allonge (≥ 500 ms) - risque de torsade',severity:'high' as const},
        ]
    return {value:retval, label:retlabel, severity:retsev, ranges}
  },
  interpretation: `Le QT corrige (QTc) par Bazett corrige le QT pour la frequence cardiaque. QTc > 460 ms est anormal, > 500 ms est a risque de torsade de pointes.`,
  clinicalCommentary: `La formule de Bazett surestime le QTc en cas de tachycardie et le sous-estime en bradycardie. Formules alternatives: Fridericia (cube root) ou Framingham. Devant un QTc long, verifier les electrolytes (K+, Mg2+, Ca2+) et les medicaments allongeants.`,
  references: [
    {type:`pubmed`,title:`Bazett HC. Heart 1920`,pmid:`—`}
  ],
}
export default qt_corrige
