import sys
from datetime import datetime

import requests
from requests.auth import HTTPBasicAuth

WEBDAV_URL = 'yourwebdavurl'
USERNAME = 'username'
PASSWORD = 'password'

def get_current_time():
    return datetime.now().strftime('%Y-%m-%dT%H:%M:%S') # Do not edit it, javascript compatible.

def append_time_to_file():
    current_time = get_current_time()
    headers = {'Content-Type': 'text/plain; charset=utf-8'}

    try:
        response = requests.head(WEBDAV_URL, auth=HTTPBasicAuth(USERNAME, PASSWORD))
        
        if response.status_code == 200:
            response = requests.get(WEBDAV_URL, auth=HTTPBasicAuth(USERNAME, PASSWORD))
            file_content = response.text
            file_content += f'{current_time}\n'
        else:
            file_content = f'{current_time}\n'

        response = requests.put(WEBDAV_URL, data=file_content, headers=headers, auth=HTTPBasicAuth(USERNAME, PASSWORD))
        
        if response.status_code in (200, 201):
            print("Successfully recorded game time.")
        else:
            print(f"Failed to update the file. Status code: {response.status_code}")
            sys.exit(-1)

    except requests.RequestException as e:
        print(f"An error occurred:\n{e}")
        sys.exit(-1)

if __name__ == "__main__":
    append_time_to_file()
