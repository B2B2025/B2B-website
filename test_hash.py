import sys
import os

# Set up path to reach the package
sys.path.append(r"c:\Projects\B2B\backend")

try:
    from legacy_python.users import hash_password
    print("Successfully imported hash_password")
    
    # Test valid case
    h = hash_password("testpassword123")
    print(f"Successfully hashed password: {h}")
    
    # Test empty case
    try:
        hash_password("")
    except ValueError as e:
        print(f"Caught expected ValueError for empty password: {e}")
        
except Exception as e:
    print(f"Error during test: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
