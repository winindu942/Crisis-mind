def suggest_resources(disaster_type: str, urgency: str) -> list:
    table = {
        ("flood", "critical"):   ["3 water rescue units", "1 medical evacuation team", "2 traffic control units", "1 emergency shelter team"],
        ("flood", "high"):       ["2 water rescue units", "1 medical standby unit", "1 traffic control unit"],
        ("flood", "medium"):     ["1 water rescue unit", "1 medical standby unit"],
        ("flood", "low"):        ["1 monitoring unit"],
        ("fire", "critical"):    ["5 fire trucks", "2 medical units", "1 hazmat team", "1 evacuation team"],
        ("fire", "high"):        ["4 fire trucks", "2 medical standby units", "1 hazmat team"],
        ("fire", "medium"):      ["2 fire trucks", "1 medical standby unit"],
        ("fire", "low"):         ["1 fire truck", "1 monitoring unit"],
        ("earthquake", "critical"): ["3 search & rescue teams", "2 medical teams", "1 structural engineering unit", "2 heavy equipment units"],
        ("earthquake", "high"):  ["2 search & rescue teams", "1 medical team", "1 structural assessment unit"],
        ("earthquake", "medium"):["1 search & rescue team", "1 medical team"],
        ("earthquake", "low"):   ["1 assessment team"],
        ("chemical_spill", "critical"): ["2 hazmat teams", "2 medical units", "1 decontamination unit", "1 evacuation team"],
        ("chemical_spill", "high"):     ["1 hazmat team", "1 medical unit", "1 decontamination unit"],
        ("chemical_spill", "medium"):   ["1 hazmat team", "1 medical standby"],
        ("chemical_spill", "low"):      ["1 hazmat monitoring unit"],
    }
    return table.get((disaster_type, urgency), ["1 assessment team", "1 medical standby unit"])
