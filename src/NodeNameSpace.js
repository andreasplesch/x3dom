/**
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 *
 * Based on code originally provided by
 * Philip Taylor: http://philip.html5.org
 */

/**
 * NodeNameSpace constructor
 *
 * @param name
 * @param document
 * @constructor
 */
x3dom.NodeNameSpace = function ( name, document )
{
    this.name = name;
    this.doc = document;
    this.baseURL = "";
    this.defMap = {};
    this.parent = null;
    this.childSpaces = [];
    this.protos = []; // the ProtoDeclarationArray
    this.lateRoutes = [];
};

/**
 * NodeNameSpace Add Node
 *
 * @param node
 * @param name
 */
x3dom.NodeNameSpace.prototype.addNode = function ( node, name )
{
    this.defMap[ name ] = node;
    node._nameSpace = this;
};

/**
 * NodeNameSpace Remove Node
 *
 * @param name
 */
x3dom.NodeNameSpace.prototype.removeNode = function ( name )
{
    var node = name ? this.defMap[ name ] : null;
    if ( node )
    {
        delete this.defMap[ name ];
        node._nameSpace = null;
    }
};

/**
 * NodeNameSpace Get Named Node
 *
 * @param name
 * @returns {*}
 */
x3dom.NodeNameSpace.prototype.getNamedNode = function ( name )
{
    return this.defMap[ name ];
};

/**
 * NodeNameSpace Get Named Element
 *
 * @param name
 * @returns {null}
 */
x3dom.NodeNameSpace.prototype.getNamedElement = function ( name )
{
    var node = this.defMap[ name ];
    return ( node ? node._xmlNode : null );
};

/**
 * NodeNameSpace Add Space
 *
 * @param space
 */
x3dom.NodeNameSpace.prototype.addSpace = function ( space )
{
    this.childSpaces.push( space );
    space.parent = this;
};

/**
 * NodeNameSpace Remove Space
 *
 * @param space
 */
x3dom.NodeNameSpace.prototype.removeSpace = function ( space )
{
    space.parent = null;
    for ( var it = 0; it < this.childSpaces.length; it++ )
    {
        if ( this.childSpaces[ it ] == space )
        {
            this.childSpaces.splice( it, 1 );
        }
    }
};

/**
 * NodeNameSpace Set Base URL
 *
 * @param url
 */
x3dom.NodeNameSpace.prototype.setBaseURL = function ( url )
{
    var i = url.lastIndexOf( "/" );
    this.baseURL = ( i >= 0 ) ? url.substr( 0, i + 1 ) : "";

    x3dom.debug.logInfo( "setBaseURL: " + this.baseURL );
};

/**
 * NodeNameSpace Get URL
 *
 * @param url
 * @returns {*}
 */
x3dom.NodeNameSpace.prototype.getURL = function ( url )
{
    if ( url === undefined || !url.length )
    {
        return "";
    }
    else
    {
        return ( ( url[ 0 ] === "/" ) || ( url.indexOf( ":" ) >= 0 ) ) ? url : ( this.baseURL + url );
    }
};

/**
 * Helper to check an element's attribute
 *
 * @param attrName
 * @returns {*}
 */
x3dom.hasElementAttribute = function ( attrName )
{
    var ok = this.__hasAttribute( attrName );
    if ( !ok && attrName )
    {
        ok = this.__hasAttribute( attrName.toLowerCase() );
    }
    return ok;
};

/**
 * Helper to get an element's attribute
 *
 * @param attrName
 * @returns {*}
 */
x3dom.getElementAttribute = function ( attrName )
{
    var attrib = this.__getAttribute( attrName );
    if ( !attrib && attrib != "" && attrName )
    {
        attrib = this.__getAttribute( attrName.toLowerCase() );
    }

    if ( attrib || !this._x3domNode )
    {
        return attrib;
    }
    else
    {
        return this._x3domNode._vf[ attrName ];
    }
};

/**
 * Helper to set an element's attribute
 *
 * @param attrName
 * @param newVal
 */
x3dom.setElementAttribute = function ( attrName, newVal )
{
    //var prevVal = this.getAttribute(attrName);
    this.__setAttribute( attrName, newVal );
    //newVal = this.getAttribute(attrName);

    var x3dNode = this._x3domNode;
    if ( x3dNode )
    {
        x3dNode.updateField( attrName, newVal );
        x3dNode._nameSpace.doc.needRender = true;
    }
};

/**
 * Returns the value of the field with the given name.
 * The value is returned as an object of the corresponding field type.
 *
 * @param {String} fieldName - the name of the field
 */
