import os
from PIL import Image
from rembg import remove

def remove_bg(input_path, output_path):
    print(f"Processing {input_path}...")
    img = Image.open(input_path)
    subject = remove(img)
    subject.save(output_path, "PNG")
    print(f"Saved {output_path}")

in_path = 'okladka_3d/images/cd_label.jpg'
out_path = 'okladka_3d/images/cd_label.png'

remove_bg(in_path, out_path)
