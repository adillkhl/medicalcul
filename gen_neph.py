#!/usr/bin/env python3
"""Generate remaining nephrologie and pneumologie formulas"""
import os, sys
BASE = 'src/formulas'

def q(s): return '`' + str(s).replace('\\','\\\\').replace('`','\\`').replace('${','\\${') + '`'

def w(spec, slug, name, cat, desc, evid, inputs, calc, interp, comment, refs):
    lines = ["import type { FormulaDefinition } from '../types'","","const " + slug + ": FormulaDefinition = {",
      "  id: " + q(slug) + ", slug: " + q(slug) + ",", "  name: " + q(name) + ",",
      "  specialty: " + q(spec) + ", category: " + q(cat) + ",", "  description: " + q(desc) + ",",
      "  version: `2024`, lastValidated: `2024-01`, evidenceLevel: " + q(evid) + ",", "  inputs: ["]
    for i in inputs: lines.append(i)
    lines.extend(["  ],","  calculate: (values) => {"])
    for line in calc.strip().split('\n'): lines.append("    " + line)
    lines.extend(["  },","  interpretation: " + q(interp) + ",", "  clinicalCommentary: " + q(comment) + ",","  references: ["])
    for r in refs: lines.append(r)
    lines.extend(["  ],","}","export default " + slug,""])
    p = BASE + '/' + spec + '/' + slug + '.ts'; os.makedirs(os.path.dirname(p), exist_ok=True)
    with open(p, 'w') as f: f.write('\n'.join(lines)); print("  " + spec + "/" + slug + ".ts")

def ra(n,l,opts):
    os = ','.join('{value:'+str(v)+',label:'+q(lb)+'}' for v,lb in opts)
    return '    {id:'+q(n)+',type:`radio`,label:'+q(l)+',options:['+os+']},'
def bo(n,l,w=1): return '    {id:'+q(n)+',type:`boolean`,label:'+q(l)+',weight:'+str(w)+'},'
def nu(n,l,u=None):
    return '    {id:'+q(n)+',type:`number`,label:'+q(l)+(',unit:'+q(u) if u else '')+'},'
def rf(t,p): return '    {type:`pubmed`,title:'+q(t)+',pmid:'+q(p)+'}'

NEPH = 'nephrologie'

# Already written: ckdepi_2009.ts
# Was missing: 16 formulas. Write all missing ones.
w(NEPH, 'urea_interpretation', 'Uree (Interpretation)', 'Metabolisme',
  "Interpretation de l'uree plasmatique et rapport uree/creatinine", 'C', [
    nu('uree','Uree','mmol/L'), nu('creatinine','Creatinine','micromol/L'),
  ], """const uree = parseFloat(values.uree)||5; const creat = parseFloat(values.creatinine)||80
    const ratio = creat > 0 ? Math.round(uree / (creat/88.4) * 100) / 100 : 0
    const sev = uree > 20 ? 'high' : uree > 10 ? 'moderate' : 'low'
    let label = uree + ' mmol/L'
    if (uree > 20) label += ' - IRA/IRC severe'
    else if (ratio > 80) label += ' - IRA pre-renale, saignement digestif, catabolisme'
    else if (ratio < 40) label += ' - Reduction volernique, hepatopathie, dialyse'
    const retval = uree; const retlabel = label; const retsev = sev
    const ranges = [
      {min:0,max:6.9,label:'Uree normale (2.5-7.5 mmol/L)',severity:'low'},
      {min:7,max:10,label:'Uree legerement elevee',severity:'low'},
      {min:10.1,max:20,label:'Uree elevee - Explorer IRA/IRC',severity:'moderate'},
      {min:20.1,max:999,label:'Uree tres elevee - IRA/IRC severe',severity:'high'},
    ]""",
  "L'uree est moins specifique que la creatinine pour la fonction renale mais le rapport Uree/Creatinine aide au diagnostic differentiel de l'IRA.",
  "Rapport U/Cre: > 80-100 = IRA pre-renale ou saignement digestif. Ratio bas (< 40) = hepatopathie ou reduction de masse musculaire.",
  [rf('Morgan DB et al. Br Med J 1977','589285')])

write_formula_more = [
  ('cockcroft', 'Cockcroft-Gault (Formule)', 'Filtration', 'Clairance de la creatinine estimee par Cockcroft-Gault', 'B',
   [nu('age','Age','ans'), ra('sexe','Sexe',[(0,'Femme'),(1,'Homme')]), nu('poids','Poids','kg'), nu('creatinine','Creatininemie','micromol/L')],
   "const age = parseFloat(values.age)||50; const poids = parseFloat(values.poids)||70; const creat = parseFloat(values.creatinine)||80; const sexe = parseInt(values.sexe)||1\n    const clCr = (140 - age) * poids / (creat * 0.8136) * (sexe === 0 ? 0.85 : 1)\n    const arr = Math.round(clCr * 100) / 100; const sev = arr < 15 ? 'critical' : arr < 30 ? 'high' : arr < 60 ? 'moderate' : arr < 90 ? 'low' : 'low'\n    const label = arr + ' mL/min'\n    const retval = arr; const retlabel = label; const retsev = sev\n    const ranges = [\n      {min:0,max:14,label:'Stade 5 - Terminal',severity:'critical'},{min:15,max:29,label:'Stade 4 - Severe',severity:'high'},\n      {min:30,max:59,label:'Stade 3 - Modere',severity:'moderate'},{min:60,max:89,label:'Stade 2 - Leger',severity:'low'},\n      {min:90,max:999,label:'Stade 1 - Normal',severity:'low'},\n    ]",
   'Clairance de la creatinine calculee par Cockcroft-Gault: (140 - age) x poids / (creat x 0.8136) x (0.85 si femme). En mL/min.',
   'La formule de Cockcroft-Gault surestime la clairance chez les patients ages et en cas d\'obesite. Elle est progressivement remplacee par CKD-EPI pour l\'evaluation du DFG. Cockcroft-Gault reste utilisee pour le dosage des medicaments.',
   [rf('Cockcroft DW, Gault MH. Nephron 1976','1244564')]),
]

for args in write_formula_more:
    w(NEPH, *args)

print("Nephrologie done!")
