import os
import re
from html.parser import HTMLParser

class SheetParser(HTMLParser):
    def __init__(self):
        super().__init__()
        self.in_tr = False
        self.in_td = False
        self.current_row = []
        self.current_cell = ""
        self.rows = []

    def handle_starttag(self, tag, attrs):
        if tag == "tr":
            self.in_tr = True
            self.current_row = []
        elif tag == "td" or tag == "th":
            self.in_td = True
            self.current_cell = ""

    def handle_endtag(self, tag):
        if tag == "tr":
            self.in_tr = False
            if self.current_row:
                self.rows.append(self.current_row)
        elif tag == "td" or tag == "th":
            self.in_td = False
            # Clean up spacing
            self.current_row.append(self.current_cell.strip())

    def handle_data(self, data):
        if self.in_td:
            self.current_cell += data

def main():
    filepath = r"c:\Users\ASUS\OneDrive\المستندات\GitHub\ICBG\ICBG Boardgame Collection! - Google Drive_files\sheet.html"
    if not os.path.exists(filepath):
        print("File not found:", filepath)
        return

    with open(filepath, "r", encoding="utf-8") as f:
        html_content = f.read()

    parser = SheetParser()
    parser.feed(html_content)

    print(f"Total rows parsed: {len(parser.rows)}")
    for i, row in enumerate(parser.rows[:20]):
        print(f"Row {i}: {row}")

if __name__ == "__main__":
    main()
