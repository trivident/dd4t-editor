set BUILD_PATH="%1..\..\build"
echo build path = %BUILD_PATH%
dir %BUILD_PATH%

IF EXIST "%BUILD_PATH%\trivident.dd4t.editor" (
echo "removing "%BUILD_PATH%\trivident.dd4t.editor"
	rd /s /q "%BUILD_PATH%\trivident.dd4t.editor\"
)
echo "creating "%BUILD_PATH%\trivident.dd4t.editor"
md "%BUILD_PATH%\trivident.dd4t.editor"
echo 2
copy /Y "%2" "%BUILD_PATH%"
copy /Y "%1..\..\README.txt" "%BUILD_PATH%"
xcopy /Y /S "%1\Extensions" "%BUILD_PATH%\trivident.dd4t.editor\Extensions\"
xcopy /Y /S "%1\Configuration" "%BUILD_PATH%\trivident.dd4t.editor\Configuration\"
