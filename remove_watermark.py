import os
from PIL import Image

def remove_gemini_watermark(image_path):
    if not os.path.exists(image_path):
        print(f"Skipped {image_path} (not found)")
        return
    try:
        img = Image.open(image_path)
        w, h = img.size
        
        # The Gemini watermark sits exactly in the very bottom edge.
        # Cropping the bottom 6% guarantees it's completely severed.
        bottom = int(h * 0.94) 
        
        cropped_img = img.crop((0, 0, w, bottom))
        cropped_img.save(image_path)
        print(f"Success: Removed Gemini watermark from {image_path}")
    except Exception as e:
        print(f"Error on {image_path}: {e}")

if __name__ == '__main__':
    images = [
        r'c:\Users\shaqi\Downloads\acealps\honey_nuts.png',
        r'c:\Users\shaqi\Downloads\acealps\cardamom.png',
        r'c:\Users\shaqi\Downloads\acealps\black_pepper.png',
    ]
    for img_path in images:
        remove_gemini_watermark(img_path)
