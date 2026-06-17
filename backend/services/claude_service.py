import json
from anthropic import Anthropic
from config import settings
from . import demo_mode
import os

# Use demo mode if no API key
USE_DEMO = not settings.ANTHROPIC_API_KEY or settings.ANTHROPIC_API_KEY == "sk-ant-YOUR_API_KEY_HERE"

if not USE_DEMO:
    client = Anthropic()
else:
    client = None

def generate_assets(company_name: str, domain: str, industry: str = None, employee_count: int = None):
    if USE_DEMO:
        return demo_mode.generate_assets_demo(company_name, domain, industry, employee_count)

    prompt = f"""Generate a realistic IT asset inventory digital twin for:
Company: {company_name}
Domain: {domain}
Industry: {industry or 'Technology'}
Estimated employees: {employee_count or 100}

Return ONLY valid JSON with this exact structure:
{{
  "assets": [
    {{
      "name": "asset-name",
      "asset_type": "server|api|database|user|cloud|firewall|endpoint|iot",
      "ip_address": "IP address or null",
      "os": "OS version or null",
      "services": ["service:version"],
      "risk_score": 0.0-10.0,
      "cve_ids": ["CVE-XXXX-XXXXX"]
    }}
  ]
}}

Generate 8-15 assets appropriate for a {industry or 'tech'} company with {employee_count or 100} employees.
Include: 2+ servers, 1+ database, 1+ API, 1+ firewall, 2+ endpoints, 1+ cloud.
Make IPs realistic (internal 10.0.x.x + some public).
Risk scores should reflect realistic vulnerabilities."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])


def generate_attack_paths(assets_json: str, company_name: str):
    if USE_DEMO:
        return demo_mode.generate_attack_paths_demo(assets_json, company_name)

    prompt = f"""Analyze this company's asset inventory and generate realistic attack paths:

Company: {company_name}
Assets: {assets_json}

Generate 3-5 realistic attack paths using MITRE ATT&CK framework. Return ONLY valid JSON:
{{
  "attack_paths": [
    {{
      "name": "Attack name",
      "description": "Brief scenario",
      "severity": "low|medium|high|critical",
      "likelihood": 0.0-1.0,
      "impact": 0.0-1.0,
      "mitre_tactics": ["TA0001"],
      "steps": [
        {{
          "step_number": 1,
          "asset_name": "name from assets",
          "technique_id": "T1234.567",
          "technique_name": "Technique Name",
          "description": "What happens"
        }}
      ]
    }}
  ]
}}

Focus on realistic threat vectors. Ensure flow from external entry to high-value targets.
Use actual MITRE ATT&CK technique IDs (T####.###)."""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2500,
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])


def soc_chat(company_context: str, conversation_history: list, user_message: str):
    if USE_DEMO:
        return demo_mode.soc_chat_demo(user_message)

    system_prompt = f"""You are Alex, a Senior SOC Analyst at CyberTwin AI with 10 years of experience.
You analyze the digital twin of: {company_context}

Personality:
- Direct and professional
- Use security jargon but explain it
- Reference specific assets by name
- Provide actionable recommendations
- Keep responses concise (2-4 paragraphs)

End with 1-2 specific actionable items.
Stay focused on the provided company's security posture."""

    messages = conversation_history + [{"role": "user", "content": user_message}]

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1000,
        system=system_prompt,
        messages=messages
    )

    return response.content[0].text


def simulate_whatif(assets_json: str, attack_paths_json: str, scenario: str, affected_asset_name: str):
    if USE_DEMO:
        return demo_mode.whatif_demo(scenario)

    prompt = f"""Perform a what-if attack simulation:

Assets: {assets_json}
Attack Paths: {attack_paths_json}
Scenario: {scenario}
Compromised Asset: {affected_asset_name}

Return ONLY valid JSON:
{{
  "scenario_name": "Name",
  "executive_summary": "2-sentence impact",
  "new_risk_score": 0.0-10.0,
  "blast_radius": {{
    "compromised_immediately": ["asset names"],
    "at_risk_within_24h": ["asset names"],
    "likely_safe": ["asset names"]
  }},
  "estimated_financial_impact": "$X - $Y range",
  "recommended_immediate_actions": ["action 1", "action 2"],
  "narrative": "3-4 sentence story"
}}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=1500,
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])


def generate_report_summary(company_name: str, assets_json: str, attack_paths_json: str):
    if USE_DEMO:
        return demo_mode.generate_report_demo()

    prompt = f"""Generate an executive security report for {company_name}:

Assets: {assets_json}
Attack Paths: {attack_paths_json}

Return ONLY valid JSON:
{{
  "executive_summary": "3-paragraph summary",
  "overall_score": 0.0-10.0,
  "score_rationale": "why this score",
  "category_scores": {{
    "network_security": 0.0-10.0,
    "application_security": 0.0-10.0,
    "identity_access": 0.0-10.0,
    "data_protection": 0.0-10.0
  }},
  "top_5_risks": [
    {{
      "rank": 1,
      "title": "Risk",
      "description": "Details",
      "remediation_effort": "low|medium|high"
    }}
  ],
  "30_day_roadmap": ["action 1", "action 2"],
  "90_day_roadmap": ["initiative 1"]
}}"""

    response = client.messages.create(
        model="claude-haiku-4-5-20251001",
        max_tokens=2000,
        messages=[{"role": "user", "content": prompt}]
    )

    try:
        return json.loads(response.content[0].text)
    except json.JSONDecodeError:
        text = response.content[0].text
        start = text.find("{")
        end = text.rfind("}") + 1
        return json.loads(text[start:end])
