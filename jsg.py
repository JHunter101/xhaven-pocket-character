import os
import json
import pandas as pd
import json
import numpy as np

os.chdir(os.path.dirname(os.path.realpath(__file__)))

image_dir = "./images"
js_dir = "./js"

 
### READ JSON DATA ###  
 
class_data = pd.read_csv('class_data.csv') 

with open(os.path.join(js_dir, 'attack-modifiers.js'), 'r') as f:
  attack_modifiers = json.load(f)

with open(os.path.join(js_dir, 'character-ability-cards.js'), 'r') as f:
  character_ability_cards = json.load(f)
  
with open(os.path.join(js_dir, 'character-mats.js'), 'r') as f:
  character_mats = json.load(f)
  
with open(os.path.join(js_dir, 'character-perks.js'), 'r') as f:
  character_perks = json.load(f)
  
### READ JSON DATA ###  
owners = []
# New JS Format
new_character_ability_cards = {}
for card in character_ability_cards:
    owner = card['image'].split("/")[2]
    if owner not in new_character_ability_cards:
        new_character_ability_cards[owner] = []
    new_character_ability_cards[owner].append(card)

for char in new_character_ability_cards:
    new_character_ability_cards[char] = sorted(new_character_ability_cards[char], key=lambda d: d['cardno']) 


for char in new_character_ability_cards:
    card_ids = [card['cardno'][-3:] for card in new_character_ability_cards[char] if card['cardno'][-3:].isnumeric()]
    id_start = min(card_ids)
    id_stop = max(card_ids)
    class_data.loc[class_data.code == char, ['id_start', 'id_stop']] = id_start, id_stop
    
    
print(class_data['id_start'])
class_data.to_csv('class_data.csv', index = False)
parsed = json.loads(class_data.to_json(orient="index"))
js_file = os.path.join(js_dir, "class-data.js")
with open(js_file, "w") as f:
    f.write("var class_data = " + json.dumps(parsed,indent=4) + ";")

# Write JavaScript file containing image IDs
js_file = os.path.join(js_dir, "new-character-ability-cards.js")
with open(js_file, "w") as f:
    f.write("var imageIds = " + json.dumps(new_character_ability_cards,indent=4) + ";")












total_data = {}
for root, dirs, files in os.walk(image_dir):
    image_data = []
    for file in files:
        if file.endswith(".png"):
            # Create JSON data for image
            image_json = {
                "filename": file,
                "game": file[0:2],
                "character_name": file[3:5],
                "level": file[6:8],
                "id": file[9:12],
                "location": root.replace('\\', '/')[2:]
            }
            
            # Append image data to list
            image_data.append(image_json)
    
    if len(image_data) > 0:
        data_json = {
            "data": image_data,
            "class_data": "N/A"
        }
        cClass = image_data[0]['character_name']
        total_data[cClass] = (data_json)
    

# Write JavaScript file containing image IDs
js_file = os.path.join(js_dir, "image_ids.js")
with open(js_file, "w") as f:
    f.write("var imageIds = " + json.dumps(total_data,indent=4) + ";")
