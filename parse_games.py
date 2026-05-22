import os
import json
from bs4 import BeautifulSoup

def main():
    filepath = r"c:\Users\ASUS\OneDrive\المستندات\GitHub\ICBG\ICBG Boardgame Collection! - Google Drive_files\sheet.html"
    if not os.path.exists(filepath):
        print("File not found:", filepath)
        return

    with open(filepath, "r", encoding="utf-8") as f:
        html_content = f.read()

    soup = BeautifulSoup(html_content, "html.parser")
    table = soup.find("table")
    if not table:
        print("Table not found")
        return

    rows = table.find_all("tr")
    games = []
    
    # Row 0, 1, 2 are empty/meta
    # Row 3 is header: ['Num', 'Game Type', 'Title', '', 'Competition', 'Theme', 'Players', 'Box Picture', 'Gameplay Picture', 'Year', 'Time', 'W/ Expansion', 'How To Play Link', 'Quick Summary', 'Rating (BGG)']
    # Let's inspect the headers from the parsed rows
    headers = []
    
    for row_idx, r in enumerate(rows):
        cells = r.find_all(["td", "th"])
        cell_data = []
        for c in cells:
            # Check for images inside cell
            img = c.find("img")
            link = c.find("a")
            text = c.get_text().strip()
            
            if img:
                src = img.get("src", "")
                cell_data.append({"text": text, "img": src, "link": link.get("href", "") if link else ""})
            elif link:
                cell_data.append({"text": text, "link": link.get("href", "")})
            else:
                cell_data.append({"text": text})
        
        # We find Row 3 as header
        # Let's clean up and parse rows starting from index 5
        if row_idx < 3:
            continue
        if row_idx == 3:
            # Header row
            headers = [c.get("text", c.get("text", "")) if isinstance(c, dict) else c for c in cell_data]
            print("Headers found in HTML:", headers)
            continue
        
        # Check if the row represents a game
        # A valid game row should have a title in column 5 (index 5)
        if len(cell_data) > 5:
            # Column mapping based on inspected row 3:
            # Column 3 (index 3): Num
            # Column 4 (index 4): Game Type
            # Column 5 (index 5): Title
            # Column 6 (index 6): (usually empty separator)
            # Column 7 (index 7): Competition
            # Column 8 (index 8): Theme
            # Column 9 (index 9): Players
            # Column 10 (index 10): Box Picture
            # Column 11 (index 11): Gameplay Picture
            # Column 12 (index 12): Year
            # Column 13 (index 13): Time
            # Column 14 (index 14): W/ Expansion
            # Column 15 (index 15): How To Play Link
            # Column 16 (index 16): Quick Summary
            # Column 17 (index 17): Rating (BGG)
            
            def get_val(idx, field="text"):
                if idx < len(cell_data):
                    val = cell_data[idx]
                    if isinstance(val, dict):
                        return val.get(field, "")
                    return val if field == "text" else ""
                return ""
            
            title = get_val(5)
            if not title or title.lower() in ["title", "none", ""]:
                continue
                
            num = get_val(3)
            game_type = get_val(4)
            competition = get_val(7)
            theme = get_val(8)
            players = get_val(9)
            
            box_img = get_val(10, "img")
            box_link = get_val(10, "link")
            play_img = get_val(11, "img")
            play_link = get_val(11, "link")
            
            year = get_val(12)
            time = get_val(13)
            expansion = get_val(14)
            how_to_play = get_val(15, "link") or get_val(15, "text")
            quick_summary = get_val(16, "link") or get_val(16, "text")
            rating = get_val(17)
            
            game = {
                "num": num,
                "type": game_type,
                "title": title,
                "competition": competition,
                "theme": theme,
                "players": players,
                "box_img": box_img,
                "box_link": box_link,
                "play_img": play_img,
                "play_link": play_link,
                "year": year,
                "time": time,
                "expansion": expansion,
                "how_to_play": how_to_play,
                "quick_summary": quick_summary,
                "rating": rating
            }
            games.append(game)
            
    print(f"Extracted {len(games)} games.")
    with open("board_games.json", "w", encoding="utf-8") as f:
        json.dump(games, f, indent=2, ensure_ascii=False)
    print("Saved games to board_games.json")

if __name__ == "__main__":
    main()
