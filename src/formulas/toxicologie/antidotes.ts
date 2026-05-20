import type { FormulaDefinition } from '../types'

const antidotes: FormulaDefinition = {
  id: 'antidotes',
  slug: 'antidotes',
  name: 'Antidotes',
  specialty: 'toxicologie',
  category: 'Antidotes',
  description: 'Liste des principaux antidotes et leurs posologies pour les intoxications aiguës les plus fréquentes.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'toxin',
      type: 'select',
      label: 'Agent toxique / Intoxication',
      options: [
        { value: 'paracetamol', label: 'Paracétamol' },
        { value: 'benzodiazepine', label: 'Benzodiazépines' },
        { value: 'opioides', label: 'Opioïdes' },
        { value: 'anticoagulant_avk', label: 'AVK (Anti-vitamine K)' },
        { value: 'anticoagulant_doac', label: 'DOAC / AOD (dabigatran)' },
        { value: 'intox_cyanure', label: 'Cyanure' },
        { value: 'monoxyde_carbone', label: 'Monoxyde de carbone (CO)' },
        { value: 'atropine', label: 'Anticholinergiques (atropine)' },
        { value: 'organophosphore', label: 'Organophosphorés' },
        { value: 'fer', label: 'Fer' },
        { value: 'plomb', label: 'Plomb' },
        { value: 'methanol', label: 'Méthanol / Éthylène glycol' },
        { value: 'sulfonyluree', label: 'Sulfonylurées' },
        { value: 'betabloquant', label: 'Bêta-bloquants' },
      ],
    },
    {
      id: 'weight',
      type: 'number',
      label: 'Poids du patient',
      unit: 'kg',
      min: 2,
      max: 300,
      step: 0.5,
    },
  ],
  calculate: (values) => {
    const toxin = values.toxin as string
    const weight = values.weight as number

    interface AntidoteInfo {
      antidote: string
      posologie: string
      mecanisme: string
      voie: string
    }

    const data: Record<string, AntidoteInfo> = {
      paracetamol: {
        antidote: 'N-acétylcystéine (NAC, Fluimucil®)',
        posologie: `150 mg/kg IV en 15-60 min, puis 50 mg/kg sur 4h, puis 100 mg/kg sur 16h (protocole 21h). Soit ${Math.round(150 * weight)} mg en dose de charge.`,
        mecanisme: 'Replétion des réserves de glutathion hépatique',
        voie: 'IV (ou PO si léger)',
      },
      benzodiazepine: {
        antidote: 'Flumazénil (Anexate®)',
        posologie: '200 µg IV en 30 sec, puis 100 µg/min si nécessaire (dose max 2 mg)',
        mecanisme: 'Antagoniste compétitif des récepteurs GABA-A',
        voie: 'IV',
      },
      opioides: {
        antidote: 'Naloxone (Narcan®)',
        posologie: '0,4-2 mg IV/IM/IN, renouvelable toutes les 2-3 min. Dose max 10 mg. Perfusion continue si besoin.',
        mecanisme: 'Antagoniste pur des récepteurs opioïdes µ',
        voie: 'IV / IM / Intranasal',
      },
      anticoagulant_avk: {
        antidote: 'Vitamine K (Konakion®) + PPSB (Kaskadil®, Octaplex®)',
        posologie: `Vitamine K : 5-10 mg IV lente. PPSB : 25-50 UI/kg (soit ${Math.round(25 * weight)}-${Math.round(50 * weight)} UI) si hémorragie grave.`,
        mecanisme: 'Synthèse de novo des facteurs vitamine K-dépendants (II, VII, IX, X)',
        voie: 'IV',
      },
      anticoagulant_doac: {
        antidote: 'Idarucizumab (Praxbind®) pour dabigatran',
        posologie: '5 g IV (2 × 2,5 g) en bolus. Andexanet alfa (Ondexxya®) pour rivaroxaban/apixaban.',
        mecanisme: 'Anticorps monoclonal fragment Fab humanisé anti-dabigatran',
        voie: 'IV',
      },
      intox_cyanure: {
        antidote: 'Hydroxocobalamine (Cyanokit®)',
        posologie: '5 g (adulte) ou 70 mg/kg (enfant) IV en 15 min. Renouvelable 1 fois.',
        mecanisme: 'Chélation du cyanure en cyanocobalamine (vitamine B12)',
        voie: 'IV',
      },
      monoxyde_carbone: {
        antidote: 'Oxygène normobare (O₂ 100%)',
        posologie: 'O₂ 15 L/min au masque à haute concentration. Caisson hyperbare si signes neurologiques, grossesse, ou COHb > 25%.',
        mecanisme: 'Déplacement du CO de l\'hémoglobine (affinité × 250 vs O₂)',
        voie: 'Inhalation',
      },
      atropine: {
        antidote: 'Physostigmine (Anticholium®)',
        posologie: '1-2 mg IV lent sur 5 min (adulte). Contre-indiqué si bloc AV, asthme, gangrène.',
        mecanisme: 'Inhibiteur de l\'acétylcholinestérase (augmente l\'ACh synaptique)',
        voie: 'IV',
      },
      organophosphore: {
        antidote: 'Atropine + Pralidoxime (Contrathion®)',
        posologie: 'Atropine : 1-4 mg IV toutes les 5-15 min jusqu\'à atropinisation. Pralidoxime : 2 g IV en 15-30 min.',
        mecanisme: 'Atropine : antagoniste muscarinique. Pralidoxime : réactivation des cholinestérases',
        voie: 'IV',
      },
      fer: {
        antidote: 'Déféroxamine (Desferal®)',
        posologie: '15 mg/kg/h IV en perfusion continue (dose max 80 mg/kg/24h)',
        mecanisme: 'Chélation du fer libre (formation de ferrioxamine éliminée dans les urines)',
        voie: 'IV / IM',
      },
      plomb: {
        antidote: 'EDTA calcique + BAL (Dimercaprol) ± DMSA (Succimer)',
        posologie: 'BAL : 3-5 mg/kg IM/4h. EDTA CaNa₂ : 50 mg/kg/j IV. DMSA : 10 mg/kg PO/8h × 5j.',
        mecanisme: 'Chélation des métaux lourds (formation de complexes éliminés par le rein)',
        voie: 'IM / IV / PO',
      },
      methanol: {
        antidote: 'Fomépizole (4-MP, Pomepizole®) ou Éthanol',
        posologie: 'Fomépizole : 15 mg/kg IV en dose de charge, puis 10 mg/kg/12h. Éthanol : objectif 1-1,5 g/L sanguin.',
        mecanisme: 'Inhibition compétitive de l\'alcool déshydrogénase',
        voie: 'IV',
      },
      sulfonyluree: {
        antidote: 'Octréotide (Sandostatine®)',
        posologie: '50-100 µg SC/IV toutes les 6-8h + glucagon 1 mg IM/IV si hypoglycémie sévère.',
        mecanisme: 'Inhibe la sécrétion d\'insuline par les cellules β pancréatiques',
        voie: 'SC / IV',
      },
      betabloquant: {
        antidote: 'Glucagon',
        posologie: '5-10 mg IV bolus, puis perfusion 1-10 mg/h. ± Dobutamine, Isoprénaline, Insuline-haute dose.',
        mecanisme: 'Activation de l\'adénylyl cyclase par un récepteur non-adrénergique (bypass du bloc β)',
        voie: 'IV',
      },
    }

    const info = data[toxin]

    if (!info) {
      return {
        value: 0,
        label: 'Antidote non répertorié',
        severity: 'low',
      }
    }

    return {
      value: 1,
      label: `${info.antidote}`,
      severity: 'high',
      details: {
        Antidote: info.antidote,
        Posologie: info.posologie,
        Mécanisme: info.mecanisme,
        Voie: info.voie,
      },
      ranges: [
        { min: 0, max: 0, label: 'Antidote non trouvé dans la base', severity: 'low' },
        { min: 1, max: 1, label: 'Antidote disponible — voir détails', severity: 'high' },
      ],
    }
  },
  interpretation: `Cette fiche répertorie les **antidotes** des principales intoxications aiguës rencontrées aux urgences.

⚠️ **Règles générales :**
- Contacter systématiquement un **Centre Anti-Poison** (CAP)
- Ne pas attendre la confirmation biologique pour administrer l'antidote si suspicion forte
- Vérifier les posologies selon le poids, l'âge et la fonction rénale
- Surveiller les effets indésirables des antidotes eux-mêmes`,
  clinicalCommentary: `Les centres antipoison (CAP) sont joignables 24h/24 : 04 91 75 25 25 (Marseille), 01 40 05 48 48 (Paris). En cas de doute sur une intoxication, n'hésitez pas à les contacter. La naloxone et la N-acétylcystéine doivent être disponibles dans toute structure d'urgence. Pour l'intoxication au paracétamol, ne pas attendre le dosage pour débuter la NAC si la dose ingérée dépasse 4 g/24h.`,
  references: [
    {
      type: 'pubmed',
      title: 'Chyka PA et al. Position paper: antidotes for poisoning. Clin Toxicol 2005',
      pmid: '15822757',
    },
    {
      type: 'pubmed',
      title: 'Bateman DN et al. Antidotes. Medicine 2012',
      pmid: '23101042',
    },
  ],
}

export default antidotes
