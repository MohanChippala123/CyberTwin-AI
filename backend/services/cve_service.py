import httpx
import json
from typing import List, Dict, Optional

NVD_API_URL = "https://services.nvd.nist.gov/rest/json/cves/2.0"

CVE_CACHE = {
    "CVE-2023-44487": {
        "id": "CVE-2023-44487",
        "description": "HTTP/2 Rapid Reset attack allows remote attacker to cause denial of service",
        "cvss_score": 7.5,
        "severity": "HIGH",
        "published": "2023-10-10",
        "references": ["https://nvd.nist.gov/vuln/detail/CVE-2023-44487"]
    },
    "CVE-2021-41773": {
        "id": "CVE-2021-41773",
        "description": "Path traversal vulnerability in Apache HTTP Server",
        "cvss_score": 7.5,
        "severity": "HIGH",
        "published": "2021-10-05",
        "references": ["https://nvd.nist.gov/vuln/detail/CVE-2021-41773"]
    },
    "CVE-2022-2625": {
        "id": "CVE-2022-2625",
        "description": "SQL injection vulnerability in PostgreSQL",
        "cvss_score": 8.8,
        "severity": "HIGH",
        "published": "2022-09-12",
        "references": ["https://nvd.nist.gov/vuln/detail/CVE-2022-2625"]
    },
    "CVE-2023-28858": {
        "id": "CVE-2023-28858",
        "description": "Redis authentication bypass vulnerability",
        "cvss_score": 8.0,
        "severity": "HIGH",
        "published": "2023-07-15",
        "references": ["https://nvd.nist.gov/vuln/detail/CVE-2023-28858"]
    },
    "CVE-2023-36025": {
        "id": "CVE-2023-36025",
        "description": "Windows privilege escalation vulnerability",
        "cvss_score": 8.1,
        "severity": "HIGH",
        "published": "2023-08-01",
        "references": ["https://nvd.nist.gov/vuln/detail/CVE-2023-36025"]
    }
}


async def lookup_cve(cve_id: str) -> Optional[Dict]:
    if cve_id in CVE_CACHE:
        return CVE_CACHE[cve_id]

    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{NVD_API_URL}",
                params={"keywordSearch": cve_id, "resultsPerPage": 1},
                timeout=5.0
            )

            if response.status_code == 200:
                data = response.json()
                if data.get("vulnerabilities"):
                    vuln = data["vulnerabilities"][0]["cve"]
                    return {
                        "id": vuln.get("id"),
                        "description": vuln.get("descriptions", [{}])[0].get("value", ""),
                        "cvss_score": vuln.get("metrics", {}).get("cvssV3_1", {}).get("cvssData", {}).get("baseScore", 0.0),
                        "severity": vuln.get("metrics", {}).get("cvssV3_1", {}).get("cvssData", {}).get("baseSeverity", "UNKNOWN"),
                        "published": vuln.get("published", ""),
                        "references": [ref.get("url") for ref in vuln.get("references", [])]
                    }
    except Exception as e:
        print(f"Error fetching CVE {cve_id}: {e}")

    return None


async def lookup_cves_for_asset(cve_ids: List[str]) -> List[Dict]:
    results = []
    for cve_id in cve_ids:
        cve_data = await lookup_cve(cve_id)
        if cve_data:
            results.append(cve_data)
    return results


def search_cves(query: str, limit: int = 10) -> List[Dict]:
    results = []
    query_lower = query.lower()

    for cve_id, cve_data in CVE_CACHE.items():
        if query_lower in cve_id.lower() or query_lower in cve_data["description"].lower():
            results.append(cve_data)
            if len(results) >= limit:
                break

    return results