x3dom.getFieldValue = function ( fieldName )
{
    var x3dNode = this._x3domNode;

    if ( x3dNode && ( x3dNode._vf[ fieldName ] !== undefined ) )
    {
        var fieldValue = x3dNode._vf[ fieldName ];

        if ( fieldValue instanceof Object && "copy" in fieldValue )
        {
            return x3dNode._vf[ fieldName ].copy();
        }
        else
        {
            //f.i. SFString SFBool aren't objects
            return x3dNode._vf[ fieldName ];
        }
    }

    return null;
};

/**
 * Sets the value of the field with the given name to the given value.
 * The value is specified as an object of the corresponding field type.
 *
 * @param {String} fieldName  - the name of the field where the value should be set
 * @param {String} fieldvalue - the new field value
 */
x3dom.setFieldValue = function ( fieldName, fieldvalue )
{
    var x3dNode = this._x3domNode;
    if ( x3dNode && ( x3dNode._vf[ fieldName ] !== undefined ) )
    {
        // SF/MF object types are cloned based on a copy function
        if ( fieldvalue instanceof Object && "copy" in fieldvalue )
        {
            x3dNode._vf[ fieldName ] = fieldvalue.copy();
        }
        else
        {
            //f.i. SFString SFBool aren't objects
            x3dNode._vf[ fieldName ] = fieldvalue;
        }
        x3dNode.fieldChanged( fieldName );
        x3dNode._nameSpace.doc.needRender = true;
    }
};

/**
 * Returns the field object of the field with the given name.
 * The returned object is no copy, but instead a reference to X3DOM's internal field object.
 * Changes to this object should be committed using the returnFieldRef function.
 * Note: this only works for fields with pointer types such as MultiFields!
 *
 * @param {String} fieldName - the name of the field
 */
x3dom.requestFieldRef = function ( fieldName )
{
    var x3dNode = this._x3domNode;
    if ( x3dNode && x3dNode._vf[ fieldName ] )
    {
        return x3dNode._vf[ fieldName ];
    }

    return null;
};

/**
 * Commits all changes made to the internal field object of the field with the given name.
 * This must be done in order to notify X3DOM to process all related changes internally.
 *
 * @param {String} fieldName - the name of the field
 */
x3dom.releaseFieldRef = function ( fieldName )
{
    var x3dNode = this._x3domNode;
    if ( x3dNode && x3dNode._vf[ fieldName ] )
    {
        x3dNode.fieldChanged( fieldName );
        x3dNode._nameSpace.doc.needRender = true;
    }
};

/**
 * NodeNameSpace Setup Tree
 *
 * @param domNode
 * @param parent
 * @returns {*}
 */
