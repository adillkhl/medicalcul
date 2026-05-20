import type { FormulaDefinition } from '../types'

const dysmorphisme: FormulaDefinition = {
  id: `dysmorphisme`, slug: `dysmorphisme`,
  name: `Score de Dysmorphisme Néonatal`,
  specialty: `pediatrie`, category: `Genetique`,
  description: `Évaluation clinique des anomalies morphologiques néonatales pour orienter le diagnostic syndromique`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `C`,
  inputs: [
    {id:`face`,type:`radio`,label:`Dysmorphie faciale`,options:[{value:0,label:`Absente`},{value:1,label:`Mineure (1-2 signes)`},{value:2,label:`Majeure (> 2 signes évocateurs)`}]},
    {id:`yeux2`,type:`radio`,label:`Anomalies oculaires / palpébrales`,options:[{value:0,label:`Normales`},{value:1,label:`Hypertélorisme/hypotélorisme léger`},{value:2,label:`Fentes palpébrales, épicanthus, colobome`}]},
    {id:`oreilles`,type:`radio`,label:`Oreilles`,options:[{value:0,label:`Normales`},{value:1,label:`Bas implantées / mal ourlées`},{value:2,label:`Très dysplasiques / absence de lobe`}]},
    {id:`membres`,type:`radio`,label:`Membres / extrémités`,options:[{value:0,label:`Normaux`},{value:1,label:`Clinodactylie, pli palmaire unique`},{value:2,label:`Syndactylie, brachydactylie sévère`}]},
    {id:`thorax`,type:`radio`,label:`Thorax / rachis`,options:[{value:0,label:`Normal`},{value:1,label:`Thorax étroit / léger cyphose`},{value:2,label:`Pectus excavatum / carinatum`}]},
    {id:`neurologique`,type:`radio`,label:`Signes neurologiques associés`,options:[{value:0,label:`Absents`},{value:1,label:`Hypotonie modérée`},{value:2,label:`Hypotonie sévère / convulsions`}]},
  ],
  calculate: (values) => {
    const s = (values.face??0)+(values.yeux2??0)+(values.oreilles??0)+(values.membres??0)+(values.thorax??0)+(values.neurologique??0)
    const sev = s >= 6 ? 'high' : s >= 3 ? 'moderate' : 'low'
    return {value:s, label:`Score de dysmorphisme ${s}/12`, severity: sev,
      ranges:[
        {min:0,max:2,label:`Faible probabilité de syndrome génétique`,severity:'low',recommendation:`Surveillance clinique. Pas d'examen complémentaire systématique.`},
        {min:3,max:5,label:`Probabilité intermédiaire — Avis spécialisé conseillé`,severity:'moderate',recommendation:`Consultation de génétique clinique. Selon contexte : caryotype, analyse chromosomique sur puce (ACPA/SNP-array).`},
        {min:6,max:12,label:`Forte probabilité — Syndrome génétique probable`,severity:'high',recommendation:`Avis génétique urgent. Examens de première intention : caryotype + ACPA. Recherche de syndrome spécifique selon la dysmorphie. Bilan malformatif associé (échographie cardiaque, rénale, cérébrale).`},
      ]}
  },
  interpretation: `Score clinique d'orientation pour le diagnostic de dysmorphie néonatale. 6 items : face, yeux, oreilles, membres, thorax/rachis, signes neurologiques. Chaque item côté 0-2. Un score ≥ 3 justifie un avis génétique. Un score ≥ 6 justifie un bilan malformatif complet et une analyse génétique.`,
  clinicalCommentary: `Outil d'orientation clinique simple. Ne remplace pas l'examen par un généticien. Les dysmorphies mineures isolées (ex : pli palmaire unique uni) sans autre anomalie n'ont pas de valeur pathologique. Associations de 3 dysmorphies mineures ou plus = risque de syndrome. Toujours examiner les parents (variante familiale possible).`,
  references: [
    {type:`guideline`,title:`HAS — Diagnostic de dysmorphie néonatale (2022)`,url:`https://www.has-sante.fr/`},
    {type:`pubmed`,title:`Aase JM. Diagnostic dysmorphology. Pediatrics 1992`,pmid:`1738519`},
  ],
}
export default dysmorphisme
