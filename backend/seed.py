import sys
from app import create_app
from extensions import db
from models import Role, User

def seed_database():
    app = create_app()
    
    with app.app_context():
        print("🌱 Seeding Database...")

        # ---------------------------------------------------------
        # 1. Create Roles
        # ---------------------------------------------------------
        roles_to_create = ['Admin', 'Company Manager', 'Employee']
        created_roles = 0
        
        for role_name in roles_to_create:
            role = Role.query.filter_by(name=role_name).first()
            if not role:
                new_role = Role(name=role_name)
                db.session.add(new_role)
                print(f"   > Role created: {role_name}")
                created_roles += 1
            else:
                print(f"   > Role already exists: {role_name}")
        
        # Commit roles first to ensure IDs are generated
        try:
            db.session.commit()
        except Exception as e:
            print(f"Error seeding roles: {e}")
            db.session.rollback()
            return

        # ---------------------------------------------------------
        # 2. Create Default Admin User
        # ---------------------------------------------------------
        admin_email = "admin@system.com"
        admin_user = User.query.filter_by(email=admin_email).first()
        
        if not admin_user:
            # Fetch the Admin role object we just ensured exists
            admin_role = Role.query.filter_by(name='Admin').first()
            
            if admin_role:
                new_admin = User(
                    username="SystemAdmin",
                    email=admin_email,
                    role_id=admin_role.id,
                    company_id=None, # Admins do not belong to a specific company
                    is_verified=True
                )
                new_admin.set_password("AdminPass123!") # Change this in production
                
                db.session.add(new_admin)
                try:
                    db.session.commit()
                    print(f"   > Admin User created: {admin_email} (Password: AdminPass123!)")
                except Exception as e:
                    print(f"Error creating admin: {e}")
                    db.session.rollback()
            else:
                print("Error: Admin role could not be found.")
        else:
            print(f"   > Admin User already exists: {admin_email}")

        print("✅ Seeding complete.")

if __name__ == "__main__":
    seed_database()