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

            this._domParser = new DomParser();
            this._source = "// ecmascript source code";
            this.LANG = "ecmascript:";
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
            }
    )
);
/*
Script : X3DScriptNode {
  SFNode    [in,out] metadata     NULL  [X3DMetadataObject]
  MFString  [in,out] url          []    [URI]
  SFBool    []       directOutput FALSE
  SFBool    []       mustEvaluate FALSE
  # And any number of:
  fieldType [in]     fieldName
  fieldType [in,out] fieldName    initialValue
  fieldType [out]    fieldName
  fieldType []       fieldName    initialValue
}
The Script node is used to program behaviour in a scene. Script nodes typically:

signify a change or user action;
receive events from other nodes;
contain a program module that performs some computation;
effect change somewhere else in the scene by sending events.
Each Script node has associated programming language code, referenced by the url field, that is executed to carry out the Script node's function. That code is referred to as the "script" in the rest of this description. Details on the url field can be found in 9.2.1 URLs.

Browsers are not required to support any specific language. Detailed information on scripting languages is described in 29.2 Concepts. Browsers supporting a scripting language for which a language binding is specified shall adhere to that language binding (see ISO/IEC 19777).

Sometime before a script receives the first event it shall be initialized (any language-dependent or user-defined initialize() is performed). The script is able to receive and process events that are sent to it. Each event that can be received shall be declared in the Script node using the same syntax as is used in a prototype definition:

    inputOnly type name
The type can be any of the standard X3D fields (as defined in 5 Field type reference). Name shall be an identifier that is unique for this Script node.

The Script node is able to generate events in response to the incoming events. Each event that may be generated shall be declared in the Script node using the following syntax:

    outputOnly type name
If the Script node's mustEvaluate field is FALSE, the browser may delay sending input events to the script until its outputs are needed by the browser. If the mustEvaluate field is TRUE, the browser shall send input events to the script as soon as possible, regardless of whether the outputs are needed. The mustEvaluate field shall be set to TRUE only if the Script node has effects that are not known to the browser (such as sending information across the network). Otherwise, poor performance may result.

Once the script has access to a X3D node (via an SFNode or MFNode value either in one of the Script node's fields or passed in as an attribute), the script is able to read the contents of that node's fields. If the Script node's directOutput field is TRUE, the script may also send events directly to any node to which it has access, and may dynamically establish or break routes. If directOutput is FALSE (the default), the script may only affect the rest of the world via events sent through its fields. The results are undefined if directOutput is FALSE and the script sends events directly to a node to which it has access.

A script is able to communicate directly with the X3D browser to get information such as the current time and the current world URL. This is strictly defined generally by the SAI services (see Part 2 of ISO/IEC 19775) and by the language bindings of the SAI (see ISO/IEC 19777) for the specific scripting language being used.

The location of the Script node in the scene graph has no affect on its operation.
*/
