import os
import json

base_dir = r"c:\Users\AkramZekri\Desktop\ML\salma\frontend\src\data"
files = ["data.json", "data (1).json", "data (2).json"]

for f in files:
    path = os.path.join(base_dir, f)
    if os.path.exists(path):
        with open(path, 'r', encoding='utf-8') as file:
            data = json.load(file)
            print(f"--- {f} ---")
            for i in data[:5]:
                print(f"Name: {i.get('name')}")
    else:
        print(f"{f}: Not found at {path}")
