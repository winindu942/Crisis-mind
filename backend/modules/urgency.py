def score_urgency(disaster_type: str, report_text: str) -> str:
    text = report_text.lower()

    critical_keywords = ["trapped", "dying", "dead", "casualties", "hospital", "school", "children", "collapse"]
    high_keywords = ["injured", "spreading", "evacuate", "blocked", "rising fast", "rescue"]
    medium_keywords = ["residents", "homes", "building", "road", "warning"]

    if any(word in text for word in critical_keywords):
        return "critical"
    if any(word in text for word in high_keywords):
        return "high"
    if any(word in text for word in medium_keywords):
        return "medium"
    return "low"
