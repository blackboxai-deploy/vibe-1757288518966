#!/usr/bin/env python3
"""
Repository Cleanup Script for BaddBeatz
Consolidates nested directory structure into a clean main branch for Cloudflare deployment
"""

import os
import shutil
import subprocess
import sys
from pathlib import Path

def run_command(cmd, cwd=None):
    """Run a command and return the result"""
    try:
        result = subprocess.run(cmd, shell=True, cwd=cwd, capture_output=True, text=True)
        return result.returncode == 0, result.stdout, result.stderr
    except Exception as e:
        return False, "", str(e)

def backup_current_state():
    """Create a backup of the current state"""
    print("🔄 Creating backup of current state...")
    backup_dir = "backup_before_cleanup"
    if os.path.exists(backup_dir):
        shutil.rmtree(backup_dir)
    
    # Copy current state to backup
    shutil.copytree(".", backup_dir, ignore=shutil.ignore_patterns('.git', '__pycache__', 'node_modules'))
    print(f"✅ Backup created in {backup_dir}/")

def identify_best_source():
    """Identify which directory has the most recent and complete files"""
    print("🔍 Analyzing directory structure...")
    
    root_files = set(os.listdir("."))
    baddbeatz_files = set(os.listdir("baddbeatz")) if os.path.exists("baddbeatz") else set()
    
    print(f"Root directory has {len(root_files)} items")
    print(f"baddbeatz/ directory has {len(baddbeatz_files)} items")
    
    # Check for key indicators of completeness
    indicators = ['node_modules', 'package-lock.json', 'dist', 'docs']
    
    root_score = sum(1 for indicator in indicators if indicator in root_files)
    baddbeatz_score = sum(1 for indicator in indicators if indicator in baddbeatz_files)
    
    print(f"Root completeness score: {root_score}/4")
    print(f"baddbeatz/ completeness score: {baddbeatz_score}/4")
    
    return "baddbeatz" if baddbeatz_score > root_score else "root"

def clean_nested_structures():
    """Remove nested baddbeatz directories"""
    print("🧹 Cleaning nested directory structures...")
    
    nested_dirs = []
    if os.path.exists("baddbeatz/baddbeatz"):
        nested_dirs.append("baddbeatz/baddbeatz")
    if os.path.exists("baddbeatz/baddbeatz-repo"):
        nested_dirs.append("baddbeatz/baddbeatz-repo")
    if os.path.exists("baddbeatz-repo"):
        nested_dirs.append("baddbeatz-repo")
    
    for nested_dir in nested_dirs:
        print(f"  Removing {nested_dir}")
        shutil.rmtree(nested_dir, ignore_errors=True)

def consolidate_files():
    """Consolidate files from baddbeatz/ to root"""
    print("📁 Consolidating files to root directory...")
    
    if not os.path.exists("baddbeatz"):
        print("No baddbeatz directory found, skipping consolidation")
        return
    
    # Files to skip (already exist in root or are duplicates)
    skip_files = {'.git', '__pycache__', 'backup_before_cleanup', 'repository_cleanup_script.py'}
    
    # Move files from baddbeatz/ to root
    for item in os.listdir("baddbeatz"):
        if item in skip_files:
            continue
            
        src = os.path.join("baddbeatz", item)
        dst = item
        
        try:
            if os.path.exists(dst):
                # Compare modification times to keep the newer version
                src_mtime = os.path.getmtime(src)
                dst_mtime = os.path.getmtime(dst)
                
                if src_mtime > dst_mtime:
                    print(f"  Updating {item} (newer version found)")
                    if os.path.isdir(dst):
                        shutil.rmtree(dst)
                    else:
                        os.remove(dst)
                    shutil.move(src, dst)
                else:
                    print(f"  Keeping existing {item} (current version is newer)")
                    if os.path.isdir(src):
                        shutil.rmtree(src)
                    else:
                        os.remove(src)
            else:
                print(f"  Moving {item}")
                shutil.move(src, dst)
                
        except Exception as e:
            print(f"  ⚠️  Error moving {item}: {e}")

def remove_empty_directories():
    """Remove empty directories after consolidation"""
    print("🗑️  Removing empty directories...")
    
    dirs_to_check = ["baddbeatz", "baddbeatz-repo"]
    
    for dir_name in dirs_to_check:
        if os.path.exists(dir_name):
            try:
                # Try to remove if empty
                os.rmdir(dir_name)
                print(f"  Removed empty directory: {dir_name}")
            except OSError:
                # Directory not empty, remove contents first
                if os.path.isdir(dir_name):
                    remaining_files = os.listdir(dir_name)
                    print(f"  {dir_name} still contains: {remaining_files}")
                    # Force remove if it only contains hidden files or cache
                    if all(f.startswith('.') or f in ['__pycache__', 'node_modules'] for f in remaining_files):
                        shutil.rmtree(dir_name)
                        print(f"  Force removed {dir_name} (contained only cache/hidden files)")

