import requests
import os
from pathlib import Path
import json
import glob
import time
import logging
import threading
from datetime import datetime
import re
import sys

try:
    from tqdm.auto import tqdm
    HAS_TQDM = True
except ImportError:
    HAS_TQDM = False
    print("\n[INFO] 'tqdm' Library is Not Installed on your system. Hence, the Progress Bar while Downloading Files will appear a bit differently.\n")

token_url = "https://mosdac.gov.in/download_api/gettoken"
search_url = "https://mosdac.gov.in/apios/datasets.json"
check_internet_url = "https://mosdac.gov.in/download_api/check-internet"
download_url = "https://mosdac.gov.in/download_api/download"
refresh_url = "https://mosdac.gov.in/download_api/refresh-token"
logout_url = "https://mosdac.gov.in/download_api/logout"

def preprocess_json(raw_json):
    """
    Escapes Unescaped Backslashes for Windows-style Paths provided in 'config.json' 
    """
    fixed_json = re.sub(r'(?<!\\)\\(?![\\/"bfnrtu])', r'\\\\', raw_json)
    fixed_json = re.sub(r'(?<!\\)\\(?=\s*")', r'\\\\', fixed_json)
    return fixed_json

def load_config(): 
    """Loads and validates configuration from config.json."""
    config_path = os.path.join(os.path.dirname(__file__), "config.json")
    try:
        with open(config_path, "r") as file:
            raw_config = file.read()
        
        try:
            config = json.loads(raw_config)
        except json.JSONDecodeError:
            fixed_json = preprocess_json(raw_config)
            try:
                config = json.loads(fixed_json)
            except json.JSONDecodeError:
                print("[ERROR] Invalid JSON format in 'config.json'! Please correct it and Try Again.")
                sys.exit(1)

        required_fields = ["user_credentials", "search_parameters"]
        for field in required_fields:
            if field not in config:
                raise ValueError(f"Missing Required Config Section: {field} inside 'config.json'")
            
        if "download_settings" not in config:
            print("\n[Warning]: 'download_settings' not set in 'config.json'. Downloading in the Current Directory..")
            config["download_settings"] = {
                "download_path": ""
            }
        return config
    
    except FileNotFoundError as e:
        print("[ERROR] 'config.json' Not Found!")
        exit(1)
        
    except ValueError as e:
        print(f"[ERROR] in 'config.json': {e}")
        exit(1)

config_file = load_config()

user_creds = config_file['user_credentials']
username = user_creds.get("username/email", "")
password = user_creds.get("password", "")

download_settings = config_file['download_settings']

download_path = download_settings.get("download_path", "").replace("\\", "/") or os.path.join(os.getcwd(), "MOSDAC Data Download")

use_date_structure = download_settings.get("organize_by_date", False)
skip_user_input = download_settings.get("skip_user_input", False)
generate_logs = download_settings.get("generate_error_logs", False)

bool_fields = {
    "organize_by_date": use_date_structure,
    "skip_user_input": skip_user_input,
    "generate_error_logs": generate_logs
}

invalid_fields = []

for field, value in bool_fields.items():
    if not isinstance(value, bool):
        invalid_fields.append((field, value))
    
if invalid_fields:
    print("\n[ERROR] Configuration Error: The following fields must be either: true or false (Boolean):")
    for field, value in invalid_fields:
        print(f" - '{field}' has Invalid Value: {value}")
    print("\nPlease Correct these in your 'config.json' and Try Again.\n")
    sys.exit(1)

search_params = config_file['search_parameters']
datasetId = search_params.get("datasetId", "3SIMG_L1B_STD")
startTime = search_params.get("startTime", "")
endTime = search_params.get("endTime", "")
startIndex = int(search_params.get("startIndex", 1) or 1)
count = search_params.get("count", "")
boundingBox = search_params.get("boundingBox", "")
gId = search_params.get("gId", "")

logger = logging.getLogger("client_error_logger")

try:
    if generate_logs:
        error_logs_dir = download_settings.get("error_logs_dir") or os.path.join(os.getcwd(), "error_logs")
        os.makedirs(error_logs_dir, exist_ok=True)

        date_str = datetime.now().strftime("%d-%m-%Y")
        log_file_path = os.path.join(error_logs_dir, f"{date_str}_error.log")

        file_handler = logging.FileHandler(log_file_path)
        formatter = logging.Formatter(
            fmt="%(asctime)s - %(levelname)s - %(message)s",
            datefmt="%d-%m-%Y %H:%M:%S"
        )
        file_handler.setFormatter(formatter)
        logger.addHandler(file_handler)
        logger.setLevel(logging.ERROR)
        logger.propagate = False
