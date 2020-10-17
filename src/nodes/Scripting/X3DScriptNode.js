/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * (C)2020 Andreas Plesch, Waltham, MA, U.S.A.
 * Dual licensed under the MIT and GPL
 */

/* ### X3DScriptNode ### */
x3dom.registerNodeType(
    "X3DScriptNode",
    "Scripting",
    defineClass( x3dom.nodeTypes.X3DChildNode,

        /**
         * Constructor for X3DScriptNode
         * @constructs x3dom.nodeTypes.X3DScriptNode
         * @x3d 3.3
         * @component Core
         * @status experimental
         * @extends x3dom.nodeTypes.X3DChildNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc This abstract node type is the base type for all scripting nodes.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.X3DChildNode.superClass.call( this, ctx );

            /**
             * Associated programming language code, referenced by the url field, that is executed to carry out the Script node's function.
             * @var {x3dom.fields.MFString} url
             * @memberof x3dom.nodeTypes.X3DScriptNode
             * @initvalue []
             * @field x3d
             * @instance
             */
            this.addField_MFString( ctx, "url", [] );
        }
    )
);