x3dom.NodeNameSpace.prototype.setupTree = function ( domNode, parent )
{
    var n = null;

    parent = parent || null;

    if ( x3dom.isX3DElement( domNode ) )
    {
        // return if it is already initialized
        if ( domNode._x3domNode )
        {
            x3dom.debug.logWarning( "Tree is already initialized" );
            return null;
        }

        // workaround since one cannot find out which handlers are registered
        if ( ( domNode.tagName !== undefined ) &&
            ( !domNode.__addEventListener ) && ( !domNode.__removeEventListener ) )
        {
            // helper to track an element's listeners
            domNode.__addEventListener = domNode.addEventListener;
            domNode.addEventListener = function ( type, func, phase )
            {
                if ( !this._x3domNode._listeners[ type ] )
                {
                    this._x3domNode._listeners[ type ] = [];
                }
                this._x3domNode._listeners[ type ].push( func );

                //x3dom.debug.logInfo('addEventListener for ' + this.tagName + ".on" + type);
                this.__addEventListener( type, func, phase );
            };

            domNode.__removeEventListener = domNode.removeEventListener;
            domNode.removeEventListener = function ( type, func, phase )
            {
                var list = this._x3domNode._listeners[ type ];
                if ( list )
                {
                    for ( var it = 0; it < list.length; it++ )
                    {
                        if ( list[ it ] == func )
                        {
                            list.splice( it, 1 );
                            it--;
                            //x3dom.debug.logInfo('removeEventListener for ' +
                            //                    this.tagName + ".on" + type);
                        }
                    }
                }

                this.__removeEventListener( type, func, phase );
            };
        }

        // TODO (?): dynamic update of USE attribute during runtime
        if ( domNode.hasAttribute( "USE" ) || domNode.hasAttribute( "use" ) )
        {
            //fix usage of lowercase 'use'
            if ( !domNode.hasAttribute( "USE" ) )
            {
                domNode.setAttribute( "USE", domNode.getAttribute( "use" ) );
            }

            n = this.defMap[ domNode.getAttribute( "USE" ) ];
            if ( !n )
            {
                var nsName = domNode.getAttribute( "USE" ).split( "__" );

                if ( nsName.length >= 2 )
                {
                    var otherNS = this;
                    while ( otherNS )
                    {
                        if ( otherNS.name == nsName[ 0 ] )
                        {n = otherNS.defMap[ nsName[ 1 ] ];}
                        if ( n )
                        {
                            otherNS = null;
                        }
                        else
                        {
                            otherNS = otherNS.parent;
                        }
                    }
                    if ( !n )
                    {
                        n = null;
                        x3dom.debug.logWarning( "Could not USE: " + domNode.getAttribute( "USE" ) );
                    }
                }
            }
            if ( n )
            {
                domNode._x3domNode = n;
            }
            return n;
        }
        else
        {
            // check and create ROUTEs
            if ( domNode.localName.toLowerCase() === "route" )
            {
                var route = domNode;
                var fnDEF = route.getAttribute( "fromNode" ) || route.getAttribute( "fromnode" );
                var tnDEF = route.getAttribute( "toNode" ) || route.getAttribute( "tonode" );
                var fromNode = this.defMap[ fnDEF ];
                var toNode = this.defMap[ tnDEF ];
                var fnAtt = route.getAttribute( "fromField" ) || route.getAttribute( "fromfield" );
                var tnAtt = route.getAttribute( "toField" ) || route.getAttribute( "tofield" );

                if ( !( fromNode && toNode ) )
                {
                    x3dom.debug.logWarning( "not yet availabe route - can't find all DEFs for " + fnAtt + " -> " + tnAtt );
                    this.lateRoutes.push( // save to check after protoextern instances loaded
                        {
                            route : route,
                            fnDEF : fnDEF,
                            tnDEF : tnDEF,
                            fnAtt : fnAtt,
                            tnAtt : tnAtt
                        } );
                }
                else
                {
                    x3dom.debug.logInfo( "ROUTE: from=" + fromNode._DEF + ", to=" + toNode._DEF );
                    fromNode.setupRoute( fnAtt, toNode, tnAtt );
                    // Store reference to namespace for being able to remove route later on
                    route._nodeNameSpace = this;
                }
                return null;
            }

            // attach X3DOM's custom field interface functions
            domNode.requestFieldRef = x3dom.requestFieldRef;
            domNode.releaseFieldRef = x3dom.releaseFieldRef;
            domNode.getFieldValue = x3dom.getFieldValue;
            domNode.setFieldValue = x3dom.setFieldValue;

            // find the NodeType for the given dom-node
            var nodeType = x3dom.nodeTypesLC[ domNode.localName.toLowerCase() ];
            if ( nodeType === undefined )
            {
                x3dom.debug.logWarning( "Unrecognised X3D element &lt;" + domNode.localName + "&gt;." );
            }
            else
            {
                //active workaround for missing DOMAttrModified support
                if ( ( x3dom.userAgentFeature.supportsDOMAttrModified === false )
                    && ( domNode instanceof Element ) )
                {
                    if ( domNode.setAttribute && !domNode.__setAttribute )
                    {
                        domNode.__setAttribute = domNode.setAttribute;
                        domNode.setAttribute = x3dom.setElementAttribute;
                    }

                    if ( domNode.getAttribute && !domNode.__getAttribute )
                    {
                        domNode.__getAttribute = domNode.getAttribute;
                        domNode.getAttribute = x3dom.getElementAttribute;
                    }

                    if ( domNode.hasAttribute && !domNode.__hasAttribute )
                    {
                        domNode.__hasAttribute = domNode.hasAttribute;
                        domNode.hasAttribute = x3dom.hasElementAttribute;
                    }
                }

                // create x3domNode
                var ctx = {
                    doc       : this.doc,
                    runtime   : this.doc._x3dElem.runtime,
                    xmlNode   : domNode,
                    nameSpace : this
                };
                n = new nodeType( ctx );

                // find and store/link _DEF name
                if ( domNode.hasAttribute( "DEF" ) )
                {
                    n._DEF = domNode.getAttribute( "DEF" );
                    this.defMap[ n._DEF ] = n;
                }
                else
                {
                    if ( domNode.hasAttribute( "id" ) )
                    {
                        n._DEF = domNode.getAttribute( "id" );
                        this.defMap[ n._DEF ] = n;
                    }
                }

                // add experimental highlighting functionality
                if ( domNode.highlight === undefined )
                {
                    domNode.highlight = function ( enable, colorStr )
                    {
                        var color = x3dom.fields.SFColor.parse( colorStr );
                        this._x3domNode.highlight( enable, color );
                        this._x3domNode._nameSpace.doc.needRender = true;
                    };
                }

                // link both DOM-Node and Scene-graph-Node
                n._xmlNode = domNode;
                domNode._x3domNode = n;

                //register ProtoDeclares and convert ProtoInstance to new nodes
                domNode.querySelectorAll( ":scope > *" ) //static nodelist
                    . forEach( function ( childDomNode )
                    {
                        var tag = childDomNode.localName.toLowerCase();
                        if ( tag == "protodeclare" )
                        { this.protoDeclare( childDomNode ); }
                        else if ( tag == "externprotodeclare" )
                        { this.externProtoDeclare( childDomNode ); }
                        else if ( tag == "protoinstance" )
                        { this.protoInstance( childDomNode, domNode ); }
                    }, this );

                // call children
                domNode.childNodes.forEach( function ( childDomNode ) //live nodelist
                {
                    var c = this.setupTree( childDomNode, n );
                    if ( c )
                    {
                        n.addChild( c, childDomNode.getAttribute( "containerField" ) );
                    }
                }, this );

                n.nodeChanged();
                return n;
            }
        }
    }
    else if ( domNode.localName )
    {
        var tagLC = domNode.localName.toLowerCase();
        if ( parent && tagLC == "x3dommetagroup" )
        {
            domNode.childNodes.forEach( function ( childDomNode )
            {
                var c = this.setupTree( childDomNode, parent );
                if ( c )
                {
                    parent.addChild( c, childDomNode.getAttribute( "containerField" ) );
                }
            }.bind( this ) );
        }

        else if ( tagLC == "protodeclare" || tagLC == "externprotodeclare" || tagLC == "protoinstance" )
        {
            n = null;//this.protoInstance( domNode, parent._xmlNode );
        }

        else if ( domNode.localName.toLowerCase() == "is" )
        {
            //silence warning
            //check for connect, just because
            if ( domNode.querySelectorAll( "connect" ).length == 0 )
            {
                x3dom.debug.logWarning( "IS statement without connect link: " + domNode.parentElement.localName );
            }
        }
        else
        {
            // be nice to users who use nodes not (yet) known to the system
            x3dom.debug.logWarning( "Unrecognised X3D element &lt;" + domNode.localName + "&gt;." );
            n = null;
        }
    }
    return n;
};

