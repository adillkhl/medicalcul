import type { FormulaDefinition } from '../types'

const braden: FormulaDefinition = {
  id: `braden`, slug: `braden`,
  name: `Braden (Echelle)`,
  specialty: `dermatologie`, category: `Escarre`,
  description: `Echelle de risque d\'escarre (6 sous-echelles, totale 6-23)`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`perception`,type:`radio`,label:`Perception sensorielle`,options:[{value:1,label:`Totalement limite`},{value:2,label:`Tres limite`},{value:3,label:`Legerement limite`},{value:4,label:`Normale`}]},
    {id:`humidite`,type:`radio`,label:`Humidite`,options:[{value:1,label:`Constamment humide`},{value:2,label:`Souvent humide`},{value:3,label:`Parfois humide`},{value:4,label:`Rarement humide`}]},
    {id:`activite`,type:`radio`,label:`Activite`,options:[{value:1,label:`Alite`},{value:2,label:`Fauteuil`},{value:3,label:`Marche occasionnelle`},{value:4,label:`Marche frequente`}]},
    {id:`mobilite`,type:`radio`,label:`Mobilite`,options:[{value:1,label:`Completement immobile`},{value:2,label:`Tres limitee`},{value:3,label:`Legerement limitee`},{value:4,label:`Normale`}]},
    {id:`nutrition`,type:`radio`,label:`Nutrition`,options:[{value:1,label:`Tres pauvre`},{value:2,label:`Probablement insuffisante`},{value:3,label:`Adequate`},{value:4,label:`Excellente`}]},
    {id:`frottement`,type:`radio`,label:`Frottement / cisaillement`,options:[{value:1,label:`Probleme majeur`},{value:2,label:`Probleme potentiel`},{value:3,label:`Aucun probleme`}]},
  ],
  calculate: (values) => {
    const s = (values.perception??4)+(values.humidite??4)+(values.activite??4)+(values.mobilite??4)+(values.nutrition??4)+(values.frottement??3)
    const sev = s <= 9 ? 'high' : s <= 12 ? 'moderate' : s <= 15 ? 'low' : 'low'
    const label = s <= 9 ? 'Risque tres eleve' : s <= 12 ? 'Risque eleve' : s <= 15 ? 'Risque modere' : 'Risque faible'
    return {value:s, label, severity: sev,
      ranges:[
        {min:6,max:9,label:'Tres eleve - Prevention intensive',severity:'high'},
        {min:10,max:12,label:'Eleve - Matelas + Changements position',severity:'moderate'},
        {min:13,max:15,label:'Modere - Surveillance + Matelas',severity:'low'},
        {min:16,max:23,label:'Faible - Prevention standard',severity:'low'},
      ]}
  },
  interpretation: `L\'echelle de Braden evalue le risque d\'escarre. Plus le score est bas, plus le risque est eleve. Prevention adaptee au niveau de risque.`,
  clinicalCommentary: `Echelle la plus utilisee en soins infirmiers. Un score <= 12 est associe a un risque eleve justifiant un matelas anti-escarre et des changements de position toutes les 2h.`,
  references: [
    {type:`pubmed`,title:`Bergstrom N et al. Nurs Res 1987`,pmid:`3632864`}
  ],
}
export default braden
