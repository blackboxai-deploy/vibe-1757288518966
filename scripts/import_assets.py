import argparse
import shutil
from pathlib import Path

ASSET_TYPES = {
    'images': ['*.jpg', '*.jpeg', '*.png', '*.gif', '*.svg', '*.webp'],
    'css': ['*.css'],
    'js': ['*.js']
}

def copy_assets(src_dir, dest_dir):
    src_path = Path(src_dir)
    dest_path = Path(dest_dir)
    if not src_path.exists():
        raise FileNotFoundError(f"Source directory '{src_dir}' does not exist")

    for category, patterns in ASSET_TYPES.items():
        target = dest_path / category
        target.mkdir(parents=True, exist_ok=True)
        for pattern in patterns:
            for file in src_path.rglob(pattern):
                shutil.copy2(file, target / file.name)

def main():
    parser = argparse.ArgumentParser(description="Copy local assets into the project's assets directory")
    parser.add_argument('source', help='Path to the folder containing your assets')
    parser.add_argument('--dest', default='assets', help='Destination assets directory')
    args = parser.parse_args()
    copy_assets(args.source, args.dest)
    print(f"Assets imported from {args.source} to {args.dest}/")

if __name__ == '__main__':
    main()
