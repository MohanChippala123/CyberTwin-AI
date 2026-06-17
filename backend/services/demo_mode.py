"""
Demo mode - Returns pre-generated responses without calling Claude API
"""

def generate_assets_demo(company_name: str, domain: str, industry: str = None, employee_count: int = None):
    """Return mock asset data without API call"""
    return {
        "assets": [
            {"name": "prod-api-gateway", "asset_type": "api", "ip_address": "52.14.88.101",
             "os": "Ubuntu 22.04", "services": ["nginx:1.18.0", "node:18.12"], "risk_score": 8.9, "cve_ids": ["CVE-2023-44487"]},
            {"name": "prod-db-postgres", "asset_type": "database", "ip_address": "10.0.1.50",
             "os": "Ubuntu 20.04", "services": ["postgresql:13.8"], "risk_score": 9.1, "cve_ids": ["CVE-2022-2625"]},
            {"name": "auth-service", "asset_type": "server", "ip_address": "10.0.1.20",
             "os": "Amazon Linux 2", "services": ["python:3.9", "redis:7.0"], "risk_score": 7.2, "cve_ids": ["CVE-2023-28858"]},
            {"name": "aws-s3-data-bucket", "asset_type": "cloud", "ip_address": None,
             "os": None, "services": ["AWS S3"], "risk_score": 6.5, "cve_ids": []},
            {"name": "corp-firewall", "asset_type": "firewall", "ip_address": "203.0.113.1",
             "os": "Cisco IOS 15.2", "services": ["iptables"], "risk_score": 5.5, "cve_ids": []},
            {"name": "dev-workstation-john", "asset_type": "endpoint", "ip_address": "10.0.2.15",
             "os": "Windows 11 22H2", "services": ["chrome:118", "vscode:1.84"], "risk_score": 6.8, "cve_ids": ["CVE-2023-36025"]},
            {"name": "admin-user-sarah", "asset_type": "user", "ip_address": None,
             "os": None, "services": [], "risk_score": 7.5, "cve_ids": []},
            {"name": "payment-processor-api", "asset_type": "api", "ip_address": "52.14.99.200",
             "os": "Ubuntu 22.04", "services": ["nginx:1.24", "python:3.11"], "risk_score": 8.3, "cve_ids": ["CVE-2023-44487"]},
        ]
    }

def generate_attack_paths_demo(assets_json: str, company_name: str):
    """Return mock attack paths without API call"""
    return {
        "attack_paths": [
            {"name": "Phishing → Admin Compromise → DB Exfil", "description": "Social engineering attack leads to database compromise",
             "severity": "critical", "likelihood": 0.72, "impact": 0.95, "mitre_tactics": ["TA0001", "TA0003", "TA0008"],
             "steps": [
                {"step_number": 1, "asset_name": "admin-user-sarah", "technique_id": "T1566.001",
                 "technique_name": "Spearphishing Attachment", "description": "Admin receives malicious email"},
                {"step_number": 2, "asset_name": "dev-workstation-john", "technique_id": "T1078",
                 "technique_name": "Valid Accounts", "description": "Credentials compromised"},
                {"step_number": 3, "asset_name": "auth-service", "technique_id": "T1550.001",
                 "technique_name": "Application Access Token", "description": "Tokens extracted"},
                {"step_number": 4, "asset_name": "prod-db-postgres", "technique_id": "T1005",
                 "technique_name": "Data from Local System", "description": "Database exfiltrated"},
             ]},
            {"name": "API Exploit → RCE → Cloud Exfil", "description": "HTTP/2 vulnerability leads to S3 data theft",
             "severity": "high", "likelihood": 0.45, "impact": 0.80, "mitre_tactics": ["TA0001", "TA0002"],
             "steps": [
                {"step_number": 1, "asset_name": "prod-api-gateway", "technique_id": "T1190",
                 "technique_name": "Exploit Public-Facing Application", "description": "CVE-2023-44487 exploited"},
                {"step_number": 2, "asset_name": "aws-s3-data-bucket", "technique_id": "T1530",
                 "technique_name": "Data from Cloud Storage", "description": "S3 credentials stolen"},
             ]}
        ]
    }

