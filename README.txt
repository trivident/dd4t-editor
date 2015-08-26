Trivident.DD4T.Editor

Copyright © 2013 Trivident B.V.


This copy is distributed for evaluation purposes only.


Installation instructions:

1. Copy the folder trivident.dd4t.editor to a location on the web site which hosts the Tridion CME (suggested location: %TRIDION_HOME%\extensions\trivident.dd4t.editor)
2. Copy the file Trivident.DD4T.Editor.dll to the folder %TRIDION_HOME%\web\WebUI\WebRoot\bin
3. Create a virtual folder called DD4T inside the folder WebUI\Editors in your CME
4. Open the file Configuration\System.Config.Fragment.xml
5. Replace the string 'PATH_TO_EDITOR (Trivident.DD4T.Editor)' with the actual path to the Trivident.DD4T.Editor on your file system
6. Copy the entire contents of the file and paste it into the file %TRIDION_HOME%\web\WebUI\WebRoot\Configuration\System.config, inside the <editors> element
7. Save the System.config
8. Reset IIS

For assistance or more information contact info@trivident.com.