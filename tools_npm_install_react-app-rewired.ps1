cd $PSScriptRoot

function Install([string]$command) {
	cmd.exe /c $command
	cmd.exe /c git add *
	cmd.exe /c git commit -m """namespace を使えるようにする設定 - $command"""
}

Install("npm install -D react-app-rewired");
Install("npm install -D customize-cra");

echo finished
cmd.exe /c pause
