cd $PSScriptRoot

npm update
git add *
git commit -m "npm update"

echo finished
#$Host.UI.RawUI.ReadKey()
