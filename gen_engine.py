#!/usr/bin/env python3
"""Generate all missing medical formulas for Medicalcul PWA.
Uses a structured approach: define formulas as data, generate .ts files."""

import os, json, math
from typing import Any

FORMULAS_DIR = "/opt/data/medicalcul/src/formulas"

# Write the generation engine
HEADER = """import type { FormulaDefinition } from '../types'

"""

def make_calc(values_code, result_code):
    """Create calculate function."""
    return f"  calculate: (values) => {{\n{values_code}\n    return {result_code}\n  }},"

def bool_inp(id_, label):
    return f'{{ id: "{id_}", type: "boolean", label: "{label}" }}'

def num_inp(id_, label, unit=None, **kw):
    parts = [f'id: "{id_}"', f'type: "number"', f'label: "{label}"']
    if unit: parts.append(f'unit: "{unit}"')
    for k, v in kw.items():
        parts.append(f'{k}: {v}')
    return "{" + ", ".join(parts) + "}"

def radio_inp(id_, label, options):
    opts = ", ".join([f'{{ value: {v}, label: "{l}" }}' for v, l in options])
    return f'{{ id: "{id_}", type: "radio", label: "{label}", options: [{opts}] }}'

def write_formula(spec, slug, name, category, description, evidence, inputs, calc_body, result, interp, comment, refs):
    """Write a complete formula .ts file."""
    input_lines = ",\n    ".join(inputs)
    ref_lines = ",\n    ".join(refs)
    content = f"""{HEADER}const {slug.replace("-","_")}: FormulaDefinition = {{
  id: '{slug}', slug: '{slug}',
  name: '{name}',
  specialty: '{spec}', category: '{category}',
  description: '{description}',
  version: '2024', lastValidated: '2024-01', evidenceLevel: '{evidence}',
  inputs: [
    {input_lines},
  ],
  calculate: (values) => {{
{calc_body}
    return {result}
  }},
  interpretation: '{interp}',
  clinicalCommentary: '{comment}',
  references: [{ref_lines}],
}}
export default {slug.replace("-","_")}
"""
    path = f"{FORMULAS_DIR}/{spec}/{slug}.ts"
    os.makedirs(os.path.dirname(path), exist_ok=True)
    with open(path, "w") as f:
        f.write(content)
    return slug

def esc(s):
    """Escape single quotes in strings."""
    return s.replace("'", "\\'")

print("Engine ready. Generating formulas...")