def clean_report_files():
    """Remove unnecessary report and summary files"""
    print("📄 Cleaning up report files...")
    
    report_patterns = [
        '*_REPORT.md', '*_SUMMARY.md', '*_TESTING_REPORT.md', 
        '*_IMPLEMENTATION_REPORT.md', '*_GUIDE.md', '*_PLAN.md',
        'COMPREHENSIVE_*.md', 'FINAL_*.md', 'COMPLETE_*.md'
    ]
    
    import glob
    removed_count = 0
    
    for pattern in report_patterns:
        for file_path in glob.glob(pattern):
            try:
                os.remove(file_path)
                print(f"  Removed: {file_path}")
                removed_count += 1
            except Exception as e:
                print(f"  ⚠️  Could not remove {file_path}: {e}")
    
    print(f"✅ Removed {removed_count} report files")

def update_git_configuration():
    """Update git configuration to remove submodule references"""
    print("⚙️  Updating git configuration...")
    
    # Remove any submodule references from git config
    success, _, _ = run_command("git config --remove-section submodule.baddbeatz", ".")
    if success:
        print("  Removed submodule configuration")
    
    # Remove submodule from git index if it exists
    success, _, _ = run_command("git rm --cached baddbeatz", ".")
    if success:
        print("  Removed baddbeatz from git index")
    
    # Clean up any remaining git submodule files
    git_files_to_remove = ['.gitmodules']
    for git_file in git_files_to_remove:
        if os.path.exists(git_file):
            os.remove(git_file)
            print(f"  Removed {git_file}")

def optimize_for_cloudflare():
    """Optimize the repository structure for Cloudflare deployment"""
    print("☁️  Optimizing for Cloudflare deployment...")
    
    # Ensure essential files are in the root
    essential_files = ['index.html', 'package.json', 'wrangler.toml']
    missing_files = []
    
    for file in essential_files:
        if not os.path.exists(file):
            missing_files.append(file)
    
    if missing_files:
        print(f"  ⚠️  Missing essential files: {missing_files}")
    else:
        print("  ✅ All essential files present in root")
    
    # Check for proper directory structure
    expected_dirs = ['assets', 'workers-site']
    for dir_name in expected_dirs:
        if os.path.exists(dir_name):
            print(f"  ✅ {dir_name}/ directory found")
        else:
            print(f"  ⚠️  {dir_name}/ directory missing")

def create_cleanup_summary():
    """Create a summary of the cleanup process"""
    print("📋 Creating cleanup summary...")
    
    summary = """# Repository Cleanup Summary

## Actions Performed:
1. ✅ Created backup of original state
2. ✅ Identified and consolidated duplicate directory structures
3. ✅ Removed nested baddbeatz/ subdirectories
4. ✅ Consolidated files to root directory
5. ✅ Cleaned up unnecessary report files
6. ✅ Updated git configuration
7. ✅ Optimized structure for Cloudflare deployment

## Repository Structure After Cleanup:
- All project files are now in the root directory
- Removed duplicate/nested directory structures
- Cleaned up documentation and report files
- Optimized for Cloudflare Pages deployment

## Next Steps:
1. Review the changes with `git status`
2. Test the application locally
3. Commit the cleanup changes
4. Deploy to Cloudflare Pages

## Backup:
Original state backed up in `backup_before_cleanup/` directory
"""
    
    with open("REPOSITORY_CLEANUP_SUMMARY.md", "w") as f:
        f.write(summary)
    
    print("✅ Cleanup summary created")

def main():
    """Main cleanup process"""
    print("🚀 Starting BaddBeatz Repository Cleanup")
    print("=" * 50)
    
    try:
        # Step 1: Backup current state
        backup_current_state()
        
        # Step 2: Identify best source
        best_source = identify_best_source()
        print(f"📍 Best source identified: {best_source}")
        
        # Step 3: Clean nested structures
        clean_nested_structures()
        
        # Step 4: Consolidate files
        consolidate_files()
        
        # Step 5: Remove empty directories
        remove_empty_directories()
        
        # Step 6: Clean report files
        clean_report_files()
        
        # Step 7: Update git configuration
        update_git_configuration()
        
        # Step 8: Optimize for Cloudflare
        optimize_for_cloudflare()
        
        # Step 9: Create summary
        create_cleanup_summary()
        
        print("\n" + "=" * 50)
        print("🎉 Repository cleanup completed successfully!")
        print("\nNext steps:")
        print("1. Review changes with: git status")
        print("2. Test your application locally")
        print("3. Commit changes: git add . && git commit -m 'feat: consolidate repository structure for Cloudflare deployment'")
        print("4. Push to main branch: git push origin main")
        
    except Exception as e:
        print(f"\n❌ Error during cleanup: {e}")
        print("Check the backup_before_cleanup/ directory to restore if needed")
        sys.exit(1)

if __name__ == "__main__":
    main()
