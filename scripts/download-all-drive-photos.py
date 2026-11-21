import urllib.request
import os
import time

drive_photos = [
    (1, "1EhTZotM5OiCdumW_qHtnm8xwmDCo7GdW"),
    (2, "1nY2YjK7V0NJiNvb58XyZrPcc3V0b_ArU"),
    (3, "1iIITcvWlHWRiK3OMaQUmgyajo7Ay8A2v"),
    (4, "1HopPxmSXK0MAJKdlNqatHl5MuzgBxzUD"),
    (5, "1hfGxLWT7kGZD_cWEvgMGa5_xQG_BWVmA"),
    (6, "1esRyiGqfvSbJcHMgiSBbnP9IX3vsuVNH"),
    (7, "10G-u91m2menMyWteXh_vvb19kF0vfm-T"),
    (8, "170JP1SLCxBmDjAt14Di51G7rVU_wk57s"),
    (9, "1GPeLUQqXr8aGLjCr__AP5NxdGajOAgcA"),
    (10, "1Qtk6n_RzMvCnNxG7hoHZ2VpL_VEpYR7L"),
    (11, "1iVbFtLH3BQZ5NfX_A5DuaUMp_id09O7X"),
    (12, "1HY005VswouAaGyOBETPGslmaPzPDJLHS"),
    (13, "17TxNscqcxikXMQpvoxZ-mpzJwUi0qfli"),
    (14, "1YYTvqO8zQc6Ad0zn0FjlLkSNthZE7qJ9"),
    (15, "1z8kqDtHLPnSRH2pFDqNH56-gpuFb0z-L"),
    (16, "1lLbHli1ht8tnEnAlJse-UqMtpuluJwcc"),
]

os.makedirs("public/images/real-eggu", exist_ok=True)

for num, fid in drive_photos:
    target_path = f"public/images/real-eggu/drive-eggu-{num}.jpg"
    url = f"https://drive.google.com/uc?export=download&id={fid}"
    print(f"Downloading #{num} (ID: {fid})...")
    try:
        req = urllib.request.Request(
            url,
            headers={"User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36"}
        )
        with urllib.request.urlopen(req) as resp, open(target_path, "wb") as f:
            f.write(resp.read())
        size = os.path.getsize(target_path)
        print(f" -> Saved {target_path} ({size} bytes)")
    except Exception as e:
        print(f" -> Error on #{num}: {e}")
    time.sleep(0.5)

print("All Drive photos download complete!")