x3dom.NodeNameSpace.prototype.protoInstance = function ( domNode, domParent )
{
    if ( !domNode.localName ) {return;}
    if ( domNode.localName.toLowerCase() !== "protoinstance" ) {return;}
    if ( domNode._x3dom ) {return;}

    var name = domNode.getAttribute( "name" );
    //console.log( "found ProtoInstance", name, domNode );
    var protoDeclaration = this.protos.find( function ( proto ) { return proto.name == name; } );
    if ( protoDeclaration == undefined )
    {
        x3dom.debug.logWarning( "ProtoInstance without a ProtoDeclaration " + name );
        return;
    }
    //construct dom node
    var protoInstanceDom = document.createElement( name );

    //DEF/USE
    if ( domNode.hasAttribute( "DEF" ) )
    {
        protoInstanceDom.setAttribute( "DEF", domNode.getAttribute( "DEF" ) );
    }

    else if ( domNode.hasAttribute( "USE" ) )
    {
        protoInstanceDom.setAttribute( "USE", domNode.getAttribute( "USE" ) );
    }

    if ( domNode.hasAttribute( "containerField" ) )
    {
        protoInstanceDom.setAttribute( "containerField", domNode.getAttribute( "containerField" ) );
    }

    //set fields to instance values
    domNode.querySelectorAll( ":scope > fieldValue , :scope > fieldvalue" )
        . forEach( function ( fieldValue )
        {
            var name = fieldValue.getAttribute( "name" );
            var cfValue = fieldValue.querySelectorAll( ":scope > *" );
            //check if Node value
            if ( cfValue.length > 0 )
            {
                cfValue.forEach( function ( val )
                {
                    val.setAttribute( "containerField", name );
                    protoInstanceDom.appendChild( val );
                } );
            }
            else
            {
                var value = fieldValue.getAttribute( "value" );
                protoInstanceDom.setAttribute( name, value );
            }
        } );

    if ( protoDeclaration.isExternProto && protoDeclaration.needsLoading )
    {
        this.loadExternProtoAsync( protoDeclaration, protoInstanceDom, domNode, domParent );
        return;
    }
    this.doc.mutationObserver.disconnect();//do not record
    //domParent.appendChild( protoInstanceDom );
    domNode.insertAdjacentElement( "afterend", protoInstanceDom ); // do not use appendChild since scene parent may be already transferred
    this.doc.mutationObserver.observe( this.doc._scene._xmlNode, { attributes: true, attributeOldValue: true, childList: true, subtree: true } );
    domNode._x3dom = protoInstanceDom;
    //this.doc.onNodeAdded( protoInstanceDom, parent._xmlNode );
};

