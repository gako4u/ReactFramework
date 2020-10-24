cd $PSScriptRoot

$defaultProjectName = "my-react-project"

npx create-react-app $defaultProjectName --template typescript
del  ".\README.md"
move ".\$defaultProjectName\*" "."
rd   ".\$defaultProjectName"
git add *
git commit -m "npx create-react-app $defaultProjectName --template typescript"

echo finished
#$Host.UI.RawUI.ReadKey()
