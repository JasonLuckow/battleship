mkdir webpack-practice &&
cd webpack-practice &&
npm init -y

npm install --save-dev webpack webpack-cli
mkdir src && touch src/index.js src/greeting.js
npx webpack


npm install --save-dev html-webpack-plugin
npm install --save-dev style-loader css-loader
npm install --save-dev html-loader
npm install --save-dev webpack-dev-server

OR (as long as package file exists)

npm install 
npx webpack
npx webpack serve

SHORTCUTS:
To get started: npm install
To start development: npm run dev
To build production: npm run build
