from PIL import Image, ImageDraw

input_path = 'okladka_3d/images/cd_label.jpg'
output_path = 'okladka_3d/images/cd_label.png'

print(f"Processing {input_path}...")
img = Image.open(input_path).convert('RGBA')

# Tworzenie idealnie okrągłej maski na wymiar obrazka
mask = Image.new("L", img.size, 0)
draw = ImageDraw.Draw(mask)
draw.ellipse((0, 0, img.size[0], img.size[1]), fill=255)

# Aplikacja maski na obrazek (wszystko poza kołem staje się w 100% przezroczyste)
img.putalpha(mask)
img.save(output_path, "PNG")
print(f"Saved {output_path} with circular mask.")
