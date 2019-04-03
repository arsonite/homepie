#!/usr/bin/env
import sys;
import os;
import shutil;

# CONST-definitions
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
PERM_OPT = ["1", "2", "3", "4", "5"]
OUTPUT = """What do you want to do?
\t1. Empty a cache
\t2. Move contents of tmp to uploaded
\t3. Backup a directory/cache
\t4. Sort a cache
\t5. Create a cache and give permissions\n\n"""

# Function definitions
def emptyCache():
	foo = input("Which cache do you want to empty?")

def moveContent():
	op = input("\tDo you want to copy (cp) or move (mv)?")
	rootTmp = os.path.join(ROOT, 'tmp')
	rootUploads = os.path.join(ROOT, 'uploads') 

	for src_dir, dirs, files in os.walk(rootTmp):
		target = src_dir.replace(rootTmp, rootUploads)

		for f in files:
			source = os.path.join(src_dir, f)
			shutil.move(source, target)

def createCache():
	foo = input('Which cache do you want to create?')

# Operations
print('Python%d.%d: Script started...\n' % (sys.version_info[0], sys.version_info[1]))

temp = input(OUTPUT)
userInput = temp if temp in PERM_OPT else -1

if userInput == PERM_OPT[0]:
	emptyCache()
elif userInput == PERM_OPT[1]:
	moveContent()
else:
	print("You've entered an unknown command")

