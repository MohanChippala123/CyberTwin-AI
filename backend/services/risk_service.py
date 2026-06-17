from typing import List, Dict

ASSET_TYPE_BASE_RISK = {
    "database": 8.0,
    "api": 7.5,
    "server": 7.0,
    "cloud": 6.5,
    "firewall": 6.0,
    "endpoint": 5.5,
    "user": 5.0,
    "iot": 6.0,
}

CVSS_WEIGHT = 0.35
EXPLOIT_WEIGHT = 0.25
EXPOSURE_WEIGHT = 0.20
PATCH_WEIGHT = 0.20


def calculate_asset_risk_score(
    asset,
    cve_data: List[Dict] = None,
    is_internet_facing: bool = False,
    attack_path_count: int = 0
) -> float:
    if cve_data is None:
        cve_data = []

    base = ASSET_TYPE_BASE_RISK.get(asset.asset_type, 5.0)

    cvss_component = 0.0
    if cve_data:
        cvss_scores = [c.get("cvss_score", 5.0) for c in cve_data]
        avg_cvss = sum(cvss_scores) / len(cvss_scores)
        cve_multiplier = min(1.0 + (len(cve_data) - 1) * 0.1, 1.5)
        cvss_component = (avg_cvss / 10.0) * cve_multiplier

    exposure_component = 0.5
    if is_internet_facing or asset.ip_address and not asset.ip_address.startswith(("10.", "172.", "192.")):
        exposure_component = 1.0
    elif asset.asset_type in ("api", "firewall"):
        exposure_component = 0.8

    path_component = min(attack_path_count * 0.15, 1.0)
    patch_component = 0.5

    weighted_score = (
        base * 0.25
        + (cvss_component * 10) * CVSS_WEIGHT
        + (exposure_component * 10) * EXPOSURE_WEIGHT
        + (path_component * 10) * EXPLOIT_WEIGHT
        + (patch_component * 10) * PATCH_WEIGHT
    )

    return round(min(max(weighted_score, 0.0), 10.0), 2)


def calculate_company_risk_score(
    assets: List,
    attack_paths: List = None
) -> float:
    if attack_paths is None:
        attack_paths = []

    if not assets:
        return 0.0

    scores = [a.risk_score for a in assets]

    scores_sorted = sorted(scores, reverse=True)

    n = len(scores_sorted)
    if n == 1:
        weighted = scores_sorted[0]
    elif n == 2:
        weighted = scores_sorted[0] * 0.60 + scores_sorted[1] * 0.40
    else:
        top_two = scores_sorted[0] * 0.30 + scores_sorted[1] * 0.20
        rest_avg = sum(scores_sorted[2:]) / (n - 2)
        weighted = top_two + rest_avg * 0.50

    critical_paths = sum(1 for p in attack_paths if p.severity == "critical")
    path_bonus = min(critical_paths * 0.3, 1.5)

    final = min(weighted + path_bonus, 10.0)
    return round(final, 2)


def get_risk_status(score: float) -> str:
    if score >= 8.0:
        return "critical"
    if score >= 6.0:
        return "warning"
    if score >= 3.0:
        return "moderate"
    return "safe"


def get_risk_color(score: float) -> str:
    if score >= 8.0:
        return "#ef4444"
    if score >= 6.0:
        return "#f59e0b"
    if score >= 3.0:
        return "#3b82f6"
    return "#22c55e"
