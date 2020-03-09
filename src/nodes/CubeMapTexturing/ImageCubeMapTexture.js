/** @namespace x3dom.nodeTypes */
/*
 * X3DOM JavaScript Library
 * http://www.x3dom.org
 *
 * (C)2009 Fraunhofer IGD, Darmstadt, Germany
 * Dual licensed under the MIT and GPL
 */

/* ### ImageCubeMapTexture ### */
x3dom.registerNodeType(
    "ImageCubeMapTexture",
    "CubeMapTexturing",
    defineClass( x3dom.nodeTypes.X3DEnvironmentTextureNode,

        /**
         * Constructor for ComposedCubeMapTexture
         * @constructs x3dom.nodeTypes.ComposedCubeMapTexture
         * @x3d 3.3
         * @component CubeMapTexturing
         * @status experimental
         * @extends x3dom.nodeTypes.X3DEnvironmentTextureNode
         * @param {Object} [ctx=null] - context object, containing initial settings like namespace
         * @classdesc The ImageCubeMapTexture node defines a cubic environment map source
         * as a single file format that contains multiple images, one for each side.
         */
        function ( ctx )
        {
            x3dom.nodeTypes.ComposedCubeMapTexture.superClass.call( this, ctx );

            this._type = "environmentMap";
        },
        {
            getTexUrl : function ()
            {
                return [
                    this._nameSpace.getURL( this._vf.url[ 0 ] )
                ];
            }
        }
    )
);
