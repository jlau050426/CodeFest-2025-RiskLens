import os
import shutil

def remove_folder(folder_path: str):
    """Remove a folder or file from the filesystem."""
    try:
        if os.path.isdir(folder_path):
            shutil.rmtree(folder_path)
            print(f"Removed folder: {folder_path}")
        elif os.path.isfile(folder_path):
            os.remove(folder_path)
            print(f"Removed file: {folder_path}")
        else:
            print(f"Path not found, could not remove: {folder_path}")
    except PermissionError:
        print(f"Permission denied, could not remove: {folder_path}")
    except Exception as e:
        print(f"Error removing file or folder {folder_path}: {e}")

def remove_db(db_path):
    """Remove a database folder from the filesystem."""
    try:
        shutil.rmtree(db_path)
        print(f"Removed database folder: {db_path}")
    except FileNotFoundError:
        print(f"Database folder not found, could not remove: {db_path}")
    except Exception as e:
        print(f"Error removing database folder {db_path}: {e}")