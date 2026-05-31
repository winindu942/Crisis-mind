def classify(text: str) -> str:
    text = text.lower()
    if any(word in text for word in ["flood", "water", "rain", "river", "submerged", "drowning"]):
        return "flood"
    if any(word in text for word in ["fire", "flame", "burning", "smoke", "blaze"]):
        return "fire"
    if any(word in text for word in ["earthquake", "tremor", "shaking", "quake", "aftershock"]):
        return "earthquake"
    if any(word in text for word in ["chemical", "gas", "leak", "toxic", "hazmat", "spill"]):
        return "chemical_spill"
    return "other"
