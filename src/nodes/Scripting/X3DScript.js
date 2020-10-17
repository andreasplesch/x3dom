/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * (C)2020 Andreas Plesch, Waltham, MA, U.S.A.
 * Dual licensed under the MIT and GPL
 */

/* ### X3DScript ### */
x3dom.registerNodeType(
    "X3DScript",
    "Scripting",
    defineClass( x3dom.nodeTypes.X3DScriptNode,

        /**
         * Constructor for X3DScript
         * @constructs x3dom.nodeTypes.X3DScript
         * @x3d 3.3
         * @component Core
         * @status experimental
         * @extends x3dom.nodeTypes.X3DScriptNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The Script node is used to program behaviour in a scene.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.X3DChildNode.superClass.call( this, ctx );

            /**
             * NYI.
             * Once the script has access to a X3D node (via an SFNode or MFNode value either in one of the Script node's fields or passed in as an attribute),
             * the script is able to read the contents of that node's fields. If the Script node's directOutput field is TRUE,
             * the script may also send events directly to any node to which it has access, and may dynamically establish or break routes.
             * If directOutput is FALSE (the default), the script may only affect the rest of the world via events sent through its fields.
             * The results are undefined if directOutput is FALSE and the script sends events directly to a node to which it has access.
             * @var {x3dom.fields.SFBool} load
             * @memberof x3dom.nodeTypes.X3DScript
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "directOutput", false ); //NYI

            /**
             * NYI.
             * If the Script node's mustEvaluate field is FALSE, the browser may delay sending input events to the script until its outputs are needed by the browser. If the mustEvaluate field is TRUE, the browser shall send input events to the script as soon as possible, regardless of whether the outputs are needed. The mustEvaluate field shall be set to TRUE only if the Script node has effects that are not known to the browser (such as sending information across the network). Otherwise, poor performance may result.
             * @var {x3dom.fields.SFBool} mustEvaluate
             * @memberof x3dom.nodeTypes.X3DScript
             * @initvalue false
             * @field x3d
             * @instance
             */
            this.addField_SFBool( ctx, "mustEvaluate", false ); //NYI

            /**
             * Contains all fields.x3dom mechanism to allow custom fields.
             * @var {x3dom.fields.MFNode} fields
             * @memberof x3dom.nodeTypes.X3DScript
             * @initvalue x3dom.nodeTypes.Field
             * @field x3dom
             * @instance
             */
            this.addField_MFNode( "fields", x3dom.nodeTypes.Field );

            this._domParser = new DOMParser();
            this._source = "// ecmascript source code";
            this.LANG = "ecmascript:";
            this.CDATA = "[CDATA[";
            this.endRegex = /\s*]]$/ ;
            this._ctx = ctx;
            this._callbacks = {};
        },
        {
            nodeChanged : function ()
            {
                // use textContent of dom node if it contains "ecmascript:"
                // cdata sections in html docs get converted to comments by browser
                // use the comment if it contains "ecmascript:"
                var xml = this._xmlNode;
                if ( xml.textContent.indexOf( this.LANG ) > -1 )
                {
                    this._source = xml.textContent;
                    xml.textContent = "";
                }
                xml.childNodes.forEach( function ( node )
                {
                    if ( node.nodeType == node.COMMENT_NODE )
                    {
                        if ( node.textContent.indexOf( this.LANG ) > -1 )
                        {
                            this._source = node.textContent;
                        }
                    }
                }, this );

                //cleanup
                this._source = this._source.replace( this.CDATA, "" );
                this._source = this._source.replace( this.LANG, "" );
                this._source = this._source.replace( this.endRegex, "" );

                //make fields
                this._cf.fields.nodes.forEach( function ( field )
                {
                    var fieldType = field._vf.type;
                    var fieldName = field._vf.name;
                    if ( fieldType.endsWith( "ode" ) ) // cf node
                    {
                        var type = x3dom.nodeTypes.X3DNode;
                        //TODO; get type from default value
                        this[ "addField_" + fieldType ]( fieldName, type );//type should be registered x3dom type
                    }
                    else
                    {
                        if ( field._vf.value ) {this._ctx.xmlNode.setAttribute( fieldName, field._vf.value );} // use dom to set value
                        this[ "addField_" + fieldType ]( this._ctx, fieldName, field._vf.value ); //or default value if none given
                    }
                }, this );

                //find inputs and outputs, and fields to initialize
                var outputs = [];
                var inputs = [];
                var initValues = [];
                this._cf.fields.nodes.forEach( function ( field )
                {
                    var atype = field._vf.accessType;
                    var fieldName = field._vf.name;
                    switch ( atype.toLowerCase() )
                    {
                        case "outputonly" :
                            outputs.push( fieldName );
                            initValues.push( fieldName );
                            break;
                        case "inputoutput" :
                            outputs.push( fieldName + "_changed" );
                            inputs.push( "set_" + fieldName );
                            initValues.push( fieldName );
                            break;
                        case "inputonly" :
                            inputs.push( fieldName );
                            break;
                        case "initializeonly" :
                            initValues.push( fieldName );
                        default :
                            x3dom.debug.logWarning( fieldName + " has unrecognized access type: " +  atype );
                            break;
                    }
                } );
                //wrap source
                var source = "return function wrapper ( scriptNode ) { \n";
                var callbacks = [ "initialize", "prepareEvents", "eventsProcessed", "shutdown", "getOutputs" ].concat( inputs );
                source += "var " + callbacks.join( "," ) + ";\n";
                source += "var " + outputs.join( "," ) + ";\n";
                initValues.forEach( function ( field )
                {
                    source += "var " + field + " = scriptNode._vf['" + field + "'];\n";
                } );
                Object.keys( x3dom.fields ).forEach( function ( field )
                {
                    source += "var " + field + " = x3dom.fields." + field + ";\n";
                } );
                //TODO add SFRotation, Browser, print ...
                source += this._source;
                source += "\n function getOutputs () { \n";
                source += "return { " + outputs.map( function ( c )
                {
                    return "\n" + c + " : " + c;
                } ).join( "," ) + " } };";
                source += "\n return { " + callbacks.map( function ( c )
                {
                    return "\n" + c + " : " + c;
                } ).join( "," ) + " } };";
                //make script function
                this._scriptFunction = new Function( source )();
                this._callbacks = this._scriptFunction( this ); // pass in this node
                //run initialize
                if ( this._callbacks.initialize instanceof Function )
                {
                    this._callbacks.initialize( Date.now() / 1000 );
                }
            },

            fieldChanged : function ( fieldName )
            {
                if ( this._callbacks[ fieldName ] instanceof Function )
                {
                    var preOutputs = this._callbacks.getOutputs();
                    this._callbacks[ fieldName ]( this._vf[ fieldName ], Date.now() / 1000 );
                    var postOutputs = this._callbacks.getOutputs();
                    for ( var output in postOutputs )
                    {
                        //if ( postOutputs[output] != preOutputs[output] )
                        {
                            this.postMessage( output, postOutputs[ output ] );
                        }
                    }
                }
            }
        }
    )
);
