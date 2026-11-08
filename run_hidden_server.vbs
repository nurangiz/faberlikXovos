Set WshShell = CreateObject("WScript.Shell")
WshShell.CurrentDirectory = "C:\Users\AliCom\Desktop\faberlik"
WshShell.Run """C:\Program Files\nodejs\node.exe"" server\server.js", 0, False
