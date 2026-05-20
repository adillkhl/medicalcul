import type { FormulaDefinition } from '../types'

const timinst: FormulaDefinition = {
  id: 'timi-nstemi', slug: 'timinst',
  name: "TIMI — SCA non ST+ (Score)",
  specialty: 'cardiologie', category: 'Syndrome coronarien',
  description: "Thrombolysis In Myocardial Infarction Risk Score pour les syndromes coronariens aigus sans sus-décalage ST",
  version: '2024', lastValidated: '2024-01', evidenceLevel: 'A',
  inputs: [
    {id:'age65',type:'boolean',label:'Âge ≥ 65 ans'},
    {id:'risk3',type:'boolean',label:'≥ 3 facteurs de risque CV (HTA, diabète, tabac, dyslipidémie, ATCD familiaux)'},
    {id:'stenosis',type:'boolean',label:'Sténose coronaire connue > 50%'},
    {id:'stChange',type:'boolean',label:'Modification ST à l’ECG (≥ 0.5 mm)'},
    {id:'angina7d',type:'boolean',label:'≥ 2 épisodes angineux dans les 24 dernières heures'},
    {id:'aspirin',type:'boolean',label:'Aspirine dans les 7 derniers jours'},
    {id:'highTrop',type:'boolean',label:'Biomarqueurs élevés (troponine > 3x)'},
  ],
  calculate: (values) => {
    const score = ['age65','risk3','stenosis','stChange','angina7d','aspirin','highTrop'].filter(k => values[k]).length
    return {
      value: score,
      label: score >= 5 ? 'Haut risque' : score >= 3 ? 'Risque intermédiaire' : 'Faible risque',
      risk: score >= 5 ? 26 : score >= 3 ? 13 : 5,
      riskUnit: '% risque d’événements à 14 jours (décès, IDM, ischémie)',
      severity: score >= 5 ? 'high' : score >= 3 ? 'moderate' : 'low',
      ranges: [
        {min:0,max:2,label:'0-2 - Faible risque (5% évts)',severity:'low' as const,recommendation:"Stratégie invasive ou conservative selon troponine. Décision collégiale."},
        {min:3,max:4,label:'3-4 - Risque intermédiaire (13% évts)',severity:'moderate' as const,recommendation:"Coronarographie dans les 72h. Traitement antithrombotique optimal."},
        {min:5,max:7,label:'5-7 - Haut risque (26% évts)',severity:'high' as const,recommendation:"Coronarographie urgente (< 24h). Coronarographie à la phase aiguë. Anticoagulation + double antiagrégation."},
      ],
    }
  },
  interpretation: `Le **TIMI Risk Score for UA/NSTEMI** est un score simple à 7 items.

**Items (1 point chacun) :** âge ≥ 65, ≥ 3 FDR, sténose connue > 50%, modification ST, ≥ 2 épisodes angineux/24h, aspirine dans les 7j, troponine élevée.

**Seuils :** 0-2 faible, 3-4 intermédiaire, 5-7 élevé.`,
  clinicalCommentary: `Le TIMI NSTEMI est un score historique, largement remplacé par le GRACE qui est plus performant. Cependant, le TIMI reste utile pour sa simplicité d’utilisation au lit du patient. Utile pour un triage rapide aux urgences.`,
  references: [{type:'pubmed',title:'Antman EM et al. TIMI Risk Score for UA/NSTEMI. JAMA 2000',pmid:'10912066'}],
}
export default timinst