x3dom.NodeNameSpace.prototype.loadExternProtoAsync = function ( protoDeclaration, protoInstanceDom, domNode, parentDom )
{
    //use queue to ensure processing in correct sequence
    protoDeclaration.instanceQueue.push( {
        "protoInstanceDom" : protoInstanceDom,
        "domNode"          : domNode,
        "parentDom"        : parentDom
    } );
    domNode._x3dom = protoInstanceDom;
    var that = this;
    var url = this.getURL( protoDeclaration.url [ 0 ] );
    fetch( url )
        .then( function ( response ) { return response.text(); } )
        .then( function ( text )
        {
            var parser = new DOMParser();
            var doc = parser.parseFromString( text, "application/xml" );
            var scene = doc.querySelector( "X3D" );
            if ( scene == null )
            {
                doc = parser.parseFromString( responseText, "text/html" );
                scene = doc.querySelector( "X3D" );
            }
            //find hash
            var hash = url.split( "#" ).slice( -1 )[ 0 ];
            var selector = hash == "" ? "ProtoDeclare" : "ProtoDeclare[name='" + hash + "']";
            var declareNode = scene.querySelector( selector );
            //transfer name
            declareNode.setAttribute( "name", protoDeclaration.name );
            //remove current placeholder declaration
            var currentIndex = that.protos.findIndex( function ( d )
            {
                return d == protoDeclaration;
            } );
            that.protos.splice( currentIndex, 1 );
            that.protoDeclare( declareNode ); //add declaration as internal
            //add instance(s) in order
            var instance;
            while ( instance = protoDeclaration.instanceQueue.shift() ) //process in correct sequence
            {
                that.doc.mutationObserver.disconnect();//do not record mutation
                instance.domNode.insertAdjacentElement( "afterend", instance.protoInstanceDom ); // do not use appendChild since scene parent may be already transferred
                that.doc.mutationObserver.observe( that.doc._scene._xmlNode, { attributes: true, attributeOldValue: true, childList: true, subtree: true } );
                that.doc.onNodeAdded( instance.protoInstanceDom, instance.parentDom );
                instance.domNode._x3dom = instance.protoInstanceDom;

                that.lateRoutes.forEach( function ( route )
                {
                    var fromNode = that.defMap[ route.fnDEF ];
                    var toNode = that.defMap[ route.tnDEF ];
                    if ( ( fromNode && toNode ) )
                    {
                        x3dom.debug.logInfo( "fixed ROUTE: from=" + fromNode._DEF + ", to=" + toNode._DEF );
                        fromNode.setupRoute( route.fnAtt, toNode, route.tnAtt );
                        route.route._nodeNameSpace = that;
                    }
                } );
            };
            protoDeclaration.needsLoading = false;
        } )
        .catch( function ( error )
        {
            x3dom.debug.logError( "ExternProto fetch failed: " + error );
            protoDeclaration.needsLoading = false;
            return null;
        } );
};

x3dom.NodeNameSpace.prototype.externProtoDeclare = function ( domNode )
{
    var name = domNode.getAttribute( "name" );
    var url = x3dom.fields.MFString.parse( domNode.getAttribute( "url" ) );
    var protoDeclaration = new x3dom.ProtoDeclaration( this, name, null, null, true, url );
    this.protos.push( protoDeclaration );
    //protoinstance checks for name and triggers loading
};

