#!/usr/bin/env python3
"""
Security Vulnerability Fix Script for BaddBeatz Repository
Addresses 6 critical vulnerabilities found in Python dependencies
"""

import subprocess
import sys
import os
from pathlib import Path

def run_command(command, description):
    """Run a command and handle errors"""
    print(f"\n🔧 {description}")
    print(f"Running: {command}")
    
    try:
        result = subprocess.run(command, shell=True, check=True, 
                              capture_output=True, text=True)
        print(f"✅ Success: {description}")
        if result.stdout:
            print(f"Output: {result.stdout.strip()}")
        return True
    except subprocess.CalledProcessError as e:
        print(f"❌ Error: {description}")
        print(f"Error output: {e.stderr}")
        return False

def backup_current_requirements():
    """Backup current requirements"""
    print("\n📦 Creating backup of current requirements...")
    
    if os.path.exists("requirements.txt"):
        run_command("cp requirements.txt requirements_backup_$(date +%Y%m%d_%H%M%S).txt", 
                   "Backing up requirements.txt")
    
    # Create freeze of current environment
    run_command("pip freeze > current_environment_backup.txt", 
               "Creating current environment backup")

def update_system_packages():
    """Update system-level packages (pip, setuptools)"""
    print("\n🔄 Updating system packages...")
    
    # Update pip first
    success = run_command("python -m pip install --upgrade pip==25.2", 
                         "Updating pip to secure version 25.2")
    
    if success:
        # Update setuptools
        success = run_command("pip install setuptools==80.9.0", 
                             "Updating setuptools to secure version 80.9.0")
    
    return success

def update_urllib3():
    """Update urllib3 to fix critical vulnerabilities"""
    print("\n🛡️ Fixing urllib3 vulnerabilities...")
    
    return run_command("pip install urllib3==2.5.0", 
                      "Updating urllib3 to secure version 2.5.0")

def install_security_fixed_requirements():
    """Install the security-fixed requirements"""
    print("\n📋 Installing security-fixed requirements...")
    
    if os.path.exists("requirements-security-fixed.txt"):
        return run_command("pip install -r requirements-security-fixed.txt", 
                          "Installing security-fixed requirements")
    else:
        print("❌ requirements-security-fixed.txt not found!")
        return False

def verify_security_fixes():
    """Verify that security vulnerabilities are fixed"""
    print("\n🔍 Verifying security fixes...")
    
    # Check if safety is installed
    try:
        subprocess.run(["safety", "--version"], check=True, capture_output=True)
    except (subprocess.CalledProcessError, FileNotFoundError):
        print("Installing safety for security scanning...")
        run_command("pip install safety", "Installing safety scanner")
    
    # Run security scan
    print("Running security scan...")
    result = subprocess.run(["safety", "check", "--json"], 
                          capture_output=True, text=True)
    
    if result.returncode == 0:
        print("✅ No vulnerabilities found!")
        return True
    else:
        print("⚠️ Some vulnerabilities may still exist:")
        print(result.stdout)
        return False

def test_functionality():
    """Test basic functionality after updates"""
    print("\n🧪 Testing functionality...")
    
    # Test Python imports
    test_imports = [
        "import urllib3",
        "import requests", 
        "import flask",
        "import openai",
        "print('All critical imports successful')"
    ]
    
    for test_import in test_imports:
        success = run_command(f'python -c "{test_import}"', 
                            f"Testing: {test_import}")
        if not success:
            return False
    
    # Test build process
    if os.path.exists("package.json"):
        success = run_command("npm run build", "Testing build process")
        if success:
            run_command("npm run validate:build", "Validating build output")
    
    return True

def update_requirements_file():
    """Update the main requirements.txt with security fixes"""
    print("\n📝 Updating requirements.txt...")
    
    if os.path.exists("requirements-security-fixed.txt"):
        return run_command("cp requirements-security-fixed.txt requirements.txt", 
                          "Updating requirements.txt with security fixes")
    return False

def main():
    """Main execution function"""
    print("🔒 BaddBeatz Security Vulnerability Fix Script")
    print("=" * 50)
    print("This script will fix 6 critical security vulnerabilities:")
    print("- urllib3: 3 vulnerabilities (CVE-2024-37891, CVE-2025-50181, CVE-2025-50182)")
    print("- setuptools: 2 vulnerabilities (CVE-2024-6345, CVE-2025-47273)")
    print("- pip: 1 vulnerability (malicious wheel execution)")
    print("=" * 50)
    
    # Confirm execution
    response = input("\nProceed with security fixes? (y/N): ").lower().strip()
    if response != 'y':
        print("❌ Security fix cancelled by user")
        sys.exit(1)
    
    # Execute fix steps
    steps = [
        ("Backup current requirements", backup_current_requirements),
        ("Update system packages", update_system_packages),
        ("Update urllib3", update_urllib3),
        ("Install security-fixed requirements", install_security_fixed_requirements),
        ("Update requirements.txt", update_requirements_file),
        ("Verify security fixes", verify_security_fixes),
        ("Test functionality", test_functionality)
    ]
    
    failed_steps = []
    
    for step_name, step_function in steps:
        print(f"\n{'='*20} {step_name} {'='*20}")
        try:
            success = step_function()
            if not success:
                failed_steps.append(step_name)
        except Exception as e:
            print(f"❌ Unexpected error in {step_name}: {e}")
            failed_steps.append(step_name)
    
    # Summary
    print("\n" + "="*60)
    print("🎯 SECURITY FIX SUMMARY")
    print("="*60)
    
    if not failed_steps:
        print("✅ All security vulnerabilities have been successfully fixed!")
        print("\n📋 Next steps:")
        print("1. Commit the updated requirements.txt")
        print("2. Test your application thoroughly")
        print("3. Deploy the security fixes")
        print("4. Run regular security scans")
    else:
        print("⚠️ Some steps failed:")
        for step in failed_steps:
            print(f"   - {step}")
        print("\n🔧 Manual intervention may be required")
        print("Check the error messages above and fix issues manually")
    
    print("\n🔍 To verify fixes manually:")
    print("   safety check")
    print("   npm audit")
    print("   python server.py")

if __name__ == "__main__":
    main()
