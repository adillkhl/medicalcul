import type { FormulaDefinition } from '../types'

const ciwaar: FormulaDefinition = {
  id: 'ciwa-ar',
  slug: 'ciwaar',
  name: 'CIWA-Ar (Score)',
  specialty: 'toxicologie',
  category: 'Alcool',
  description: 'Clinical Institute Withdrawal Assessment for Alcohol — Échelle de sévérité du syndrome de sevrage alcoolique, version révisée. Permet de guider le traitement par benzodiazépines.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'nausea',
      type: 'radio',
      label: 'Nausées / Vomissements',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 1, label: 'Léger — nausée sans vomissement' },
        { value: 2, label: 'Modéré — nausée avec haut-le-cœur' },
        { value: 3, label: 'Sévère — vomissements fréquents' },
        { value: 4, label: 'Très sévère — vomissements incoercibles' },
      ],
    },
    {
      id: 'tremor',
      type: 'radio',
      label: 'Tremblements (bras étendus, doigts écartés)',
      options: [
        { value: 0, label: 'Absent' },
        { value: 1, label: 'Léger — non visible mais palpable' },
        { value: 2, label: 'Modéré — visible, amplitudes 2-4 cm' },
        { value: 3, label: 'Sévère — amplitudes > 4 cm' },
        { value: 4, label: 'Très sévère — tremblements violents, difficulté à tenir les bras' },
      ],
    },
    {
      id: 'sweating',
      type: 'radio',
      label: 'Sueurs',
      options: [
        { value: 0, label: 'Aucune' },
        { value: 1, label: 'Légères — paumes moites' },
        { value: 2, label: 'Modérées — gouttes sur le front' },
        { value: 3, label: 'Sévères — perles de sueur sur tout le corps' },
        { value: 4, label: 'Très sévères — transpiration profuse, draps trempés' },
      ],
    },
    {
      id: 'anxiety',
      type: 'radio',
      label: 'Anxiété',
      options: [
        { value: 0, label: 'Aucune — calme' },
        { value: 1, label: 'Légère — tendu, irritable' },
        { value: 2, label: 'Modérée — anxieux, demande de l\'aide' },
        { value: 3, label: 'Sévère — panique, très anxieux' },
        { value: 4, label: 'Très sévère — terreur, sentiment de mort imminente' },
      ],
    },
    {
      id: 'agitation',
      type: 'radio',
      label: 'Agitation',
      options: [
        { value: 0, label: 'Absente — calme, immobile' },
        { value: 1, label: 'Légère — bouge un peu' },
        { value: 2, label: 'Modérée — se tortille, ne tient pas en place' },
        { value: 3, label: 'Sévère — va-et-vient, très agité' },
        { value: 4, label: 'Très sévère — ne peut pas rester assis, s\'agite violemment' },
      ],
    },
    {
      id: 'tactile',
      type: 'radio',
      label: 'Troubles tactiles',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 1, label: 'Légers — picotements, engourdissements' },
        { value: 2, label: 'Modérés — fourmillements, sensation d\'insectes rampants' },
        { value: 3, label: 'Sévères — hallucinations tactiles' },
        { value: 4, label: 'Très sévères — hallucinations tactiles intenses et envahissantes' },
      ],
    },
    {
      id: 'auditory',
      type: 'radio',
      label: 'Troubles auditifs',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 1, label: 'Légers — hypersensibilité aux sons' },
        { value: 2, label: 'Modérés — bruits vagues non spécifiques' },
        { value: 3, label: 'Sévères — hallucinations auditives' },
        { value: 4, label: 'Très sévères — hallucinations auditives envahissantes' },
      ],
    },
    {
      id: 'visual',
      type: 'radio',
      label: 'Troubles visuels',
      options: [
        { value: 0, label: 'Aucun' },
        { value: 1, label: 'Légers — sensibilité à la lumière' },
        { value: 2, label: 'Modérés — flashs, éclairs visuels' },
        { value: 3, label: 'Sévères — hallucinations visuelles' },
        { value: 4, label: 'Très sévères — hallucinations visuelles envahissantes' },
      ],
    },
    {
      id: 'headache',
      type: 'radio',
      label: 'Céphalées / Plénitude intracrânienne',
      options: [
        { value: 0, label: 'Absente' },
        { value: 1, label: 'Légère — gêne légère' },
        { value: 2, label: 'Modérée — céphalée franche' },
        { value: 3, label: 'Sévère — céphalée intense' },
        { value: 4, label: 'Très sévère — céphalée insupportable' },
      ],
    },
    {
      id: 'orientation',
      type: 'radio',
      label: 'Orientation et troubles sensoriels',
      options: [
        { value: 0, label: 'Orienté — normal' },
        { value: 1, label: 'Léger — ne sait pas exactement où il est' },
        { value: 2, label: 'Modéré — désorienté temps/lieu, perplexe' },
        { value: 3, label: 'Sévère — désorienté temps/lieu/personne' },
        { value: 4, label: 'Très sévère — obnubilation, stupeur, délire' },
      ],
    },
  ],
  calculate: (values) => {
    const score =
      (values.nausea as number) +
      (values.tremor as number) +
      (values.sweating as number) +
      (values.anxiety as number) +
      (values.agitation as number) +
      (values.tactile as number) +
      (values.auditory as number) +
      (values.visual as number) +
      (values.headache as number) +
      (values.orientation as number)

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    if (score <= 8) {
      label = 'Sevrage léger — surveillance simple'
      severity = 'low'
      recommendation = 'Surveillance clinique. Traitement médicamenteux non systématique. Réévaluation toutes les 4-8h.'
    } else if (score <= 15) {
      label = 'Sevrage modéré — traitement BZD recommandé'
      severity = 'moderate'
      recommendation = 'Diazépam 10-20 mg PO ou Lorazépam 2-4 mg PO/IV. Réévaluation CIWA-Ar 1h après. Hospitalisation recommandée si co-morbidités.'
    } else if (score <= 20) {
      label = 'Sevrage sévère — risque de delirium tremens'
      severity = 'high'
      recommendation = 'Diazépam 20-40 mg PO/IV ou Lorazépam 4-8 mg toutes les 1-2h. Surveillance rapprochée. Hospitalisation en soins intensifs. Vitaminothérapie B1 (250 mg IV) + B9 + B6.'
    } else {
      label = 'Sevrage très sévère — delirium tremens probable'
      severity = 'critical'
      recommendation = 'URGENCE VITALE. Transfert en réanimation. Diazépam IV titration rapide. Vitaminothérapie parentérale. ± Neuroleptiques si agitation. Prévention complications : hypoglycémie, convulsions, inhalation.'
    }

    return {
      value: score,
      label,
      severity,
      risk: score > 15 ? score : undefined,
      riskUnit: score > 15 ? 'CIWA-Ar — risque de delirium' : undefined,
      ranges: [
        { min: 0, max: 8, label: 'Sevrage léger — surveillance', severity: 'low', recommendation: 'Surveillance clinique simple' },
        { min: 9, max: 15, label: 'Sevrage modéré — traiter par BZD', severity: 'moderate', recommendation: 'Benzodiazépines PO' },
        { min: 16, max: 20, label: 'Sevrage sévère — risque de delirium', severity: 'high', recommendation: 'BZD IV titration + hospitalisation' },
        { min: 21, max: 67, label: 'Sevrage très sévère — delirium probable', severity: 'critical', recommendation: 'Réanimation en urgence' },
      ],
    }
  },
  interpretation: `Le **CIWA-Ar** (Clinical Institute Withdrawal Assessment for Alcohol — revised) est l'échelle de référence pour quantifier la sévérité du syndrome de sevrage alcoolique.

**Score total : 0 à 67**

Conduite à tenir selon le score :
- **≤ 8** : Sevrage léger — surveillance simple
- **9-15** : Sevrage modéré — traitement par benzodiazépines (diazépam 10-20 mg PO)
- **16-20** : Sevrage sévère — risque de delirium tremens, BZD IV titration
- **≥ 21** : Delirium tremens probable — réanimation

**Traitement symptomatique :** vitamine B1 (thiamine) 250 mg IV/24h pour prévenir l'encéphalopathie de Gayet-Wernicke.`,
  clinicalCommentary: `Répéter le CIWA-Ar toutes les 1 à 4 heures selon la sévérité initiale. L'objectif est de maintenir le score ≤ 8 tout en évitant la sédation excessive. Le protocole « symptôme-titré » (CIWA-Ar guidé) est supérieur aux doses fixes pour réduire la durée de traitement et les complications. Toujours associer la thiamine (vitamine B1) pour prévenir l'encéphalopathie de Wernicke.`,
  references: [
    {
      type: 'pubmed',
      title: 'Sullivan JT et al. Assessment of alcohol withdrawal: the revised clinical institute withdrawal assessment for alcohol scale (CIWA-Ar). Br J Addict 1989',
      pmid: '2597810',
    },
    {
      type: 'pubmed',
      title: 'Malcolm RJ et al. The measurement of severity of alcohol withdrawal. Am J Addict 2000',
      pmid: '10914294',
    },
  ],
}

export default ciwaar
