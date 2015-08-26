console.log('loading SchemaDD4TField extension HELLOWORLD');
Type.registerNamespace("JSA.Extensions.UI");
JSA.Extensions.UI.DD4TField = function DD4TField() {
    Tridion.OO.enableInterface(this, "JSA.Extensions.UI.DD4TField");
    this.addInterface("Tridion.DisposableObject");
    var p = this.properties;
    p.dd4tCheck = false;
    var c = p.controls = {};
    p.ns = "http://www.sdltridion.com/2011/DD4TField";
};

JSA.Extensions.UI.DD4TField.prototype.initialize = function DD4TField$initialize(deckPage) {
    console.log(">>initialize");
    var p = this.properties;
    var c = p.controls;
    var ns = Tridion.Constants.Namespaces;
    ns["dd4t"] = p.ns;

    var dd4tSpan = null;

    switch (deckPage) {
        case "SchemaDesignTab":
            c.dd4tCheck = $("#SchemaDesignTab_SchemaDesignFieldDesigner_SchemaFieldDD4T_checkbox");
            dd4tSpan = $("#SchemaDesignTab_SchemaDesignFieldDesigner_SchemaFieldDD4T_span");
            c.fieldDesigner = $controls.getControl($("#SchemaDesignFieldDesigner"), "Tridion.Controls.FieldDesigner");
            break;
        case "MetadataDesignTab":
            c.dd4tCheck = $("#MetadataDesignTab_MetadataDesignFieldDesigner_MDSchemaFieldDD4T_checkbox");
            dd4tSpan = $("#MetadataDesignTab_MetadataDesignFieldDesigner_MDSchemaFieldDD4T_span");
            c.fieldDesigner = $controls.getControl($("#MetadataDesignFieldDesigner"), "Tridion.Controls.FieldDesigner");
            break;
    }
    if (dd4tSpan != null) {
        console.log("initializing dd4t span " + dd4tSpan + ", display before: " + dd4tSpan.style.display);
        dd4tSpan.style.display = "none";
        console.log("initializing dd4t span " + dd4tSpan + ", display after: " + dd4tSpan.style.display);
    }
    

    $evt.addEventHandler($display.getItem(), "change", Function.getDelegate(this, this.onSchemaChanged));
    $evt.addEventHandler(c.dd4tCheck, "click", Function.getDelegate(this, this.onDD4TChecked));
    $evt.addEventHandler(c.fieldDesigner, "updateview", Function.getDelegate(this, this.onUpdateView));

    //this.onSchemaChanged();
    console.log("<<initialize");

};

JSA.Extensions.UI.DD4TField.prototype.onSchemaChanged = function DD4TField$onSchemaChanged() {
    console.log(">>onSchemaChanged");
    var c = this.properties.controls;
    var schema = $display.getItem();

    // TODO: hide 'follow link' field if the schema type is incorrect
    if (schema && (schema.getSubType() == $const.SchemaPurpose.TEMPLATE_PARAMETERS || schema.getSubType() == $const.SchemaPurpose.BUNDLE)) {
       // $css.undisplay(c.fieldValidatorList.parentNode);
    }
    else {
       // $css.display(c.fieldValidatorList.parentNode);
    }

    console.log("<<onSchemaChanged");

};

function findAncestor (el, id) {
	console.log('looking for ancestor with id ' + id);
    while ((el = el.parentElement) && el.name != 'body' && el.id != id) {
		console.log(el.id);
	}
    return el;
}


