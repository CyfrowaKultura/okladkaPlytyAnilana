from PIL import Image, ImageDraw

input_path = 'okladka_3d/images/cd_label.jpg'
output_path = 'okladka_3d/images/cd_label.png'

print(f"Processing {input_path}...")
img = Image.open(input_path).convert('RGBA')
width, height = img.size

# Używamy algorytmu floodfill (wypełnianie) z 4 rogów, aby zamienić czarne tło na przezroczyste, 
# nie ruszając czarnych elementów wewnątrz samej płyty.
thresh = 30 # tolerancja dla kompresji JPG (lekko szare piksele)
ImageDraw.floodfill(img, (0, 0), (0, 0, 0, 0), thresh=thresh)
ImageDraw.floodfill(img, (width-1, 0), (0, 0, 0, 0), thresh=thresh)
ImageDraw.floodfill(img, (0, height-1), (0, 0, 0, 0), thresh=thresh)
ImageDraw.floodfill(img, (width-1, height-1), (0, 0, 0, 0), thresh=thresh)

img.save(output_path, "PNG")
print(f"Saved {output_path} with transparent background (floodfill method).")
