from pathlib import Path
from PIL import Image

assets = Path(__file__).parent / 'assets'
source = Image.open(assets / 'ocean-source-v2.png').convert('RGBA')
names = ['jellyfish', 'clicker', 'operator', 'onlineCa', 'restApi', 'scep', 'cmpv2', 'autoEnrollment', 'est', 'acme', 'cmpv3', 'k8sCertManager', 'certificate', 'signing-key', 'fish', 'seaweed']
rows = [0, .285, .555, .79, 1]
columns = [[0, .255, .49, .76, 1], [0, .27, .49, .76, 1], [0, .263, .482, .76, 1], [0, .255, .49, .76, 1]]
for i, name in enumerate(names):
    row, col = divmod(i, 4)
    bounds = (round(columns[row][col] * source.width), round(rows[row] * source.height), round(columns[row][col + 1] * source.width), round(rows[row + 1] * source.height))
    if name == 'fish':
        bounds = (bounds[0], round(.82 * source.height), bounds[2], bounds[3])
    sprite = source.crop(bounds)
    sprite = sprite.crop(sprite.getbbox())
    sprite.thumbnail((28, 28), Image.Resampling.NEAREST)
    frame = Image.new('RGBA', (32, 32))
    frame.alpha_composite(sprite, ((32 - sprite.width) // 2, (32 - sprite.height) // 2))
    frame.save(assets / f'{name}.png')
print('Prepared 16 separate transparent 32x32 sprites.')
