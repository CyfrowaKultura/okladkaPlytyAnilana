import os
import glob
from PIL import Image
from rembg import remove, new_session

def process_test():
    input_files = glob.glob('okladka_3d/*.JPG')
    if not input_files:
        print("No input files")
        return
    
    file_path = input_files[0]
    print(f"Testing {file_path} with u2net_human_seg...")
    
    img = Image.open(file_path)
    
    session = new_session("u2net_human_seg")
    subject = remove(img, session=session)
    
    subject.save('okladka_3d/images/test_human_seg.png', "PNG")
    print("Saved test_human_seg.png")

if __name__ == "__main__":
    process_test()
