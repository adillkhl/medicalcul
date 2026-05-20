import type { FormulaDefinition } from '../types'

const apache2: FormulaDefinition = {
  id: `apache2`, slug: `apache2`,
  name: `APACHE II (Acute Physiology And Chronic Health Evaluation)`,
  specialty: `reanimation`, category: `Gravite`,
  description: `Score pronostique de mortalite en reanimation : 12 paramètres physiologiques + age + maladie chronique (0-71)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`temperature`,type:`radio`,label:`Temperature rectale (°C)`,options:[{value:0,label:`36-38.4`},{value:1,label:`34-35.9 ou 38.5-38.9`},{value:2,label:`32-33.9`},{value:3,label:`30-31.9 ou 39-40.9`},{value:4,label:`<= 29.9 ou >= 41`}]},
    {id:`pam`,type:`radio`,label:`Pression arterielle moyenne (mmHg)`,options:[{value:0,label:`70-109`},{value:2,label:`50-69 ou 110-129`},{value:3,label:`130-159`},{value:4,label:`<= 49 ou >= 160`}]},
    {id:`fc`,type:`radio`,label:`Frequence cardiaque (/min)`,options:[{value:0,label:`70-109`},{value:1,label:`40-54 ou 110-139`},{value:2,label:`55-69 ou 140-179`},{value:4,label:`<= 39 ou >= 180`}]},
    {id:`fr`,type:`radio`,label:`Frequence respiratoire (/min)`,options:[{value:0,label:`12-24`},{value:1,label:`25-34`},{value:2,label:`6-11 ou 35-49`},{value:3,label:`35-49`},{value:4,label:`<= 5 ou >= 50`}]},
    {id:`oxygenation`,type:`radio`,label:`Oxygenation (selon FiO2)`,options:[{value:0,label:`FiO2 >= 0.5: PaO2 >= 200 ou FiO2 < 0.5: PaO2 > 70`},{value:1,label:`FiO2 >= 0.5: PaO2 100-199`},{value:2,label:`FiO2 >= 0.5: PaO2 80-99 ou FiO2 < 0.5: PaO2 61-70`},{value:3,label:`FiO2 >= 0.5: PaO2 55-79 ou FiO2 < 0.5: PaO2 55-60`},{value:4,label:`FiO2 >= 0.5: PaO2 < 55 ou FiO2 < 0.5: PaO2 < 55`}]},
    {id:`ph_arteriel`,type:`radio`,label:`pH arteriel`,options:[{value:0,label:`7.33-7.49`},{value:1,label:`7.5-7.59`},{value:2,label:`7.25-7.32`},{value:3,label:`7.15-7.24 ou 7.6-7.69`},{value:4,label:`< 7.15 ou >= 7.7`}]},
    {id:`sodium`,type:`radio`,label:`Sodium (mmol/L)`,options:[{value:0,label:`130-149`},{value:1,label:`150-154`},{value:2,label:`120-129 ou 155-159`},{value:3,label:`160-179`},{value:4,label:`<= 119 ou >= 180`}]},
    {id:`potassium`,type:`radio`,label:`Potassium (mmol/L)`,options:[{value:0,label:`3.5-5.4`},{value:1,label:`3-3.4 ou 5.5-5.9`},{value:2,label:`2.5-2.9`},{value:3,label:`6-6.9`},{value:4,label:`< 2.5 ou >= 7`}]},
    {id:`creatinine`,type:`radio`,label:`Creatinine (mg/dL)`,options:[{value:0,label:`0.6-1.4`},{value:2,label:`< 0.6 ou 1.5-1.9`},{value:3,label:`2-3.4`},{value:4,label:`>= 3.5`}]},
    {id:`hematocrite`,type:`radio`,label:`Hematocrite (%)`,options:[{value:0,label:`30-45.9`},{value:1,label:`46-49.9`},{value:2,label:`20-29.9 ou 50-59.9`},{value:4,label:`< 20 ou >= 60`}]},
    {id:`gb`,type:`radio`,label:`Leucocytes (x1000/mm3)`,options:[{value:0,label:`3-14.9`},{value:1,label:`15-19.9`},{value:2,label:`20-39.9`},{value:3,label:`1-2.9 ou >= 40`},{value:4,label:`< 1`}]},
    {id:`bicarbonates`,type:`radio`,label:`Bicarbonates venoveux (mmol/L) si pH non dispo`,options:[{value:0,label:`22-31.9`},{value:1,label:`32-40.9`},{value:2,label:`18-21.9`},{value:3,label:`15-17.9 ou 41-51.9`},{value:4,label:`< 15 ou >= 52`}]},
    {id:`age`,type:`radio`,label:`Age du patient`,options:[{value:0,label:`< 44 ans`},{value:2,label:`45-54 ans`},{value:3,label:`55-64 ans`},{value:5,label:`65-74 ans`},{value:6,label:`>= 75 ans`}]},
    {id:`maladie_chronique`,type:`radio`,label:`Antecedent de maladie chronique severe`,options:[{value:0,label:`Pas d'antecedent`},{value:2,label:`Maladie chronique (si non chirurgical)`},{value:5,label:`Maladie chronique (si post-chirurgie urgente)`}]},
  ],
  calculate: (values) => {
    const physio_items = ['temperature','pam','fc','fr','oxygenation','ph_arteriel','sodium','potassium','creatinine','hematocrite','gb','bicarbonates']
    const physio = physio_items.reduce((acc,id) => acc + (values[id]??0), 0)
    const age_score = values.age ?? 0
    const chronic = values.maladie_chronique ?? 0
    const total = physio + age_score + chronic
    const mortalite_estimee = total < 5 ? 1 : total < 10 ? 5 : total < 15 ? 15 : total < 20 ? 25 : total < 25 ? 40 : total < 30 ? 55 : total < 35 ? 75 : 85
    const sev = total >= 20 ? 'high' as const : total >= 10 ? 'moderate' as const : 'low' as const
    return {value:total, label:`APACHE II ${total}/71`, severity: sev,
      details:{physiologique:physio,age:age_score,chronique:chronic,mortalite_estimee:`${mortalite_estimee}%`},
      ranges:[
        {min:0,max:4,label:`Gravite faible`,severity:'low'},
        {min:5,max:9,label:`Gravite legere`,severity:'low'},
        {min:10,max:14,label:`Gravite moderee`,severity:'moderate'},
        {min:15,max:19,label:`Gravite moderee a severe`,severity:'moderate'},
        {min:20,max:24,label:`Gravite severe`,severity:'high'},
        {min:25,max:34,label:`Gravite tres severe`,severity:'high'},
        {min:35,max:71,label:`Gravite extreme`,severity:'high'},
      ]}
  },
  interpretation: `L'APACHE II est le score de gravite le plus utilise en reanimation. 12 variables physiologiques (0-4 points), age (0-6), maladie chronique (0-5). Score total 0-71. Correlle a la mortalite hospitaliere. A calculer dans les 24h suivant l'admission en reanimation.`,
  clinicalCommentary: `Reference internationale pour la stratification de la gravite en reanimation. A utiliser a l'admission (pires valeurs des 24 premieres heures). Ne donne pas de probabilite individuelle de survie. Les maladies chroniques comprennent : insuffisance hepatique, cardiaque (NYHA IV), respiratoire severe, immunodepression, insuffisance renale chronique dialysee. Apres mise a jour, utilisez l'APACHE IV plus recent.`,
  references: [
    {type:`pubmed`,title:`Knaus WA et al. APACHE II: a severity of disease classification system. Crit Care Med 1985`,pmid:`3928249`},
    {type:`pubmed`,title:`Knaus WA et al. The APACHE III prognostic system. Chest 1991`,pmid:`1959106`},
  ],
}
export default apache2