except PermissionError:
    print(f"\n[ERROR]: No Permission to Write on '{error_logs_dir}'. Please Check and Update Directory Permissions.\n")
    sys.exit(1)
except Exception as e:
    print(f"\nException encountered in Generating Logs: {e}\n")

def supports_color():
    if sys.platform != "win32":
        return True
    return "ANSICON" in os.environ or "WT_SESSION" in os.environ or os.environ.get("TERM_PROGRAM") == "vscode"

if supports_color():
    GREEN = "\033[92m"
    RED = "\033[91m"
    BOLD = "\033[1m"
    UNDERLINE = "\033[4m"
    RESET = "\033[0m"
else:
    GREEN = RED = RESET = BOLD = UNDERLINE = ""

def get_token():
    """Fetch access token from the token endpoint."""
    data = {
        "username": username, 
        "password": password
    }
    try:
        response = requests.post(token_url, json=data, timeout=10)

        if response.status_code == 503:
            print("Service Unavailable: ", response.json().get("message"))
            
        if response.status_code == 400:
            try:
                resp = response.json()
                err_msg = resp.get('error', 'Validation Error')
                print(f"\n[ERROR] Validation Error: {err_msg}.\n")
            except ValueError:
                print("\n[ERROR] Received status 400 but could not parse response.\n")
            sys.exit(1)

        if response.status_code == 401:
            try:
                resp = response.json()
                err_msg = resp.get('error', 'Invalid Username/Password')
                print(f"{err_msg}\n")
            except ValueError:
                print("\n[ERROR] Received status 401.\n")
            sys.exit(1)    

        response.raise_for_status()
        token_response = response.json()
        return {
            "access_token": token_response.get("access_token"),
            "refresh_token": token_response.get("refresh_token")
        }, username
    
    except requests.exceptions.RequestException as e:
        print(f"[ERROR] Error Occured in 'get_token()': {e}")
        sys.exit(1)

def format_size(size_mb):
    if size_mb < 1024:
        return f"{size_mb:,.2f} MB"
    elif size_mb < 1024 ** 2:
        size_gb = size_mb / 1024
        return f"{size_gb:,.2f} GB"
    else:
        size_tb = size_mb / (1024 ** 2)
        return f"{size_tb:,.2f} TB"

def search_results():
    """Fetches all data from the search endpoint using pagination.""" 
    print()
    print("Searching Data for Provided Parameters on MOSDAC...")
    data = {"datasetId": datasetId}

    optional_parameters = {
        "startTime": startTime,
        "endTime": endTime,
        "count": count,
        "boundingBox": boundingBox,
        "gId": gId
    }

    data.update({k: v for k, v in optional_parameters.items() if v})

    try:
        res = requests.get(search_url, params=data, timeout=12)
        if res.status_code == 200:
            res_list = res.json()
            totalResults = res_list.get("totalResults", 0)
            totalSize = res_list.get("totalSizeMB", 0)
            itemsPerPage = res_list.get("itemsPerPage", totalResults)

            formatted_size = format_size(totalSize)

            if count != "":
                print(f"\n{UNDERLINE}{itemsPerPage}{RESET} Files Found for {datasetId}{RESET}")
                return itemsPerPage

            print(f"\n{UNDERLINE}{totalResults:,}{RESET} Files Found with Total Size of {UNDERLINE}{formatted_size}{RESET}")
            return totalResults
        else:
            print(f"\n[ERROR] Status Code: {res.status_code} from Search API")
            sys.exit(1)
    except Exception as e:
        print(f"\n[ERROR] Network error during search: {e}")
        return 0

def logout():
    data = {"username": username} 
    try:
        requests.post(logout_url, json=data, timeout=5)
        print(f"\nLogout Successful. {BOLD}Goodbye {username}!{RESET}\n")
    except Exception:
        pass

def main():
    print(f"{BOLD}=== ISRO MOSDAC Satellite Data Downloader ==={RESET}")
    print(f"Target Dataset: {datasetId}")
    total_files = search_results()
    print(f"\nSearch complete. Ready for authenticated ingestion into CivicTwin AI.\n")

if __name__ == "__main__":
    main()
