cd $PSScriptRoot

npx npm-check-updates -u
git add *
git commit -m "npx npm-check-updates -u"
npm install

echo finished
#$Host.UI.RawUI.ReadKey()