x3dom.NodeNameSpace.prototype.protoDeclare = function ( domNode )
{
    var name = domNode.getAttribute( "name" );

    //console.log( "found ProtoDeclare", name, domNode );
    var protoInterface = domNode.querySelector( "ProtoInterface" );

    var fields = [];
    if ( protoInterface )
    {
        var domFields = protoInterface.querySelectorAll( "field" );
        domFields.forEach( function ( node )
        {
            fields.push( {
                "name"       : node.getAttribute( "name" ),
                "accessType" : node.getAttribute( "accessType" ),
                "dataType"   : node.getAttribute( "type" ),
                "value"      : node.getAttribute( "value" ),
                "cfValue"    : node.querySelectorAll( ":scope > *" )
            } );
        } );
    }

    var protoBody = domNode.querySelector( "ProtoBody" );

    if ( protoBody )
    {
        //find IS and make internal route template
        protoBody._ISRoutes = {};

        protoBody.querySelectorAll( "IS" ).forEach( function ( ISnode )
        {
            //check if inside another nested ProtoDeclare protobody
            var parentBody = ISnode.parentElement;
            while ( parentBody.localName.toLowerCase() !== "protobody" )
            {
                parentBody = parentBody.parentElement;
            }
            if ( parentBody !== protoBody ) {return;} // skip

            ISnode.querySelectorAll( "connect" ).forEach( function ( connect )
            {
                var ISparent = ISnode.parentElement;
                //assign unique DEF to parent if needed
                if ( ISparent.hasAttribute( "DEF" ) == false )
                {
                    var defname = "_proto_" +
                        ISparent.tagName + "_"
                        + x3dom.protoISDEFuid++ ;
                    ISparent.setAttribute( "DEF", defname );
                    //add to defmap if protoinstance which has been already parsed
                    if ( ISparent.localName.toLowerCase() == "protoinstance" )
                    {
                        if ( ISparent._x3domNode )
                        {
                            ISparent._x3domNode._DEF = defname ;
                            ISparent._x3domNode.typeNode._nameSpace.defMap[ defname ] = ISparent._x3domNode ;
                        }
                    }
                }
                var protoField = connect.getAttribute( "protoField" );
                var nodeDEF =  ISparent.getAttribute( "DEF" );
                var nodeField = connect.getAttribute( "nodeField" );
                if ( !protoBody._ISRoutes[ protoField ] )
                {
                    protoBody._ISRoutes[ protoField ] = [];
                }
                protoBody._ISRoutes[ protoField ].push( {
                    "nodeDEF"   : nodeDEF,
                    "nodeField" : nodeField
                } );
            } );
        } );

        var protoDeclaration = new x3dom.ProtoDeclaration( this, name, protoBody, fields );
        protoDeclaration.registerNode();
        this.protos.push( protoDeclaration );
    }
    else
    {
        x3dom.debug.logWarning( "ProtoDeclare without a ProtoBody definition: " + domNode.name );
    }
    return "ProtoDeclare";
};

x3dom.ProtoDeclaration = function ( namespace, name, protoBody, fields, isExternProto, url )
{
    this._nameSpace = namespace; // main scene name space
    this.name = name;
    this._protoBody = protoBody || null;
    this.fields = fields || [];
    this.isExternProto = isExternProto || false;
    this.url = url || [];
    this.needsLoading = true;
    this.instanceQueue = [];
};

