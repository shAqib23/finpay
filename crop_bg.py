from PIL import Image

def crop_top(image_path, crop_percentage):
    img = Image.open(image_path)
    width, height = img.size
    
    top = int(height * crop_percentage)
    
    cropped_img = img.crop((0, top, width, height))
    
    cropped_img.save(image_path)
    print(f"Success: Cropped top {crop_percentage*100}% off {image_path}")

if __name__ == '__main__':
    # 18% is roughly ~150-200px on standard screens, fully enough to clear a navbar/logo
    crop_top(r'c:\Users\shaqi\Downloads\acealps\asset\bg.png', 0.18)
