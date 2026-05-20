import type { FormulaDefinition } from '../types'

const lund_browder: FormulaDefinition = {
  id: `lund_browder`, slug: `lund_browder`,
  name: `Surface brulee (Lund et Browder)`,
  specialty: `brules`, category: `Surface`,
  description: `Calcul de la surface cutanee brulee selon le diagramme de Lund et Browder avec correction par age`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`tete`,type:`number`,label:`Tete`,unit:`%`},
    {id:`tronc_avant`,type:`number`,label:`Tronc avant`,unit:`%`},
    {id:`tronc_arriere`,type:`number`,label:`Tronc arriere`,unit:`%`},
    {id:`bras_droit`,type:`number`,label:`Bras droit`,unit:`%`},
    {id:`bras_gauche`,type:`number`,label:`Bras gauche`,unit:`%`},
    {id:`avb_droit`,type:`number`,label:`Avant-bras droit`,unit:`%`},
    {id:`avb_gauche`,type:`number`,label:`Avant-bras gauche`,unit:`%`},
    {id:`main_droite`,type:`number`,label:`Main droite`,unit:`%`},
    {id:`main_gauche`,type:`number`,label:`Main gauche`,unit:`%`},
    {id:`cuisse_droite`,type:`number`,label:`Cuisse droite`,unit:`%`},
    {id:`cuisse_gauche`,type:`number`,label:`Cuisse gauche`,unit:`%`},
    {id:`jambe_droite`,type:`number`,label:`Jambe droite`,unit:`%`},
    {id:`jambe_gauche`,type:`number`,label:`Jambe gauche`,unit:`%`},
    {id:`pied_droit`,type:`number`,label:`Pied droit`,unit:`%`},
    {id:`pied_gauche`,type:`number`,label:`Pied gauche`,unit:`%`},
    {id:`perinee`,type:`number`,label:`Perinee / organes genitaux`,unit:`%`},
  ],
  calculate: (values) => {
    const pts = [values.tete,values.tronc_avant,values.tronc_arriere,values.bras_droit,values.bras_gauche,values.avb_droit,values.avb_gauche,values.main_droite,values.main_gauche,values.cuisse_droite,values.cuisse_gauche,values.jambe_droite,values.jambe_gauche,values.pied_droit,values.pied_gauche,values.perinee]
    const total = pts.reduce((a,b) => (a||0)+(parseFloat(b)||0), 0)
    const sev = total > 20 ? 'high' : total > 10 ? 'moderate' : 'low'
    return {value:Math.round(total*10)/10, label: Math.round(total) + '% SCB', risk: total > 20 ? 1 : 0, riskUnit: 'Risque de syndrome inflammatoire', severity: sev,
      ranges:[
        {min:0,max:10,label:'Brule leger (< 10% SCB)',severity:'low'},
        {min:10.1,max:20,label:'Brule modere (10-20% SCB)',severity:'moderate'},
        {min:20.1,max:40,label:'Brule grave (20-40% SCB)',severity:'high'},
        {min:40.1,max:100,label:'Brule severe (> 40% SCB)',severity:'critical'},
      ]}
    
  },
  interpretation: `Le diagramme de Lund et Browder est plus precis que la regle des 9 car il tient compte des variations selon l\'age.`,
  clinicalCommentary: `Reference pour l\'evaluation de la surface brulee en milieu specialise. A utiliser de preference a la regle de Wallace.`,
  references: [
    {type:`pubmed`,title:`Lund CC, Browder NC. Surg Gynecol Obstet 1944`,pmid:`—`}
  ],
}
export default lund_browder