x3dom.ProtoDeclaration.prototype.registerNode = function ()
{
    var that = this;
    x3dom.registerNodeType(
        that.name,
        "Core", // ProtoComponent
        defineClass( x3dom.nodeTypes.X3DNode,

            /**
             * generic Constructor for named prototype
             * @constructs x3dom.nodeTypes[this.name]
             * @x3d 3.3
             * @component Core
             * @status experimental
             * @extends x3dom.nodeTypes.X3DNode
             * @param {Object} [ctx=null] - context object, containing initial settings like namespace
             * @classdesc X3DBindableNode is the abstract base type for all bindable children nodes.
             */
            function ( ctx )
            {
                x3dom.nodeTypes[ that.name ].superClass.call( this, ctx );

                //fields
                that.fields.filter( function ( field )
                {
                    return !field.dataType.endsWith( "ode" ); //_vf fields
                } )
                    . forEach( function ( field )
                    {
                    //set interface defaults
                        if ( ctx && ctx.xmlNode && !ctx.xmlNode.hasAttribute( field.name ) )
                        {
                            ctx.xmlNode.setAttribute( field.name, field.value );
                        }
                        this[ "addField_" + field.dataType ]( ctx, field.name, field.value );
                    }, this );
                this._cf_hash = {};
                that.fields.filter( function ( field )
                {
                    return field.dataType.endsWith( "ode" ); //_cf fields
                } )
                    . forEach( function ( field )
                    {
                    //set interface defaults for cf fields
                        if ( ctx && ctx.xmlNode )
                        {
                            if ( ctx.xmlNode.querySelectorAll( "[containerField='" + field.name + "']" ).length == 0 )
                            {
                                field.cfValue.forEach( function ( sfnodedom )
                                {
                                    ctx.xmlNode.appendChild( sfnodedom.cloneNode( true ) );
                                } );
                            }
                        }
                        //find node type from IS in body
                        var ISRoutes = that._protoBody._ISRoutes;
                        var ISconnection = ISRoutes[ field.name ][ 0 ];
                        var nodeField = ISconnection.nodeField;
                        var ISDomNode = that._protoBody.querySelector( "[DEF=" + ISconnection.nodeDEF + "]" );
                        //create temp node to get type
                        var type = x3dom.nodeTypes.X3DNode;
                        var IStype = ISDomNode.localName.toLowerCase();
                        if ( IStype in x3dom.nodeTypesLC )
                        {
                            var ISNode = new x3dom.nodeTypesLC[ IStype ]( ctx );
                            type = ISNode._cf[ nodeField ].type;
                        }
                        this[ "addField_" + field.dataType ]( field.name, type );//type should be registered x3dom type
                        this._cf_hash[ field.name ] = "trigger";
                    }, this );

                //initial
                var nameSpaceName = "protoNS";
                if ( ctx.xmlNode.hasAttribute( "DEF" ) )
                {
                    nameSpaceName = ctx.xmlNode.getAttribute( "DEF" ) + "NS";
                }
                this.innerNameSpace = new x3dom.NodeNameSpace( nameSpaceName, ctx.doc ); // instance name space
                this.innerNameSpace.setBaseURL( ctx.nameSpace.baseURL + that.name );
                that._nameSpace.addSpace( this.innerNameSpace );

                //transfer proto definitions if any
                that._nameSpace.protos.forEach( function ( protoDeclaration )
                {
                    this.innerNameSpace.protos.push( protoDeclaration );
                }, this );

                this.nodes = [];
                this.protoBodyClone = that._protoBody.cloneNode( true );
                this.declaration = that;
                this.isProtoInstance = true;
                this._changing = false;
                this._externTries = 0;
                this._maxTries = 5;
            },
            {
                nodeChanged : function ( nodeField )
                {
                    if ( this._changing ) {return;}

                    this._changing = true;

                    var body = this.protoBodyClone;

                    //register ProtoDeclares and convert ProtoInstance to new nodes
                    body.querySelectorAll( ":scope > *" ) //static nodelist
                        .forEach( function ( childDomNode )
                        {
                            var tag = childDomNode.localName.toLowerCase();
                            if ( tag == "protodeclare" )
                            { this.innerNameSpace.protoDeclare( childDomNode ); }
                            else if ( tag == "externprotodeclare" )
                            { this.innerNameSpace.externProtoDeclare( childDomNode ); }
                            else if ( tag == "protoinstance" )
                            { this.innerNameSpace.protoInstance( childDomNode, body ); }
                        },
                        this );

                    var children = this.protoBodyClone.childNodes;

                    for ( var i = 0; i < children.length; i++ )
                    {
                        var c = this.innerNameSpace.setupTree.call( this.innerNameSpace, children[ i ], this );

                        if ( c != null )
                        {
                            this.nodes.push( c );
                        }
                    };
                    this.typeNode = this.nodes[ 0 ];
                    this.helperNodes = this.nodes.slice( 1 );

                    //set initial values
                    for ( field in this._vf )
                    {
                        this.fieldChanged( field );
                    }
                    for ( field in this._cf )
                    {
                        var cf = this._cf[ field ];
                        if ( "nodes" in cf )
                        {
                            if ( this._cf_hash[ field ] !== this._get_cf_hash( field )
                                || field == nodeField ) //changed
                            {
                                this.fieldChanged( field );
                            }
                        }
                        else
                        {
                            this.fieldChanged( field );
                        }
                    }

                    //add fieldwatchers to nodeFields to forward event out
                    //todo: only for output fields
                    for ( field in this._vf )
                    {
                        var ISRoutes = this.declaration._protoBody._ISRoutes;
                        if ( field in ISRoutes ) //misbehaved Protos may have unused fields
                        {
                            this._setupFieldWatchers( field );
                        }
                    };
                    this._changing = false;

                    //save a current hash of cf children
                    for ( field in this._cf )
                    {
                        if ( "nodes" in this._cf[ field ] )
                        {
                            this._cf_hash[ field ] = this._get_cf_hash( field );
                        }
                    }
                },

                fieldChanged : function ( field )
                {
                    try
                    {
                        //todo: check if input field
                        var ISRoutes = this.declaration._protoBody._ISRoutes;
                        if ( ! ( field in ISRoutes ) ) {return;}
                        ISRoutes[ field ].forEach( function ( ISNode )
                        {
                            var instanceNode = this.innerNameSpace.defMap[ ISNode.nodeDEF ];

                            if ( instanceNode == undefined ) //probably unfinished externproto
                            {
                                var ISparent = this.protoBodyClone.querySelector( "[DEF=" + ISNode.nodeDEF + "]" );
                                if ( ISparent.tagName.toLowerCase() == "protoinstance" )
                                {
                                    if ( this._externTries++ < this._maxTries )
                                    {
                                        x3dom.debug.logWarning( " ExternProto instance attempt: " + this._externTries );
                                        //try again
                                        var timer = setTimeout( this.fieldChanged.bind( this ), 1000, field );
                                    }
                                }
                                return;
                            }

                            this._externTries = 0;
                            //forward
                            //potentially check for cf values
                            //strip set_ and _changed
                            var nodeField = this._normalizeName( ISNode.nodeField, instanceNode );
                            if ( field in this._vf )
                            {
                                instanceNode._vf[ nodeField ] = this._vf[ field ];
                                instanceNode.fieldChanged( nodeField );
                            }
                            else if ( field in this._cf )
                            {
                                instanceNode._cf[ nodeField ] = this._cf[ field ];//(re)add reference

                                //transfer parents/children
                                var nodes = [];
                                if ( instanceNode._cfFieldTypes[ nodeField ] == "MFNode" )
                                {
                                    nodes = this._cf[ field ].nodes;
                                }
                                else if ( instanceNode._cfFieldTypes[ nodeField ] == "SFNode"
                                            && this._cf[ field ].node )
                                {
                                    nodes = [ this._cf[ field ].node ];
                                }
                                else
                                {
                                    x3dom.debug.logWarning( "Unexpected field type: " + instanceNode._cfFieldTypes[ nodeField ] );
                                }

                                //first remove all field childnodes
                                instanceNode._childNodes.forEach( function ( sfnode )
                                {
                                    instanceNode.removeChild( sfnode, nodeField, "force" );
                                } );

                                // then re-add new child nodes to instance
                                nodes.forEach( function ( sfnode, i )
                                {
                                    instanceNode.addChild( sfnode, nodeField );
                                } );

                                if ( instanceNode._cfFieldTypes[ nodeField ] == "MFNode" )
                                {
                                    // now the _cf nodes array may contain duplicates
                                    // remove the first one
                                    for ( var i = 0; i < nodes.length; i++ )
                                    {
                                        var node = nodes[ i ];
                                        for ( var j = nodes.length - 1; j > i; j-- )
                                        {
                                            if ( node == nodes[ j ] )
                                            {
                                                nodes.splice( j, 1 );
                                            }
                                        }
                                    }
                                }

                                instanceNode.nodeChanged( nodeField );
                            }
                        }, this );
                    }
                    catch ( error )
                    {
                        x3dom.debug.logWarning( " Proto warning: " + error );
                    };
                },

                _normalizeName : function ( name, node )
                {
                    if ( name in node._vf )
                    {
                        return name;
                    }
                    return name.replace( /^set_/, "" ).replace( /_changed$/, "" );
                },

                _setupFieldWatchers : function ( field )
                {
                    this.declaration._protoBody._ISRoutes[ field ].forEach( function ( ISNode )
                    {
                        var instanceNode = this.innerNameSpace.defMap[ ISNode.nodeDEF ];
                        if ( instanceNode == undefined )
                        {
                            var ISparent = this.protoBodyClone.querySelector( "[DEF=" + ISNode.nodeDEF + "]" );
                            if ( ISparent.tagName.toLowerCase() == "protoinstance" )
                            {
                                if ( this._externTries++ < this._maxTries )
                                {
                                    x3dom.debug.logWarning( " retrying ExternProto: " + this._externTries );
                                    //try again
                                    var timer = setTimeout( this._setupFieldWatchers.bind( this ), 1000, field );
                                }
                            }
                            return;
                        }
                        var nodeField = this._normalizeName( ISNode.nodeField, instanceNode );
                        if ( !instanceNode._fieldWatchers[ nodeField ] )
                        {
                            instanceNode._fieldWatchers[ nodeField ] = [];
                        }
                        instanceNode._fieldWatchers[ nodeField ].push(
                            this.postMessage.bind( this, field ) ); // forward
                    }, this );
                },

                _get_cf_hash : function ( field )
                {
                    var nodes = this._cf[ field ].nodes;
                    return nodes.length;
                }
            }
        )
    );
};
