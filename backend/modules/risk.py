def predict_risks(disaster_type: str, urgency: str) -> list:
    risks = {
        "flood": [
            "Hospital access roads may flood within 40 minutes",
            "Evacuation routes at risk of becoming impassable",
            "Power substations in low-lying areas at risk"
        ],
        "fire": [
            "Fire may spread to adjacent buildings within 20 minutes",
            "Nearby power station at risk",
            "Smoke inhalation risk expanding to 2km radius"
        ],
        "earthquake": [
            "Aftershocks likely within 2 hours",
            "Bridge and road structural integrity at risk",
            "Dam integrity requires immediate inspection"
        ],
        "chemical_spill": [
            "Wind may carry contamination to residential zones",
            "Nearby water supply at risk of contamination",
            "500m exclusion zone recommended immediately"
        ],
        "other": [
            "Situation developing — monitor closely",
            "Assess nearby infrastructure for secondary impact"
        ]
    }
    return risks.get(disaster_type, risks["other"])
