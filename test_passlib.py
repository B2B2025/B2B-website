from passlib.context import CryptContext

try:
    print("Testing passlib with bcrypt...")
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    h = pwd_context.hash("testpassword")
    print(f"Hash successful: {h}")
except Exception as e:
    print(f"Error: {type(e).__name__}: {e}")
    import traceback
    traceback.print_exc()
