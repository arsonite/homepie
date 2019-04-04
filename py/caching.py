#!/usr/bin/env
import sys;
import os;
import shutil;

# CONST-definitions
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# Outsource to JSON shared between JS, PHP and python
SUB_DIRS = ["img", "sfx", "txt", "vid"]

PERM_OPT = ["1", "2", "3", "4", "5"]
OUTPUT = """What do you want to do?
\t1. Empty a cache
\t2. Move content between caches 
\t3. Backup a directory/cache
\t4. Sort a cache
\t5. Create a cache and give permissions\n\n"""

# Function definitions
def emptyCache():
	src = os.path.join(ROOT, input("Which cache do you want to empty?"))

	for src_dir, dirs, files in os.walk(src):
		for f in files:
			target = os.path.join(src_dir, f)	
			if os.path.isfile(target):
				os.remove(target)	

def moveContent():
	DEFAULT_SUBS = ["tmp", "uploads"]
	
	roots = [DEFAULT_SUBS[0], DEFAULT_SUBS[1]]
	roots = [input('Enter source directory (default: "tmp"):'), input('Enter target directory (default: "uploads"):')]

	op = input("\tDo you want to copy (cp) or move (mv)?")
	rootTmp = os.path.join(ROOT, 'tmp')
	rootUploads = os.path.join(ROOT, 'uploads') 

	for src_dir, dirs, files in os.walk(rootTmp):
		target = src_dir.replace(rootTmp, rootUploads)
		
		for f in files:
			source = os.path.join(src_dir, f)
			destination = os.path.join(target, f)
			
			if os.path.exists(destination):
				continue
			
			shutil.move(source, target)

def createCache():
	foo = input('Which cache do you want to create?')

# Operations
print('Python%d.%d: Script started...\n' % (sys.version_info[0], sys.version_info[1]))

userInput = ""
if len(sys.argv) < 2: 
	temp = input(OUTPUT)
	userInput = temp if temp in PERM_OPT else -1
else:
	userInput = sys.argv[1]

if userInput == PERM_OPT[0]:
	emptyCache()
elif userInput == PERM_OPT[1]:
	moveContent()
elif userInput == PERM_OPT[4]:
	createCache()
else:
	print("You've entered an unknown command")