def soc_chat_demo(message: str):
    """Return mock SOC analyst response without API call"""
    responses = {
        "highest": "Based on the digital twin analysis, prod-db-postgres is our highest risk asset at 9.1/10. It's exposed to CVE-2022-2625 which allows SQL injection. We need to patch immediately and restrict network access.",
        "attack": "An attacker could exploit CVE-2023-44487 in our API gateway, gain RCE, then access metadata service to steal S3 credentials. From there, all customer data is exposed.",
        "fix": "Top 3 priorities: 1) Patch CVE-2023-44487 on API gateway 2) Rotate S3 credentials and restrict permissions 3) Enable MFA on admin account (currently unprotected)",
        "default": "I see {} in the infrastructure. The main risk is that multiple assets are internet-facing with known vulnerabilities. We need immediate patching and network segmentation."
    }

    msg_lower = message.lower()
    if "highest" in msg_lower or "critical" in msg_lower:
        return responses["highest"]
    elif "attack" in msg_lower or "exploit" in msg_lower:
        return responses["attack"]
    elif "fix" in msg_lower or "should we" in msg_lower:
        return responses["fix"]
    else:
        return responses["default"].format(message)

def whatif_demo(scenario: str):
    """Return mock what-if simulation without API call"""
    return {
        "scenario_name": "Admin Account Compromised",
        "executive_summary": "If the admin account is compromised, attackers could access the auth service within minutes and reach the production database within 1 hour. This would expose customer data and cause regulatory violations.",
        "new_risk_score": 9.4,
        "blast_radius": {
            "compromised_immediately": ["admin-user-sarah", "auth-service"],
            "at_risk_within_24h": ["prod-db-postgres", "aws-s3-data-bucket", "prod-api-gateway"],
            "likely_safe": ["corp-firewall"]
        },
        "estimated_financial_impact": "$2.5M - $5M",
        "recommended_immediate_actions": [
            "Rotate admin credentials immediately",
            "Enable MFA on all admin accounts",
            "Revoke all existing sessions",
            "Monitor database for unauthorized access",
            "Review S3 access logs"
        ]
    }

def generate_report_demo():
    """Return mock report without API call"""
    return {
        "executive_summary": "CyberTwin AI has identified critical vulnerabilities in the digital infrastructure. The overall risk score of 7.8/10 indicates serious exposure to known attack vectors. Immediate action is required to patch vulnerabilities and implement network segmentation.",
        "overall_score": 7.8,
        "category_scores": {
            "network_security": 6.8,
            "application_security": 8.1,
            "identity_access": 7.5,
            "data_protection": 6.2
        },
        "top_5_risks": [
            {"rank": 1, "title": "SQL Injection in Database", "description": "CVE-2022-2625 allows authenticated RCE", "remediation_effort": "high"},
            {"rank": 2, "title": "HTTP/2 Rapid Reset", "description": "CVE-2023-44487 in API gateway enables DoS/RCE", "remediation_effort": "high"},
            {"rank": 3, "title": "Unprotected Admin Account", "description": "No MFA, high-value target", "remediation_effort": "low"},
            {"rank": 4, "title": "Public S3 Bucket", "description": "Misconfigured access controls", "remediation_effort": "medium"},
            {"rank": 5, "title": "Unpatched Endpoints", "description": "Windows workstations missing security updates", "remediation_effort": "medium"},
        ],
        "30_day_roadmap": ["Patch all CVEs", "Enable MFA on admin accounts", "Implement network segmentation"],
        "90_day_roadmap": ["Deploy WAF", "Implement SIEM", "Conduct penetration test"]
    }
