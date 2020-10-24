cd $PSScriptRoot

function Install([string]$command) {
	cmd.exe /c $command
	#cmd.exe /c git add *
	#cmd.exe /c git commit -m ""$command""
}

Install("npm install -S is-plain-object");
Install("npm install -S immutable");

Install("npm install -S redux");

Install("npm install -S react-redux");
Install("npm install -D @types/react-redux");

Install("npm install -S redux-saga");

Install("npm install -S react-router-dom");
Install("npm install -D @types/react-router-dom");

git add *
git commit -m "npm install"

echo finished
#$Host.UI.RawUI.ReadKey()
