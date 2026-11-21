import sys
print("Python executable:", sys.executable)
try:
    from rembg import remove, new_session
    from PIL import Image
    print("rembg imported successfully")

    # Use u2net or isnet-general-use
    session = new_session("u2net")
    print("Session created. Loading image...")
    
    img = Image.open("public/images/eggu-master-ai-concept.jpg")
    print("Processing removal...")
    out = remove(img, session=session)
    out.save("public/images/eggu-sandwich-subject-cutout-ai.png")
    print("Saved public/images/eggu-sandwich-subject-cutout-ai.png successfully!")
except Exception as e:
    print("Error:", e)
