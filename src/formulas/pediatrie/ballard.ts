import type { FormulaDefinition } from '../types'

const ballard: FormulaDefinition = {
  id: `ballard`, slug: `ballard`,
  name: `Score de Ballard (Nouveau Ballard Score — NBS)`,
  specialty: `pediatrie`, category: `Neonatalogie`,
  description: `Évaluation de l\'âge gestationnel par maturité neurologique (6 critères) et externe (6 critères) — score total de -10 à 50`,
  version: `2024`, lastValidated: `2024-01`, evidenceLevel: `A`,
  inputs: [
    {id:`posture`,type:`radio`,label:`Posture (neurologique)`,options:[{value:-1,label:`< 26 sem: flaccide`},{value:0,label:`26 sem: début flexion hanches`},{value:1,label:`28 sem: flexion hanches + genoux`},{value:2,label:`30 sem: flexion légère des membres`},{value:3,label:`32 sem: flexion modérée`},{value:4,label:`34 sem: bonne flexion`}]},
    {id:`fenetre_poignet`,type:`radio`,label:`Fenêtre carrée (poignet)`,options:[{value:-1,label:`> 90°`},{value:0,label:`90°`},{value:1,label:`60°`},{value:2,label:`45°`},{value:3,label:`30°`},{value:4,label:`0°`}]},
    {id:`retour_bras`,type:`radio`,label:`Retour bras (recoil)`,options:[{value:-1,label:`< 26 sem: pas de retour`},{value:0,label:`26 sem: retour lent`},{value:1,label:`28 sem: retour partiel`},{value:2,label:`30 sem: retour < 1/3`},{value:3,label:`32 sem: retour < 1/2`},{value:4,label:`34 sem: retour complet`}]},
    {id:`angle_poplite`,type:`radio`,label:`Angle poplité`,options:[{value:-1,label:`> 160°`},{value:0,label:`140°`},{value:1,label:`120°`},{value:2,label:`100°`},{value:3,label:`80°`},{value:4,label:`60°`}]},
    {id:`signe_foulard`,type:`radio`,label:`Signe du foulard`,options:[{value:-1,label:`< 24 sem: coude dépasse ligne médiane`},{value:0,label:`26 sem: coude à la ligne médiane`},{value:1,label:`28 sem: coude vers sternum`},{value:2,label:`30 sem: coude proche sternum`},{value:3,label:`32 sem: coude avant ligne médiane`},{value:4,label:`34 sem: coude net avant médiane`}]},
    {id:`talon_oreille`,type:`radio`,label:`Talon-oreille`,options:[{value:-1,label:`> 25 cm`},{value:0,label:`20-25 cm`},{value:1,label:`15-20 cm`},{value:2,label:`10-15 cm`},{value:3,label:`5-10 cm`},{value:4,label:`< 5 cm`}]},
    {id:`peau`,type:`radio`,label:`Peau (externe)`,options:[{value:-1,label:`< 26 sem: gélatineuse, rouge`},{value:0,label:`26-27 sem: fine, lisse`},{value:1,label:`28-29 sem: fine, desquamation`},{value:2,label:`30-31 sem: rugueuse`},{value:3,label:`32-33 sem: épaisse`},{value:4,label:`34-36 sem: craquelée`}]},
    {id:`lanugo`,type:`radio`,label:`Lanugo`,options:[{value:-1,label:`< 26 sem: absent`},{value:0,label:`26-27 sem: abondant`},{value:1,label:`28-29 sem: clairsemé`},{value:2,label:`30-31 sem: zones glabres`},{value:3,label:`32-33 sem: minime`},{value:4,label:`≥ 34 sem: absent`}]},
    {id:`plantaire`,type:`radio`,label:`Plis plantaires`,options:[{value:-1,label:`< 26 sem: aucun`},{value:0,label:`26-27 sem: 1-2 plis antérieurs`},{value:1,label:`28-29 sem: plis 1/3 antérieur`},{value:2,label:`30-31 sem: plis 2/3 antérieur`},{value:3,label:`32-33 sem: plis > 2/3`},{value:4,label:`≥ 34 sem: plis complets`}]},
    {id:`mamelon`,type:`radio`,label:`Mamelon`,options:[{value:-1,label:`< 26 sem: non visible`},{value:0,label:`26-27 sem: aréole visible`},{value:1,label:`28-29 sem: aréole bombée`},{value:2,label:`30-31 sem: mamelon visible`},{value:3,label:`32-33 sem: mamelon formé`},{value:4,label:`≥ 34 sem: mamelon 3-5 mm`}]},
    {id:`oeil`,type:`radio`,label:`Œil / Oreille`,options:[{value:-1,label:`< 26 sem: paupières fusionnées`},{value:0,label:`26-27 sem: œil ouvert, pavillon plat`},{value:1,label:`28-29 sem: pavillon incurvé`},{value:2,label:`30-31 sem: pavillon formé, cartilage`},{value:3,label:`32-33 sem: cartilage ferme`},{value:4,label:`≥ 34 sem: cartilage épais`}]},
    {id:`genital`,type:`radio`,label:`Génital (garçon)`,options:[{value:-1,label:`< 26 sem: testicules non descendus`},{value:0,label:`26-27 sem: testicules haut scrotum`},{value:1,label:`28-29 sem: testicules mi-scrotum`},{value:2,label:`30-31 sem: testicules bas scrotum`},{value:3,label:`32-33 sem: scrotum plissé`},{value:4,label:`≥ 34 sem: testicules en place`}]},
  ],
  calculate: (values) => {
    const neuro = (values.posture??0)+(values.fenetre_poignet??0)+(values.retour_bras??0)+(values.angle_poplite??0)+(values.signe_foulard??0)+(values.talon_oreille??0)
    const externe = (values.peau??0)+(values.lanugo??0)+(values.plantaire??0)+(values.mamelon??0)+(values.oeil??0)+(values.genital??0)
    const total = neuro + externe
    const age_sem = total < 0 ? 20 : total < 5 ? 22 : total < 10 ? 24 : total < 15 ? 26 : total < 20 ? 28 : total < 25 ? 30 : total < 30 ? 32 : total < 35 ? 34 : total < 40 ? 36 : total < 45 ? 38 : 40
    return {value:total, label:`Score ${total} — Âge gestationnel estimé ${age_sem} SA`, severity: age_sem < 28 ? 'high' : age_sem < 34 ? 'moderate' : 'low',
      ranges:[
        {min:-10,max:4,label:`< 22 SA — Prématurité extrême`,severity:'high'},
        {min:5,max:14,label:`22-25 SA — Prématurité très sévère`,severity:'high'},
        {min:15,max:24,label:`26-29 SA — Prématurité sévère`,severity:'high'},
        {min:25,max:34,label:`30-33 SA — Prématurité moyenne`,severity:'moderate'},
        {min:35,max:44,label:`34-37 SA — Prématurité tardive`,severity:'moderate'},
        {min:45,max:50,label:`≥ 38 SA — Terme`,severity:'low'},
      ]}
  },
  interpretation: `Le New Ballard Score (NBS) est la méthode de référence pour estimer l\'âge gestationnel par l\'examen clinique du nouveau-né. 12 critères : 6 neurologiques (posture, fenêtre carrée, retour bras, angle poplité, foulard, talon-oreille) et 6 externes (peau, lanugo, plantes, mamelon, œil/oreille, génital).`,
  clinicalCommentary: `Utile quand la date des dernières règles est inconnue ou l\'échographie précoce non disponible. Fiable de 20 à 44 SA. Chaque item est pondéré de -1 à 4. Le total se convertit en semaines d\'aménorrhée. Attention : moins fiable en cas de croissance intra-utérine sévère ou d\'anasarque.`,
  references: [
    {type:`pubmed`,title:`Ballard JL et al. New Ballard Score for gestational age assessment. J Pediatr 1991`,pmid:`2010720`},
    {type:`guideline`,title:`OMS — Évaluation de l\'âge gestationnel`,url:`https://www.who.int/`},
  ],
}
export default ballard
