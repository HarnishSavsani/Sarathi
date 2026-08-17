import os

# The exact case-sensitive mappings
replacements = {
    "SARATHI": "SARATHI",
    "Sarathi": "Sarathi",
    "Sarathi": "Sarathi",
    "sarathi": "sarathi"
}

# Folders and file types we MUST NOT touch
exclude_dirs = {'.git', 'node_modules', '.next', 'dist', 'build', 'out'}
exclude_exts = {'.png', '.jpg', '.jpeg', '.gif', '.svg', '.ico', '.zip'}

def replace_in_file(filepath):
    try:
        with open(filepath, 'r', encoding='utf-8') as f:
            content = f.read()
            
        new_content = content
        for old, new in replacements.items():
            new_content = new_content.replace(old, new)
            
        if new_content != content:
            with open(filepath, 'w', encoding='utf-8') as f:
                f.write(new_content)
            print(f"Updated text in: {filepath}")
    except UnicodeDecodeError:
        pass # Skip binary files safely
    except Exception as e:
        print(f"Error reading {filepath}: {e}")

def get_new_name(name):
    new_name = name
    for old, new in replacements.items():
        new_name = new_name.replace(old, new)
    return new_name

def main():
    start_path = "."
    
    # os.walk with topdown=False ensures we rename children before their parents
    for root, dirs, files in os.walk(start_path, topdown=False):
        
        # Skip our excluded directories like node_modules
        if any(ex in root.split(os.sep) for ex in exclude_dirs):
            continue
            
        # 1. Update text inside files AND rename the files
        for file in files:
            ext = os.path.splitext(file)[1].lower()
            if ext in exclude_exts or file == "rename_all.py":
                continue
                
            filepath = os.path.join(root, file)
            replace_in_file(filepath)
            
            new_name = get_new_name(file)
            if new_name != file:
                new_filepath = os.path.join(root, new_name)
                os.rename(filepath, new_filepath)
                print(f"Renamed file: {file} -> {new_name}")
                
        # 2. Rename directories
        for d in dirs:
            if d in exclude_dirs:
                continue
                
            new_name = get_new_name(d)
            if new_name != d:
                old_dirpath = os.path.join(root, d)
                new_dirpath = os.path.join(root, new_name)
                os.rename(old_dirpath, new_dirpath)
                print(f"Renamed folder: {d} -> {new_name}")

if __name__ == "__main__":
    main()