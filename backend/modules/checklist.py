def get_checklist(disaster_type: str) -> list:
    checklists = {
        "flood": [
            "Activate flood emergency response plan",
            "Deploy water rescue teams to affected zones",
            "Pre-position medical evacuation at nearby hospitals",
            "Divert traffic away from flood zones",
            "Alert public via emergency broadcast system",
            "Monitor water levels at key infrastructure points"
        ],
        "fire": [
            "Dispatch fire suppression units immediately",
            "Establish safety perimeter and evacuation zone",
            "Position medical teams at safe distance",
            "Cut power to affected grid section",
            "Monitor wind direction for spread prediction",
            "Coordinate with utility companies"
        ],
        "earthquake": [
            "Activate earthquake emergency response protocol",
            "Deploy search & rescue teams to collapsed structures",
            "Inspect and close damaged bridges and roads",
            "Assess dam and reservoir integrity",
            "Set up field medical stations",
            "Prepare for aftershock events"
        ],
        "chemical_spill": [
            "Establish 500m exclusion zone immediately",
            "Deploy hazmat teams with full protective equipment",
            "Identify wind direction and potential spread path",
            "Alert water authority to protect supply",
            "Set up decontamination stations",
            "Coordinate with poison control center"
        ],
        "other": [
            "Assess situation and gather more information",
            "Deploy first responders to scene",
            "Establish command post",
            "Monitor for situation escalation"
        ]
    }
    return checklists.get(disaster_type, checklists["other"])
