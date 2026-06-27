import os
import glob
from PIL import Image

def process_images():
    input_files = glob.glob('okladka_3d/*.JPG')
    output_dir = 'okladka_3d/images'
    
    sides = [
        'acc_1_front.jpg', 'acc_1_back.jpg',
        'acc_2_front.jpg', 'acc_2_back.jpg',
        'acc_3_front.jpg', 'acc_3_back.jpg',
        'acc_4_front.jpg', 'acc_4_back.jpg'
    ]
    
    files_to_process = input_files[:8]
    
    for i, file_path in enumerate(files_to_process):
        print(f"Processing {file_path}...")
        
        # Load image
        img = Image.open(file_path)
        
        # Determine the square size (max of width and height)
        w, h = img.size
        size = max(w, h)
        
        # Create a completely black square image
        black_bg = Image.new('RGB', (size, size), (0, 0, 0))
        
        # Calculate position to center the subject on the black background
        paste_x = (size - w) // 2
        paste_y = (size - h) // 2
        
        # Paste original image
        black_bg.paste(img, (paste_x, paste_y))
        
        # Resize to max 1000x1000 to save RAM in browser
        black_bg = black_bg.resize((1000, 1000), Image.Resampling.LANCZOS)
        
        # Save the result
        out_name = sides[i]
        out_path = os.path.join(output_dir, out_name)
        black_bg.save(out_path, 'JPEG', quality=85)
        print(f"Saved {out_path} at 1000x1000")
        
if __name__ == "__main__":
    process_images()
