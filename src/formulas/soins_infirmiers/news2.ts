import type { FormulaDefinition } from '../types'

const news2: FormulaDefinition = {
  id: `news2`, slug: `news2`,
  name: `NEWS2 (Score alerte precoce)`,
  specialty: `soins_infirmiers`, category: `Surveillance`,
  description: `National Early Warning Score pour detection deterioration clinique (avec SpO2 Scale 2 pour risque hypercapnique)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`spo2_scale`,type:`radio`,label:`Echelle SpO2 (selon risque d\'insuffisance respiratoire hypercapnique)`,options:[
      {value:1,label:`Scale 1 — Patient STANDARD`},
      {value:2,label:`Scale 2 — Risque hypercapnique (BPCO/obesite/SAS)`},
    ]},
    {id:`fc`,type:`number`,label:`Frequence cardiaque`,unit:`/min`},
    {id:`fr`,type:`number`,label:`Frequence respiratoire`,unit:`/min`},
    {id:`pas`,type:`number`,label:`PA systolique`,unit:`mmHg`},
    {id:`spo2`,type:`number`,label:`SpO2`,unit:`%`},
    {id:`supp_o2`,type:`boolean`,label:`Sous oxygene`,weight:1},
    {id:`temperature`,type:`number`,label:`Temperature`,unit:`C`},
    {id:`conscience`,type:`radio`,label:`Conscience`,options:[{value:0,label:`Alerte (A)`},{value:3,label:`Confus / Verbale / Douleur / Inconscient (CVPU)`}]},
  ],
  calculate: (values) => {
    const fc = parseFloat(values.fc)||75; const fr = parseFloat(values.fr)||16; const pas = parseFloat(values.pas)||130; const spo2 = parseFloat(values.spo2)||97; const supp = values.supp_o2?1:0; const temp = parseFloat(values.temperature)||37; const cons = parseInt(values.conscience)||0; const scale = parseInt(values.spo2_scale)||1
        let s = 0
        if (fc <= 40 || fc >= 131) s += 3; else if (fc <= 50 || fc >= 111) s += 2; else if (fc >= 91) s += 1
        if (fr <= 8 || fr >= 25) s += 3; else if (fr >= 21) s += 2
        if (pas <= 90) s += 3; else if (pas <= 100) s += 2; else if (pas >= 220) s += 3
        // SpO2 scoring
        if (scale === 2) {
          // Scale 2 — for patients at risk of hypercapnic respiratory failure (target 88-92%)
          if (spo2 <= 83) s += 3
          else if (spo2 <= 85) s += 2
          else if (spo2 <= 87) s += 1
          // 88-92 = 0 regardless of oxygen
          // >=93 on air = 0, >=93 on oxygen = 5
          else if (spo2 >= 93 && supp) s += 5
        } else {
          // Scale 1 — standard
          if (spo2 <= 83) s += 3
          else if (spo2 <= 85) s += 2
          else if (spo2 <= 87) s += 1
          else if (spo2 <= 93 && !supp) s += 1
        }
        if (supp) s += 2; if (temp <= 35) s += 3; else if (temp >= 39) s += 2; else if (temp >= 38) s += 1
        if (cons) s += 3
        const sev = s >= 7 ? 'high' : s >= 5 ? 'moderate' : s >= 1 ? 'low' : 'low'
        const label = 'NEWS2: ' + s + (scale === 2 ? ' (Scale 2)' : '')
        const retval = s; const retlabel = label; const retsev = sev
        const ranges = [{min:0,max:4,label:'Standard',severity:'low' as const},{min:5,max:6,label:'Alerte',severity:'moderate' as const},{min:7,max:999,label:'Urgence vitale',severity:'high' as const}]
      return {value:retval, label:retlabel, severity:(retsev as 'low'|'moderate'|'high'|'critical'), ranges}
  },
  interpretation: `NEWS2: score de deterioration clinique (7 parametres). Score >= 5 = alerte. >= 7 = urgence.

**SpO2 Scale 2** : pour patients a risque d\'insuffisance respiratoire hypercapnique (BPCO, obesite severe, syndrome d\'apnee du sommeil). Ces patients ont une cible de SpO2 a 88-92%. La cotation SpO2 est differente :
- SpO2 88-92% = 0 point (quel que soit l\'oxygene)
- SpO2 >= 93% sous oxygene = 5 points (hyperoxie dangereuse)`,
  clinicalCommentary: `Recommande par NICE pour detection precoce du sepsis. Utiliser Scale 2 pour les patients avec risque hypercapnique: BPCO, obésité sévère (IMC > 40), SOH, mucoviscidose, maladies neuromusculaires, déformation thoracique. Ne pas utiliser Scale 2 de facon systematique — seulement pour les personnes a risque identifie.`,
  references: [
    {type:`pubmed`,title:`RCP. NEWS2 2017`,pmid:`---`}
  ],
}
export default news2
