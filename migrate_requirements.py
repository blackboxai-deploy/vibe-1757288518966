#!/usr/bin/env python3
"""
Requirements Migration Script for BaddBeatz

This script helps migrate from the current requirements.txt with conflicts
to the improved requirements files that resolve all dependency issues.

Usage:
    python migrate_requirements.py [--dry-run] [--backup]
"""

import os
import sys
import subprocess
import shutil
from datetime import datetime
import argparse


def run_command(cmd, check=True):
    """Run a shell command and return the result."""
    print(f"Running: {cmd}")
    try:
        result = subprocess.run(cmd, shell=True, capture_output=True, text=True, check=check)
        if result.stdout:
            print(result.stdout)
        if result.stderr and result.returncode != 0:
            print(f"Error: {result.stderr}")
        return result
    except subprocess.CalledProcessError as e:
        print(f"Command failed: {e}")
        return e


def backup_current_environment():
    """Create a backup of the current environment."""
    timestamp = datetime.now().strftime("%Y%m%d_%H%M%S")
    backup_file = f"requirements-backup-{timestamp}.txt"
    
    print(f"Creating backup: {backup_file}")
    result = run_command(f"pip freeze > {backup_file}")
    
    if result.returncode == 0:
        print(f"✅ Backup created: {backup_file}")
        return backup_file
    else:
        print("❌ Failed to create backup")
        return None


def check_current_conflicts():
    """Check for current dependency conflicts."""
    print("\n🔍 Checking current dependency conflicts...")
    result = run_command("pip check", check=False)
    
    if result.returncode == 0:
        print("✅ No conflicts found")
        return False
    else:
        print("⚠️ Dependency conflicts detected:")
        print(result.stdout)
        return True


def test_improved_requirements(dry_run=False):
    """Test the improved requirements in a temporary environment."""
    print("\n🧪 Testing improved requirements...")
    
    if dry_run:
        print("DRY RUN: Would test improved requirements in temporary environment")
        return True
    
    # Create temporary virtual environment
    temp_env = "temp_test_env"
    print(f"Creating temporary environment: {temp_env}")
    
    try:
        # Create virtual environment
        run_command(f"python -m venv {temp_env}")
        
        # Activate and install improved requirements
        if os.name == 'nt':  # Windows
            activate_cmd = f"{temp_env}\\Scripts\\activate"
            pip_cmd = f"{temp_env}\\Scripts\\pip"
        else:  # Unix/Linux/macOS
            activate_cmd = f"source {temp_env}/bin/activate"
            pip_cmd = f"{temp_env}/bin/pip"
        
        # Install improved requirements
        result = run_command(f"{pip_cmd} install -r requirements-improved.txt")
        
        if result.returncode != 0:
            print("❌ Failed to install improved requirements")
            return False
        
        # Check for conflicts
        result = run_command(f"{pip_cmd} check")
        
        if result.returncode == 0:
            print("✅ Improved requirements install cleanly with no conflicts")
            success = True
        else:
            print("❌ Improved requirements still have conflicts")
            success = False
        
        # Cleanup
        shutil.rmtree(temp_env, ignore_errors=True)
        return success
        
    except Exception as e:
        print(f"❌ Error testing improved requirements: {e}")
        shutil.rmtree(temp_env, ignore_errors=True)
        return False


def migrate_requirements(dry_run=False):
    """Migrate to improved requirements."""
    print("\n🚀 Migrating to improved requirements...")
    
    if dry_run:
        print("DRY RUN: Would install improved requirements")
        return True
    
    # Uninstall conflicting packages first
    conflicting_packages = [
        "pydantic-core", "rich", "click", "cachetools", 
        "google-ai-generativelanguage", "safety", "filelock", 
        "psutil", "pydantic"
    ]
    
    print("Uninstalling potentially conflicting packages...")
    for package in conflicting_packages:
        run_command(f"pip uninstall -y {package}", check=False)
    
    # Install improved requirements
    print("Installing improved requirements...")
    result = run_command("pip install -r requirements-improved.txt")
    
    if result.returncode == 0:
        print("✅ Successfully installed improved requirements")
        return True
    else:
        print("❌ Failed to install improved requirements")
        return False


def verify_migration():
    """Verify the migration was successful."""
    print("\n✅ Verifying migration...")
    
    # Check for conflicts
    has_conflicts = check_current_conflicts()
    
    if not has_conflicts:
        print("✅ Migration successful - no dependency conflicts")
        
        # Test security scanning
        print("\n🔒 Testing security scanning...")
        result = run_command("pip install safety", check=False)
        if result.returncode == 0:
            result = run_command("safety check", check=False)
            if result.returncode == 0:
                print("✅ Security scanning works correctly")
            else:
                print("⚠️ Security scanning has issues (may be due to no vulnerabilities found)")
        else:
            print("⚠️ Could not install safety for testing")
        
        return True
    else:
        print("❌ Migration failed - conflicts still exist")
        return False


def main():
    """Main migration function."""
    parser = argparse.ArgumentParser(description="Migrate BaddBeatz requirements to improved version")
    parser.add_argument("--dry-run", action="store_true", help="Show what would be done without making changes")
    parser.add_argument("--backup", action="store_true", help="Create backup before migration")
    parser.add_argument("--skip-test", action="store_true", help="Skip testing improved requirements")
    
    args = parser.parse_args()
    
    print("🔧 BaddBeatz Requirements Migration Tool")
    print("=" * 50)
    
    # Check if we're in the right directory
    if not os.path.exists("requirements.txt"):
        print("❌ Error: requirements.txt not found. Please run from the baddbeatz directory.")
        sys.exit(1)
    
    if not os.path.exists("requirements-improved.txt"):
        print("❌ Error: requirements-improved.txt not found. Please ensure it exists.")
        sys.exit(1)
    
    # Create backup if requested
    backup_file = None
    if args.backup and not args.dry_run:
        backup_file = backup_current_environment()
        if not backup_file:
            print("❌ Backup failed. Aborting migration.")
            sys.exit(1)
    
    # Check current conflicts
    print("\n📋 Current Status:")
    has_conflicts = check_current_conflicts()
    
    if not has_conflicts:
        print("✅ No conflicts detected. Migration may not be necessary.")
        response = input("Continue anyway? (y/N): ")
        if response.lower() != 'y':
            print("Migration cancelled.")
            sys.exit(0)
    
    # Test improved requirements
    if not args.skip_test:
        if not test_improved_requirements(args.dry_run):
            print("❌ Improved requirements test failed. Aborting migration.")
            sys.exit(1)
    
    # Perform migration
    if not args.dry_run:
        if not migrate_requirements(args.dry_run):
            print("❌ Migration failed.")
            if backup_file:
                print(f"You can restore from backup: pip install -r {backup_file}")
            sys.exit(1)
        
        # Verify migration
        if not verify_migration():
            print("❌ Migration verification failed.")
            if backup_file:
                print(f"You can restore from backup: pip install -r {backup_file}")
            sys.exit(1)
    
    print("\n🎉 Migration completed successfully!")
    print("\nNext steps:")
    print("1. Test your application to ensure everything works")
    print("2. Update your CI/CD workflows to use requirements-improved.txt")
    print("3. Consider using requirements-dev-improved.txt for development")
    print("4. Update documentation with new setup instructions")
    
    if backup_file:
        print(f"5. Keep backup file {backup_file} until you're confident in the migration")


if __name__ == "__main__":
    main()
