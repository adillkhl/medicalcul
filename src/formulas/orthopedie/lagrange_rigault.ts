import type { FormulaDefinition } from '../types'

const lagrange_rigault: FormulaDefinition = {
  id: 'lagrange-rigault',
  slug: 'lagrange_rigault',
  name: 'Lagrange et Rigault (Classification)',
  specialty: 'orthopedie',
  category: 'Fractures',
  description: 'Classification de Lagrange et Rigault pour les fractures supra-condyliennes de l\'humérus chez l\'enfant. Grade le déplacement du fragment distal pour guider la prise en charge orthopédique ou chirurgicale.',
  version: '2024',
  lastValidated: '2024-01',
  evidenceLevel: 'B',
  inputs: [
    {
      id: 'displacement_grade',
      type: 'radio',
      label: 'Stade radiologique du déplacement',
      options: [
        { value: 1, label: 'Stade I — Fracture sans déplacement (trait non déplacé, pas de bascule)' },
        { value: 2, label: 'Stade II — Fracture avec déplacement modéré (contact cortical conservé, bascule postérieure < 20°)' },
        { value: 3, label: 'Stade III — Fracture avec déplacement complet (perte de contact, mais rotation possible)' },
        { value: 4, label: 'Stade IV — Fracture avec déplacement complet et rotation du fragment distal' },
      ],
    },
    {
      id: 'skin_risk',
      type: 'boolean',
      label: 'Signes cutanés (peau menacée, phlyctène, ecchymose antérieure)',
    },
    {
      id: 'neurovascular',
      type: 'radio',
      label: 'Examen neurovasculaire distal',
      options: [
        { value: 1, label: 'Normal (pouls +, sensibilité +, motricité +)' },
        { value: 2, label: 'Déficit neurologique isolé (médian, radial ou ulnaire)' },
        { value: 3, label: 'Ischémie (pouls aboli, main pâle, douleur à l\'extension) — URGENCE' },
      ],
    },
  ],
  calculate: (values) => {
    const stage = values.displacement_grade as number
    const skinThreat = values.skin_risk as boolean
    const neurovasc = values.neurovascular as number

    let label = ''
    let severity: 'low' | 'moderate' | 'high' | 'critical' = 'low'
    let recommendation = ''

    // Determine overall severity
    if (neurovasc === 3) {
      label = 'Stade IV avec ischémie — URGENCE VASCULAIRE ABSOLUE'
      severity = 'critical'
      recommendation = 'URGENCE CHIRURGICALE IMMÉDIATE. Réduction en urgence + embrochage percutané. Exploration du paquet vasculaire si pouls non rétabli après réduction. Fasciotomie de l\'avant-bras. Surveillance post-opératoire stricte.'
    } else if (stage === 1) {
      label = 'Lagrange-Rigault Stade I — Fracture non déplacée'
      severity = 'low'
      recommendation = 'Traitement orthopédique : immobilisation par plâtre brachio-antébrachial (BABP) à 90° de flexion, 2-3 semaines. Surveillance radiologique à J7 pour vérifier l\'absence de déplacement secondaire.'
    } else if (stage === 2 && !skinThreat) {
      label = 'Lagrange-Rigault Stade II — Déplacement modéré'
      severity = 'moderate'
      recommendation = 'Réduction orthopédique sous anesthésie générale. Embrochage percutané (broches de Kirchner) recommandé si déplacement instable. BABP pour 3-4 semaines. Contrôle radiologique à J15.'
    } else if (stage === 3 || (stage === 2 && skinThreat)) {
      label = 'Lagrange-Rigault Stade III — Déplacement complet'
      severity = 'high'
      recommendation = 'Réduction chirurgicale + embrochage percutané (2-3 broches latérales). Voie d\'abord postéromédiale si contrôle inadéquat. Hospitalisation 48h. Surveillance du pouls et de la sensibilité. BABP 3-4 semaines.'
    } else {
      label = 'Lagrange-Rigault Stade IV — Déplacement + rotation'
      severity = 'high'
      recommendation = 'Réduction chirurgicale urgente + embrochage percutané (broches divergentes). Voie d\'abord chirurgicale si réduction impossible à fermé. Surveillance rapprochée du risque de syndrome de loge. BABP 4 semaines.'
    }

    let neuroDesc = ''
    if (neurovasc === 2) {
      neuroDesc = 'Déficit nerveux : médian (nerf interosseux antérieur +++), radial ou ulnaire. Le plus souvent régression spontanée en 6-12 semaines.'
    }

    return {
      value: stage,
      label,
      severity,
      details: {
        Stade: `Stade ${['I', 'II', 'III', 'IV'][stage - 1]}`,
        'Neurovasculaire': ['Normal', 'Déficit neurologique', 'Ischémie — URGENCE'][neurovasc - 1],
        'Peau menacée': skinThreat ? 'Oui' : 'Non',
        'Note neurologique': neuroDesc,
      },
      ranges: [
        { min: 1, max: 1, label: 'Stade I — Non déplacé', severity: 'low' },
        { min: 2, max: 2, label: 'Stade II — Déplacement modéré', severity: 'moderate' },
        { min: 3, max: 3, label: 'Stade III — Déplacement complet', severity: 'high' },
        { min: 4, max: 4, label: 'Stade IV — Déplacement + rotation', severity: 'high' },
      ],
    }
  },
  interpretation: 'La **classification de Lagrange et Rigault** (1969) est spécifique aux fractures supra-condyliennes de l\'humérus chez l\'enfant (âge moyen 5-7 ans).\n\n**4 stades :**\n- **Stade I** : Non déplacé → traitement orthopédique\n- **Stade II** : Déplacé avec contact → réduction ± embrochage\n- **Stade III** : Déplacé sans contact → embrochage chirurgical\n- **Stade IV** : Déplacé avec rotation → chirurgie urgente\n\nLes complications principales sont : syndrome de loge (Volkmann), lésion du nerf médian/interosseux antérieur, cal vicieux en cubitus varus (« gun stock deformity »).',
  clinicalCommentary: 'Les fractures supra-condyliennes sont les fractures du coude les plus fréquentes chez l\'enfant (5-7 ans). Le mécanisme est le plus souvent une chute sur la main coude en extension. Le risque principal est le syndrome de loge, d\'où l\'importance d\'une surveillance horaire de la douleur, des pouls et de la sensibilité dans les 24h post-traumatiques. Le nerf le plus souvent lésé est le nerf interosseux antérieur (branche du médian) : incapacité de faire un « O » (pouce-index).',
  references: [
    {
      type: 'pubmed',
      title: 'Lagrange J, Rigault P. Fractures supra-condyliennes de l\'humérus chez l\'enfant. Rev Chir Orthop 1969',
      pmid: '5377842',
    },
    {
      type: 'pubmed',
      title: 'Omid R et al. Supracondylar humeral fractures in children: current concepts and management. J Am Acad Orthop Surg 2008',
      pmid: '18281687',
    },
  ],
}

export default lagrange_rigault
