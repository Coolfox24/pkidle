from pathlib import Path
from PIL import Image

assets = Path(__file__).parent / 'assets'
for color in ['cyan', 'blue', 'orange', 'red']:
    source = Image.open(assets / f'jellyfish-{color}-v2-source.png').convert('RGBA')
    source.putalpha(source.getchannel('A').point(lambda alpha: 255 if alpha >= 128 else 0))
    cells = [source.crop((round(col * source.width / 4), round(row * source.height / 2), round((col + 1) * source.width / 4), round((row + 1) * source.height / 2))) for row in range(2) for col in range(4)]
    boxes = [cell.getbbox() for cell in cells]
    common = (min(b[0] for b in boxes), min(b[1] for b in boxes), max(b[2] for b in boxes), max(b[3] for b in boxes))
    scale = 28 / max(common[2] - common[0], common[3] - common[1])
    size = (round((common[2] - common[0]) * scale), round((common[3] - common[1]) * scale))
    strip = Image.new('RGBA', (256, 32))
    previews = []
    for index, cell in enumerate(cells):
        frame = Image.new('RGBA', (32, 32))
        frame.alpha_composite(cell.crop(common).resize(size, Image.Resampling.NEAREST), ((32 - size[0]) // 2, (32 - size[1]) // 2))
        frame.save(assets / f'jellyfish-{color}-v2-{index}.png')
        strip.alpha_composite(frame, (index * 32, 0))
        preview = Image.new('RGBA', (192, 192), '#08283d')
        preview.alpha_composite(frame.resize((192, 192), Image.Resampling.NEAREST))
        previews.append(preview.convert('RGB'))
    strip.save(assets / f'jellyfish-{color}-v2.png')
    previews[0].save(assets / f'jellyfish-{color}-v2-preview.gif', save_all=True, append_images=previews[1:], duration=600, loop=0)
palette_previews = []
for index in range(8):
    preview = Image.new('RGBA', (768, 192), '#08283d')
    for column, color in enumerate(['cyan', 'blue', 'orange', 'red']):
        frame = Image.open(assets / f'jellyfish-{color}-v2-{index}.png').convert('RGBA')
        preview.alpha_composite(frame.resize((192, 192), Image.Resampling.NEAREST), (column * 192, 0))
    palette_previews.append(preview.convert('RGB'))
palette_previews[0].save(assets / 'jellyfish-palettes-v2-preview.gif', save_all=True, append_images=palette_previews[1:], duration=600, loop=0)
print('Four palettes, eight 32x32 frames each, 4.8-second loops.')
