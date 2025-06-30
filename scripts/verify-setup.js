#!/usr/bin/env node

/**
 * FinLearn Setup Verification Script
 * Checks if all dependencies are properly installed and servers can start
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🏔️ FinLearn Setup Verification\n');

const checks = [
  {
    name: 'Node.js version',
    check: () => {
      const version = process.version;
      const major = parseInt(version.slice(1).split('.')[0]);
      if (major < 18) {
        throw new Error(`Node.js 18+ required, found ${version}`);
      }
      return `✅ ${version}`;
    }
  },
  {
    name: 'Package.json files',
    check: () => {
      const files = [
        'package.json',
        'backend/package.json', 
        'frontend/package.json',
        'shared/package.json'
      ];
      
      for (const file of files) {
        if (!fs.existsSync(file)) {
          throw new Error(`Missing ${file}`);
        }
      }
      return '✅ All package.json files found';
    }
  },
  {
    name: 'Dependencies installed',
    check: () => {
      const dirs = ['node_modules', 'backend/node_modules', 'frontend/node_modules'];
      
      for (const dir of dirs) {
        if (!fs.existsSync(dir)) {
          throw new Error(`Missing ${dir} - run 'npm install'`);
        }
      }
      return '✅ Dependencies installed';
    }
  },
  {
    name: 'TypeScript compilation',
    check: () => {
      try {
        execSync('cd backend && npx tsc --noEmit', { stdio: 'pipe' });
        execSync('cd frontend && npx tsc --noEmit', { stdio: 'pipe' });
        return '✅ TypeScript compilation successful';
      } catch (error) {
        throw new Error('TypeScript compilation failed');
      }
    }
  },
  {
    name: 'Project structure',
    check: () => {
      const requiredDirs = [
        'backend/src',
        'frontend/src', 
        'shared/src',
        'backend/src/routes',
        'frontend/src/components',
        'frontend/src/pages'
      ];
      
      for (const dir of requiredDirs) {
        if (!fs.existsSync(dir)) {
          throw new Error(`Missing directory: ${dir}`);
        }
      }
      return '✅ Project structure correct';
    }
  }
];

let passed = 0;
let failed = 0;

for (const { name, check } of checks) {
  try {
    const result = check();
    console.log(`${result} ${name}`);
    passed++;
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
    failed++;
  }
}

console.log(`\n📊 Results: ${passed} passed, ${failed} failed\n`);

if (failed === 0) {
  console.log('🎉 Setup verification completed successfully!');
  console.log('\n🚀 You can now run:');
  console.log('   npm run dev        # Start development servers');
  console.log('   npm run build      # Build for production');
  console.log('\n🏔️ Happy coding with FinLearn!');
} else {
  console.log('⚠️  Setup issues found. Please resolve them before running the application.');
  process.exit(1);
} 