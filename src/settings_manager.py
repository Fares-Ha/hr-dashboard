import json
import os

SETTINGS_FILE = "settings.json"

DEFAULT_SETTINGS = {
    "theme": "Light",
    "logo_path": None
}

def load_settings():
    """Loads settings from the JSON file. Returns default settings if file doesn't exist."""
    if not os.path.exists(SETTINGS_FILE):
        return DEFAULT_SETTINGS
    try:
        with open(SETTINGS_FILE, 'r') as f:
            settings = json.load(f)
            # Ensure all keys are present, add defaults for missing ones
            for key, value in DEFAULT_SETTINGS.items():
                if key not in settings:
                    settings[key] = value
            return settings
    except (json.JSONDecodeError, IOError):
        return DEFAULT_SETTINGS

def save_settings(settings):
    """Saves the given settings dictionary to the JSON file."""
    try:
        with open(SETTINGS_FILE, 'w') as f:
            json.dump(settings, f, indent=4)
    except IOError as e:
        print(f"Error saving settings: {e}")
