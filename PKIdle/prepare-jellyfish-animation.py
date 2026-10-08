from pathlib import Path
from PIL import Image

assets = Path(__file__).parent / 'assets'
source = Image.open(assets / 'jellyfish-idle-source.png').convert('RGBA')
source.putalpha(source.getchannel('A').point(lambda alpha: 255 if alpha >= 128 else 0))
cells = [source.crop((round(i * source.width / 4), 0, round((i + 1) * source.width / 4), source.height)) for i in range(4)]
boxes = [cell.getbbox() for cell in cells]
common = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))
scale = 28 / max(common[2] - common[0], common[3] - common[1])
size = (round((common[2] - common[0]) * scale), round((common[3] - common[1]) * scale))
sheet = Image.new('RGBA', (128, 32))
frames = []
for i, cell in enumerate(cells):
    frame = Image.new('RGBA', (32, 32))
    frame.alpha_composite(cell.crop(common).resize(size, Image.Resampling.NEAREST), ((32 - size[0]) // 2, (32 - size[1]) // 2))
    frame.save(assets / f'jellyfish-idle-{i}.png')
    sheet.alpha_composite(frame, (32 * i, 0))
    preview = Image.new('RGBA', (192, 192), '#08283d')
    preview.alpha_composite(frame.resize((192, 192), Image.Resampling.NEAREST))
    frames.append(preview.convert('RGB'))
sheet.save(assets / 'jellyfish-idle.png')
frames[0].save(assets / 'jellyfish-idle-preview.gif', save_all=True, append_images=frames[1:], duration=300, loop=0)
print('Four aligned 32x32 frames and horizontal 128x32 strip prepared.')
