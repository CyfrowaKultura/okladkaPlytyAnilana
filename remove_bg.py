import os
from PIL import Image
from rembg import remove

def remove_bg(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    subject = remove(img)
    subject.save(output_path, "PNG")
    print(f"Saved {output_path}")

kierpce_tied_in = '/Users/kl/.gemini/antigravity-ide/brain/1213f56a-f939-4dcc-aedc-56bed4891785/kierpce_tied_1782602122249.png'
kierpce_out = 'okladka_3d/images/kierpce.png'

remove_bg(kierpce_tied_in, kierpce_out)