JSA.Extensions.UI.DD4TField.prototype.onUpdateView = function DD4TField$onUpdateView() {
    console.log(">>UpdateView");
    var p = this.properties;
    var c = p.controls;
	console.log(c.dd4tCheck);
	for(var key in c){
		console.log('property: ' + key + ' with value ' + c[key]);
	}
	console.log(c.dd4tCheck.id);
    var schema = $display.getItem();


    var fieldNode = c.fieldDesigner.getFieldXml();
	
    if (fieldNode) {
        var dd4tCheck = $('#' + c.dd4tCheck.id);
        var dd4tSpan = dd4tCheck.parentElement;
        console.log('dd4tCheck: ');
		console.log(dd4tCheck);
        console.log('dd4tSpan: ');
		console.log(dd4tSpan);
		
		var isMetadata = dd4tCheck.id.indexOf('Metadata') > -1;
		console.log(dd4tCheck.id);
		console.log(dd4tCheck.id.indexOf('Metadata'));
		
		console.log('is metadata: ' + isMetadata);		
        var sb = isMetadata ? $("#MetadataDesignFieldDesignerXmlType") : $("#SchemaDesignFieldDesignerXmlType");
		console.log(sb);
		console.log('field type: ' + sb.selectedOptions[0].value);
        dd4tSpan.style.display = sb.selectedOptions[0].value == "ComponentLinkField" || sb.selectedOptions[0].value == "MultimediaLinkField" ? "" : "none";
        c.dd4tCheck.disabled = (schema && (schema.isReadOnly() || schema.isLocalized()));

        console.log($xml.selectSingleNode(fieldNode, '/tcm:*/tcm:ExtensionXml'));
        var followLinkNode = $xml.selectSingleNode(fieldNode, '/tcm:*/tcm:ExtensionXml/dd4t:configuration/dd4t:followlink');
        if (followLinkNode != null) {
            console.log("inner text of followLinkNode: " + followLinkNode.textContent);
        }
        var followLink = (followLinkNode != null && followLinkNode.textContent == 'true') ? true : false;
        console.log('followLink: ' + followLink);

        dd4tCheck.checked = followLink;


    }
    console.log("<<UpdateView");
};

JSA.Extensions.UI.DD4TField.prototype.onDD4TChecked = function DD4TField$onDD4TChecked() {
    console.log(">>onDD4TChecked");
    var p = this.properties;
    var c = p.controls;

    var fieldXml = c.fieldDesigner.getFieldXml();
    console.log(fieldXml);
    if (fieldXml) {
        var fieldDocument = fieldXml.ownerDocument;
        var extensionXmlElement = $xml.selectSingleNode(fieldXml, "tcm:ExtensionXml");
        if (!extensionXmlElement) {
            //no extension xml point available so we need to add it
            extensionXmlElement = $xml.createElementNS(fieldDocument, $const.Namespaces.tcm, "tcm:ExtensionXml");
            fieldXml.appendChild(extensionXmlElement);
        }

        // get the checkbox
        var dd4tCheck = c.dd4tCheck; // $("#SchemaDesignTab_SchemaDesignFieldDesigner_SchemaFieldDD4T_checkbox");
        console.log('found checkbox with value ' + dd4tCheck.checked);
        // set the xml value to the value of the checkbox
        var configurationNode = $xml.selectSingleNode(extensionXmlElement, "dd4t:configuration");
        if (!configurationNode) {
            console.log("no dd4t configuration yet, creating root node now");
            $xml.setInnerXml(extensionXmlElement, "<dd4t:configuration xmlns:dd4t='{0}'><dd4t:followlink>{1}</dd4t:followlink></dd4t:configuration>".format(p.ns, dd4tCheck.checked));
        } else {
            console.log("found dd4t configuration already, updating value");
            var followLinkNode = $xml.selectSingleNode(configurationNode, "dd4t:followlink");			
			followLinkNode.textContent = dd4tCheck.checked;
        }
        console.log("about to set field xml to " + fieldXml.outerXml);
        c.fieldDesigner.setFieldXml(fieldXml);
        console.log("finished setting field xml");
    }
    console.log("<<onDD4TChecked");
    return true;
};

Tridion.Controls.Deck.registerInitializeExtender("SchemaDesignTab", JSA.Extensions.UI.DD4TField);
Tridion.Controls.Deck.registerInitializeExtender("MetadataDesignTab", JSA.Extensions.UI.DD4TField);